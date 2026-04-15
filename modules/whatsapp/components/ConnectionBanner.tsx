import React from 'react';
import { Phone, Building2, Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useWhatsAppStore } from '../store/useWhatsAppStore';
import { ConnectionBadge } from './WhatsAppSkeleton';

export function ConnectionBanner() {
  const { status, connection, loading, isSyncing } = useWhatsAppStore();

  if (!connection && !loading && status === 'disconnected') return null;

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
      {/* Syncing Indicator Bar */}
      {isSyncing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-500/10 overflow-hidden">
          <div className="h-full bg-green-500 animate-[sync_2s_infinite]" style={{ width: '30%' }} />
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
            status === 'active' ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-100' : 'bg-gray-100 shadow-gray-50'
          }`}>
             {status === 'active' ? (
                <Wifi className="w-7 h-7 text-white" />
             ) : (
                <WifiOff className="w-7 h-7 text-gray-400" />
             )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white shadow flex items-center justify-center">
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 text-green-500 animate-spin" />
            ) : status === 'active' ? (
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-0.5">
            <h2 className="text-base font-black text-gray-900">
              {connection?.display_name || 'Configurando WhatsApp...'}
            </h2>
            <div className="flex items-center space-x-2">
              <ConnectionBadge status={status} />
              {isSyncing && (
                <span className="text-[10px] font-bold text-gray-400 animate-pulse">
                  SINCRONIZANDO...
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{connection?.phone_number || 'Número pendente'}</span>
            </span>
            {connection?.waba_id && (
              <span className="flex items-center space-x-1 opacity-60">
                <Building2 className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">WABA: {connection.waba_id}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end space-y-1">
        <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center space-x-1">
          <Building2 className="w-3 h-3" />
          <span>Multi-tenant Central</span>
        </span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
          {isSyncing ? 'Validando Source of Truth...' : 'Backend Sincronizado'}
        </span>
      </div>

      <style jsx>{`
        @keyframes sync {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
