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
        extras: JSON.stringify({ sessionInfoVersion: '3', version: 'v4' })
      });

      const url = `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;

      logger.info('COEX', 'Abrindo popup manual da Meta...', { url }, cid);

      const popup = window.open(
        url,
        'fb-signup',
        'width=600,height=700,status=no,resizable=yes,scrollbars=yes'
      );

      if (!popup) {
        reject(new Error('popup: O popup foi bloqueado pelo navegador. Por favor, permita popups para este site.'));
        return;
      }

      // Intelligent Timeout & Abandonment detection
      const timeoutLimit = 300000; // 5 min for manual flow (more flexible)
      const startTime = Date.now();

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://www.facebook.com') return;

        // Event for Auth Code
        if (event.data?.type === 'WA_EMBEDDED_SIGNUP_CODE') {
          const { code } = event.data;
          if (code) {
            logger.info('COEX', 'Código de autorização recebido', null, cid);
            result.code = code;
          }
        }

        // Event for Metadata (waba_id, phone_number_id)
        if (event.data?.type === 'WA_EMBEDDED_SIGNUP') {
          try {
            const parsed = typeof event.data === 'string' 
              ? JSON.parse(event.data) 
              : event.data;
              
            if (parsed.event === 'FINISH') {
              const { waba_id, phone_number_id } = parsed.data;
              logger.info('COEX', 'Evento FINISH recebido', { waba_id, phone_number_id }, cid);
              result.waba_id = waba_id;
              result.phone_number_id = phone_number_id;

              // If we already have the code, we can resolve
              if (result.code) {
                cleanup();
                resolve(result as { code: string; waba_id?: string; phone_number_id?: string });
              }
            }
          } catch (e) {
            logger.error('COEX', 'Erro ao processar mensagem WA_EMBEDDED_SIGNUP', e, cid);
          }
        }
      };

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        clearTimeout(timeout);
      };

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('timeout: O fluxo demorou demais para responder.'));
      }, timeoutLimit);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          const duration = Date.now() - startTime;
          cleanup();
          
          if (result.code) {
            // If we have at least the code, resolve even if FINISH didn't arrive or failed
            resolve(result as { code: string; waba_id?: string; phone_number_id?: string });
            return;
          }

          if (duration < 5000) {
            reject(new Error('Fluxo interrompido prematuramente.'));
          } else {
            reject(new Error('Interação cancelada pelo usuário.'));
          }
        }
      }, 1000);

      window.addEventListener('message', handleMessage);
    });
  }
}

export const metaSDK = MetaSDKService.getInstance();

