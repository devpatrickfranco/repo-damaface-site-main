import React from 'react';
import { MessageSquare, Loader2, Link2, ExternalLink } from 'lucide-react';
import { useWhatsAppStore } from '../store/useWhatsAppStore';
import { metaSDK } from '../services/meta-sdk';
import { logger } from '../utils/logger';

export function EmbeddedSignupButton() {
  const { connect, isOperationPending, status, startFlow, featureFlags } = useWhatsAppStore();

  const handleSignup = async () => {
    if (isOperationPending || !featureFlags.coexEnabled) return;

    // Elite: Gerar Correlation ID no início do clique
    const cid = startFlow();
    logger.trackEvent('coex_button_clicked', { status }, cid);

    try {
      const result = await metaSDK.launchSignup(cid);
      await connect(result);
    } catch (err: any) {
      logger.error('UI', 'Erro no fluxo de signup', err, cid);
    }
  };

  const isConnected = status === 'active';
  const isBlocked = !featureFlags.coexEnabled;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6 text-center relative overflow-hidden">
      {isBlocked && (
         <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center z-10 px-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
               <p className="text-xs font-bold text-gray-500 uppercase">Indisponível Temporariamente</p>
            </div>
         </div>
      )}

      <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center shadow-xl shadow-green-100">
        <MessageSquare className="w-10 h-10 text-white" />
      </div>

      <div className="max-w-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {isConnected ? 'WhatsApp Conectado!' : 'Conectar WhatsApp Business'}
        </h2>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          {isConnected 
            ? 'Seu número está pronto para uso centralizado. Você pode gerenciar todas as conversas aqui.'
            : 'Utilize o fluxo oficial da Meta para conectar o número da sua clínica ao WABA Central da Damaface.'}
        </p>
      </div>

      <button
        onClick={handleSignup}
        disabled={isOperationPending || isConnected || isBlocked}
        className={`
          w-full max-w-xs flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold text-base transition-all transform
          ${isConnected || isBlocked
            ? 'bg-gray-100 text-gray-400 cursor-default' 
            : 'bg-green-500 text-white shadow-xl shadow-green-200 hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98]'}
          ${isOperationPending ? 'opacity-80' : ''}
        `}
      >
        {isOperationPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : isConnected ? (
          <>
            <Link2 className="w-5 h-5" />
            <span>Já Conectado</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            <span>Conectar via Meta</span>
          </>
        )}
      </button>

      {!isConnected && (
        <a 
          href="/ajuda/whatsapp" 
          target="_blank"
          className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-pink-500 transition-colors flex items-center space-x-1"
        >
          <span>Guia de Configuração Manual</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
}
