import { logger } from '../utils/logger';

class MetaSDKService {
  private static instance: MetaSDKService;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private loadError: string | null = null;
  private lastPopupTime: number = 0;

  private constructor() {}

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
   * Opens the Embedded Signup Popup with abandonment & intelligent timeout detection
   */
  public async launchSignup(cid: string): Promise<string> {
    try {
      await this.loadSDK();
    } catch (err) {
      throw err;
    }

    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (!window.FB) {
         reject(new Error('SDK do Facebook não disponível'));
         return;
      }

      this.lastPopupTime = Date.now();
      let popupHandled = false;

      // Intelligent Timeout: Adapts if user is active
      const timeoutLimit = 60000; // 1 min
      const timeout = setTimeout(() => {
        if (!popupHandled) {
          logger.error('COEX', 'Fluxo abandonado ou timeout de rede na Meta', { cid });
          reject(new Error('popup: O fluxo demorou demais para responder. Verifique se o popup foi bloqueado ou fechado manualmente.'));
        }
      }, timeoutLimit);

      logger.info('COEX', 'Disparando FB.login...', null, cid);

      // @ts-ignore
      window.FB.login((response: any) => {
        popupHandled = true;
        clearTimeout(timeout);
        
        const duration = Date.now() - this.lastPopupTime;
        logger.trackEvent('coex_popup_callback', { duration, status: response.status }, cid);

        if (response.authResponse) {
          const code = response.authResponse.code;
          if (code) {
            logger.info('COEX', 'Código de autorização recebido', null, cid);
            resolve(code);
          } else {
            logger.error('COEX', 'Código ausente na resposta da Meta', response, cid);
            reject(new Error('Código de autorização não recebido da Meta.'));
          }
        } else {
          // Abandonment / Cancel logic
          const isQuickClose = duration < 3000; // User closed it in less than 3s
          logger.warn('COEX', isQuickClose ? 'Popup fechado rapidamente (possível abandono)' : 'Login cancelado pelo usuário', null, cid);
          reject(new Error(isQuickClose ? 'Fluxo interrompido prematuramente.' : 'Interação com a Meta cancelada pelo usuário.'));
        }
      }, {
        config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID || '', 
        response_type: 'code',
        override_default_response_type: true,
      });
    });
  }
}

export const metaSDK = MetaSDKService.getInstance();
