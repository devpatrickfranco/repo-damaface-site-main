import { logger } from '../utils/logger';

class MetaSDKService {
  private static instance: MetaSDKService;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private loadError: string | null = null;
  private lastPopupTime: number = 0;

  private constructor() { }

  public static getInstance(): MetaSDKService {
    if (!MetaSDKService.instance) {
      MetaSDKService.instance = new MetaSDKService();
    }
    return MetaSDKService.instance;
  }

  public async loadSDK(): Promise<void> {
    if (this.isLoaded) return;
    if (this.isLoading) {
      return new Promise((resolve, reject) => {
        const check = setInterval(() => {
          if (this.isLoaded) { resolve(); clearInterval(check); }
          if (this.loadError) { reject(new Error(this.loadError)); clearInterval(check); }
        }, 100);
      });
    }

    this.isLoading = true;
    this.loadError = null;

    return new Promise((resolve, reject) => {
      try {
        // @ts-ignore
        window.fbAsyncInit = () => {
          // @ts-ignore
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
            cookie: true,
            xfbml: true,
            version: 'v18.0',
          });
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        };

        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          this.loadError = 'adblock: Falha ao carregar SDK da Meta. Verifique seu AdBlocker.';
          this.isLoading = false;
          reject(new Error(this.loadError));
        };

        document.head.appendChild(script);
      } catch (err) {
        this.loadError = 'Erro inesperado ao injetar SDK';
        this.isLoading = false;
        reject(err);
      }
    });
  }

  /**
   * Opens the Embedded Signup Popup manually (bypass SDK)
   * This provides better control over redirect_uri and avoids adblock issues.
   */
  public async launchSignup(cid: string): Promise<{ code: string; waba_id?: string; phone_number_id?: string }> {
    return new Promise((resolve, reject) => {
      const redirectUri = 'https://www.damaface.com.br/franqueado/whatsapp';
      const clientId = '1455707326041548';
      const configId = '706297902568044';

      let result: { code?: string; waba_id?: string; phone_number_id?: string } = {};

      const params = new URLSearchParams({
        client_id: clientId,
        config_id: configId,
        response_type: 'code',
        redirect_uri: redirectUri,
        display: 'popup',
        override_default_response_type: 'true',
        extras: JSON.stringify({
          setup: {},
          featureType: 'whatsapp_business_app_onboarding', // Ativa o fluxo Coex (Business App + Cloud API simultâneos)
          sessionInfoVersion: '3',
        })
      });

      const url = `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;

      console.log('%c[COEX] 🚀 STEP 1 — Popup sendo aberto [modo: whatsapp_business_app_onboarding]', 'color: #4CAF50; font-weight: bold;', { url, redirectUri, configId });
      logger.info('COEX', 'Abrindo popup manual da Meta...', { url }, cid);

      const popup = window.open(
        url,
        'fb-signup',
        'width=600,height=700,status=no,resizable=yes,scrollbars=yes'
      );

      if (!popup) {
        console.error('[COEX] ❌ Popup bloqueado pelo navegador!');
        reject(new Error('popup: O popup foi bloqueado pelo navegador. Por favor, permita popups para este site.'));
        return;
      }

      console.log('%c[COEX] ✅ STEP 2 — Popup aberto com sucesso. Aguardando eventos postMessage...', 'color: #4CAF50; font-weight: bold;');
      console.log('%c[COEX] 👂 Listener de postMessage registrado. Origens aceitas: facebook.com, damaface.com.br', 'color: #2196F3;');

      // Intelligent Timeout & Abandonment detection
      const timeoutLimit = 300000; // 5 min for manual flow (more flexible)
      const startTime = Date.now();

      const handleMessage = (event: MessageEvent) => {
        // Log EVERY message before filtering — to see if Meta is sending on a different origin
        console.log('%c[COEX] 📨 postMessage recebido (raw)', 'color: #FF9800; font-weight: bold;', {
          origin: event.origin,
          type: typeof event.data,
          data: event.data,
          timestamp: new Date().toISOString(),
        });

        const allowedOrigins = ['https://www.facebook.com', 'https://facebook.com', 'https://www.damaface.com.br'];
        if (!allowedOrigins.includes(event.origin)) {
          console.log('%c[COEX] ⏭️ Mensagem ignorada — origem não permitida:', 'color: #9E9E9E;', event.origin);
          return;
        }

        console.log('%c[COEX] ✅ Origem permitida — processando mensagem...', 'color: #4CAF50;', { origin: event.origin, type: event.data?.type });

        // Event for Auth Code (code arrives here)
        if (event.data?.type === 'WA_EMBEDDED_SIGNUP_CODE') {
          console.log('%c[COEX] 🔑 STEP 3a — Evento WA_EMBEDDED_SIGNUP_CODE recebido', 'color: #9C27B0; font-weight: bold;', event.data);
          const { code } = event.data;
          if (code) {
            result.code = code;
            logger.info('COEX', 'Code recebido', null, cid);
            console.log('%c[COEX] 🔑 Code capturado! Estado atual do result:', 'color: #9C27B0;', { ...result });
            console.log('%c[COEX] ⏳ Aguardando evento FINISH com waba_id e phone_number_id...', 'color: #FF9800;');
            // Resolve immediately if FINISH already arrived with the IDs
            if (result.waba_id && result.phone_number_id) {
              console.log('%c[COEX] 🎯 FINISH já havia chegado antes! Resolvendo promise com dados completos.', 'color: #4CAF50; font-weight: bold;', { ...result });
              cleanup();
              resolve(result as { code: string; waba_id?: string; phone_number_id?: string });
            }
          } else {
            console.warn('[COEX] ⚠️ WA_EMBEDDED_SIGNUP_CODE recebido MAS sem campo "code"', event.data);
          }
        }

        // Event for Metadata (waba_id, phone_number_id arrive here via FINISH)
        if (event.data?.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('%c[COEX] 🏁 STEP 3b — Evento WA_EMBEDDED_SIGNUP recebido', 'color: #E91E63; font-weight: bold;', event.data);
          try {
            const parsed = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

            // Fix 1: Handle all known formats (sessionInfo > data > direct properties)
            // sessionInfo is the standard in Coex v4+ / newer Meta flows
            const payload = parsed.sessionInfo || parsed.data || parsed;
            const waba_id = payload.waba_id;
            const phone_number_id = payload.phone_number_id;

            console.log('%c[COEX] 🔍 WA_EMBEDDED_SIGNUP payload extraído:', 'color: #E91E63;', {
              event: parsed.event,
              waba_id,
              phone_number_id,
              isFinish: parsed.event === 'FINISH'
            });

            // Fix 2: Extraction doesn't strictly depend on "FINISH" event anymore
            if (waba_id) {
              console.log('%c[COEX] ✅ waba_id ENCONTRADO:', 'color: #4CAF50; font-weight: bold;', waba_id);
              result.waba_id = waba_id;
            }
            if (phone_number_id) {
              console.log('%c[COEX] ✅ phone_number_id ENCONTRADO:', 'color: #4CAF50; font-weight: bold;', phone_number_id);
              result.phone_number_id = phone_number_id;
            }

            if (waba_id || phone_number_id) {
              logger.info('COEX', 'Metadata recebido', { waba_id, phone_number_id, event: parsed.event }, cid);
            }

            // Resolve if it's a FINISH event OR if we have both IDs and the code
            const isDone = parsed.event === 'FINISH' || (result.waba_id && result.phone_number_id);

            if (isDone) {
              console.log('%c[COEX] 📊 Estado do result pronto para resolução:', 'color: #E91E63;', { ...result });

              if (result.code) {
                console.log('%c[COEX] 🎯 STEP 5 — Dados completos e Code presente! Resolvendo promise.', 'color: #4CAF50; font-weight: bold;', { ...result });
                cleanup();
                resolve(result as { code: string; waba_id?: string; phone_number_id?: string });
              } else {
                console.log('%c[COEX] ⏳ Metadata parcial recebido, mas ainda esperando o Code...', 'color: #FF9800;');
              }
            }
          } catch (e) {
            console.error('[COEX] ❌ Erro ao fazer parse do evento WA_EMBEDDED_SIGNUP:', e, event.data);
            logger.error('COEX', 'Erro ao processar metadata', e, cid);
          }
        }
      };

      const cleanup = () => {
        console.log('%c[COEX] 🧹 Cleanup — removendo listener e timers', 'color: #9E9E9E;');
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        clearTimeout(timeout);
      };

      const timeout = setTimeout(() => {
        console.error('[COEX] ⏰ TIMEOUT — Fluxo não respondeu em 5 minutos.');
        cleanup();
        reject(new Error('timeout: O fluxo demorou demais para responder.'));
      }, timeoutLimit);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          const duration = Date.now() - startTime;
          console.log('%c[COEX] 🪟 Popup foi fechado', 'color: #FF9800; font-weight: bold;', {
            duration: `${(duration / 1000).toFixed(1)}s`,
            resultAtClose: { ...result },
          });
          cleanup();

          if (result.code) {
            if (!result.waba_id || !result.phone_number_id) {
              console.warn('[COEX] ⚠️ Popup fechou COM code mas SEM waba_id/phone_number_id! Backend usará fallback.', { ...result });
            } else {
              console.log('%c[COEX] ✅ Popup fechou com todos os dados. Resolvendo.', 'color: #4CAF50;', { ...result });
            }
            // If we have at least the code, resolve even if FINISH didn't arrive or failed
            resolve(result as { code: string; waba_id?: string; phone_number_id?: string });
            return;
          }

          if (duration < 5000) {
            console.error('[COEX] ❌ Popup fechou muito cedo (< 5s) — provavelmente bloqueado ou erro.');
            reject(new Error('Fluxo interrompido prematuramente.'));
          } else {
            console.warn('[COEX] ⚠️ Popup fechado pelo usuário sem completar o fluxo.');
            reject(new Error('Interação cancelada pelo usuário.'));
          }
        }
      }, 1000);

      console.log('%c[COEX] 👂 Listener ativo. Complete o fluxo no popup para ver os próximos logs.', 'color: #2196F3; font-weight: bold;');
      window.addEventListener('message', handleMessage);
    });
  }
}

export const metaSDK = MetaSDKService.getInstance();