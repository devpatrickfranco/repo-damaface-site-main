import React, { useEffect } from 'react';
import { useWhatsAppStore } from '../store/useWhatsAppStore';
import { ConnectionBanner } from '../components/ConnectionBanner';
import { EmbeddedSignupButton } from '../components/EmbeddedSignupButton';
import { WhatsAppSkeleton } from '../components/WhatsAppSkeleton';
import { ChatPanel } from '../components/chat/ChatPanel';
import { RefreshCw, AlertTriangle, ShieldCheck, Activity, Layers, Globe, MessageSquare } from 'lucide-react';
import { logger } from '../utils/logger';

export function WhatsAppModule() {
  const {
    status,
    connection,
    loading,
    isSyncing,
    error,
    fetchStatus,
    resetError,
    currentCorrelationId,
    startFlow,
    featureFlags
  } = useWhatsAppStore();

  useEffect(() => {
    const cid = currentCorrelationId || startFlow();
    logger.info('Module', 'Montado. Iniciando busca de status Source of Truth...', { cid });
    fetchStatus();

    // Capturar código do Embedded Signup se estiver em um popup (fluxo redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && window.opener) {
      const waba_id = urlParams.get('waba_id') || undefined;
      const phone_number_id = urlParams.get('phone_number_id') || undefined;
      logger.info('Module', 'Código detectado no popup. Enviando para opener...', { cid, waba_id, phone_number_id });
      window.opener.postMessage({ type: 'WA_EMBEDDED_SIGNUP_CODE', code, waba_id, phone_number_id }, '*');
      window.close();
    }
  }, [fetchStatus, currentCorrelationId, startFlow]);

  if (loading && !connection) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <WhatsAppSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/20">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">WhatsApp Business</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie suas conexões WABA e conversas centralizadas
          </p>
        </div>
      </div>

      {/* Suspended banner */}
      {status === 'suspended' && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <p className="text-sm font-black text-red-400 uppercase tracking-widest">Acesso Suspenso</p>
            <p className="text-xs text-red-400/70 font-medium">Esta conta do WhatsApp foi desativada por violação de políticas ou questões administrativas.</p>
          </div>
        </div>
      )}

      {/* Sync indicator */}
      {isSyncing && connection && (
        <div className="flex items-center justify-between px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[11px] font-bold text-green-400 uppercase">Validando Source of Truth...</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-green-500 font-bold">
            <span>CID: {currentCorrelationId?.split('-')[1]}</span>
            <Globe className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Error layer */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-300">{error.message}</p>
            {error.type === 'client_blocked' && (
              <p className="text-xs text-red-400/70 mt-1 font-medium italic">
                Aviso: Scripts de terceiros (Meta) detectados. Verifique se o seu AdBlocker está interferindo na conexão.
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              {(error.actionable || error.retryable) && (
                <button
                  onClick={() => { resetError(); fetchStatus(); }}
                  className="text-[10px] font-bold text-red-400 uppercase hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tentar Sincronizar Agora</span>
                </button>
              )}
              <span className="text-[9px] text-gray-600 font-mono">Erro {currentCorrelationId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Header */}
      <ConnectionBanner />

      {/* ── Active: show full chat panel ── */}
      {status === 'active' ? (
        <div className="animate-in slide-in-from-bottom-4 duration-500 bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 340px)', minHeight: '520px' }}>
          <ChatPanel />
        </div>
      ) : (
        /* ── Inactive: show connect CTA ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <EmbeddedSignupButton />

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status do Sistema</h3>
                <div className={`w-2 h-2 rounded-full ${featureFlags.coexEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <button
                onClick={() => fetchStatus()}
                disabled={isSyncing}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-pink-600/30 transition-colors group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Layers className={`w-4 h-4 text-gray-500 group-hover:text-pink-400 transition-colors ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Multi-tab Sync</span>
                </div>
                <span className="text-[9px] font-bold text-gray-600 group-hover:text-pink-400 transition-colors">ATUALIZAR</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold px-2">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>INFRAESTRUTURA VERIFICADA PELA META PLATFORMS</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div
              className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl p-8 text-center transition-all"
              style={{ opacity: isSyncing ? 0.6 : 1, transform: isSyncing ? 'scale(0.98)' : 'scale(1)' }}
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 relative border border-gray-700">
                <AlertTriangle className="w-8 h-8 text-gray-600" />
                {isSyncing && <RefreshCw className="absolute inset-0 w-16 h-16 text-green-500 opacity-20 animate-spin" />}
              </div>
              <h3 className="text-base font-bold text-gray-400">
                {isSyncing ? 'Sincronizando Estado...' : 'Funcionalidades Bloqueadas'}
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">
                {isSyncing
                  ? 'Aguarde enquanto validamos a "Source of Truth" com o servidor central Damaface.'
                  : 'Conecte seu WhatsApp Business via fluxo oficial da Meta para liberar as ferramentas de CRM.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
