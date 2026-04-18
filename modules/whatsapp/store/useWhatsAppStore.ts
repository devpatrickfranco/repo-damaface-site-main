import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { whatsappApi } from '../api/whatsapp-api';
import { 
  WhatsAppState, 
  RegistrationStatus, 
  WabaConnection, 
  MessagePayload 
} from '../types';
import { withRetry } from '../utils/retry-manager';
import { mapError } from '../utils/error-mapper';
import { logger } from '../utils/logger';

interface WhatsAppStore extends WhatsAppState {
  currentCorrelationId: string | null;
  featureFlags: {
    coexEnabled: boolean;
  };
  
  // Actions
  fetchStatus: () => Promise<void>;
  connect: (data: { code: string; waba_id?: string; phone_number_id?: string }) => Promise<void>;
  sendMessage: (payload: MessagePayload) => Promise<void>;
  resetError: () => void;
  setOperationPending: (pending: boolean) => void;
  startFlow: () => string; // Generates CID for a new flow
}

const ALLOWED_TRANSITIONS: Record<RegistrationStatus, RegistrationStatus[]> = {
  'disconnected': ['connecting', 'pending'],
  'pending': ['connecting', 'active', 'failed', 'disconnected'],
  'connecting': ['active', 'failed', 'disconnected'],
  'active': ['disconnected', 'suspended', 'failed', 'connecting'],
  'failed': ['connecting', 'disconnected'],
  'suspended': ['disconnected', 'connecting'],
};

export const useWhatsAppStore = create<WhatsAppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      status: 'disconnected',
      connection: null,
      loading: false,
      isSyncing: false,
      error: null,
      isOperationPending: false,
      currentCorrelationId: null,
      featureFlags: {
        coexEnabled: true,
      },

      setOperationPending: (pending) => set({ isOperationPending: pending }),

      resetError: () => set({ error: null }),

      /**
       * Starts a new flow and returns CID
       */
      startFlow: () => {
        const cid = logger.generateCorrelationId();
        set({ currentCorrelationId: cid });
        logger.info('Module', 'Novo fluxo iniciado', { cid });
        return cid;
      },

      /**
       * Fetch current status - Source of Truth
       */
      fetchStatus: async () => {
        if (get().loading) return;

        set({ loading: true, isSyncing: true, error: null });
        const cid = get().currentCorrelationId || undefined;
        logger.info('Store', 'Iniciando sincronização com backend...', { cid });

        try {
          const connection = await withRetry(() => whatsappApi.getStatus(cid));
          
          const nextStatus = connection.registration_status;

          set({ 
            connection, 
            status: nextStatus, 
            loading: false,
            isSyncing: false,
            featureFlags: { coexEnabled: true } 
          });
          
          logger.trackEvent('sync_success', { status: nextStatus }, cid);
        } catch (error: any) {
          const mappedError = mapError(error);
          set({ 
            error: mappedError, 
            loading: false,
            isSyncing: false,
            status: get().status === 'active' ? 'active' : 'failed'
          });
          logger.error('Store', 'Falha na sincronização', mappedError, cid);
        }
      },

      /**
       * Embedded Signup Connection Flow with Failsafe
       */
      connect: async (data: { code: string; waba_id?: string; phone_number_id?: string }) => {
        if (get().isOperationPending) return;

        if (!get().featureFlags.coexEnabled) {
          const err = { type: 'business_rule', message: 'Fluxo de conexão desabilitado administrativamente.', actionable: false, retryable: false };
          set({ error: err as any });
          logger.warn('COEX', 'Tentativa de conexão com Feature Flag desabilitada');
          return;
        }
        
        const cid = get().currentCorrelationId || get().startFlow();
        set({ isOperationPending: true, error: null, loading: true });
        
        try {
          const response = await whatsappApi.exchangeEmbeddedToken(data, cid);
          
          if (response.success) {
            logger.trackEvent('coex_token_exchanged', null, cid);
            await get().fetchStatus();
          } else {
            throw new Error(response.message || 'Falha na conexão');
          }
        } catch (error: any) {
          const mappedError = mapError(error);
          set({ error: mappedError });
          logger.error('COEX', 'Erro na troca de token', mappedError, cid);
        } finally {
          set({ isOperationPending: false, loading: false });
        }
      },

      sendMessage: async (payload: MessagePayload) => {
        if (get().status !== 'active') {
          set({ error: { type: 'business_rule', message: 'Conexão inativa', actionable: true, retryable: false } as any });
          return;
        }

        const cid = get().currentCorrelationId || undefined;
        set({ loading: true });
        try {
          await whatsappApi.sendMessage(payload, cid);
          await get().fetchStatus();
        } catch (error: any) {
          set({ error: mapError(error) });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'whatsapp-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        status: state.status, 
        connection: state.connection,
        featureFlags: state.featureFlags
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.connection) {
          state.isSyncing = true;
          logger.info('Hydration', 'Estado restaurado. Sincronização pendente.');
          
          setTimeout(() => state.fetchStatus(), 100);
        }
      }
    }
  )
);

/**
 * Elite Multi-Tab Sync: Listener for Cross-Tab Consistency
 */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'whatsapp-storage') {
      logger.info('Sync', 'Mudança detectada em outra aba. Sincronizando...');
      useWhatsAppStore.getState().fetchStatus();
    }
  });

  window.addEventListener('focus', () => {
     logger.info('Sync', 'Janela focada. Validando status...');
     useWhatsAppStore.getState().fetchStatus();
  });
}
