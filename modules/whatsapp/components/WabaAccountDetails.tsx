'use client';

import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Unlink,
  X,
  Loader2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useWhatsAppStore } from '../store/useWhatsAppStore';

// ─── Copy-to-clipboard hook ──────────────────────────────────────────────────
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };
  return { copiedKey, copy };
}

// ─── CopyableField ───────────────────────────────────────────────────────────
function CopyableField({
  label,
  value,
  fieldKey,
  icon: Icon,
  mono = false,
  copiedKey,
  onCopy,
}: {
  label: string;
  value: string | null | undefined;
  fieldKey: string;
  icon: React.ElementType;
  mono?: boolean;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const display = value || '—';
  const isCopied = copiedKey === fieldKey;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl group">
        <span
          className={`flex-1 text-sm text-gray-200 truncate ${mono ? 'font-mono text-xs' : 'font-medium'}`}
        >
          {display}
        </span>
        {value && (
          <button
            onClick={() => onCopy(value, fieldKey)}
            title="Copiar"
            className="shrink-0 p-1 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    active:       { label: 'Ativo',       className: 'bg-green-500/15 text-green-400 border-green-500/30',   icon: CheckCircle2 },
    pending:      { label: 'Pendente',    className: 'bg-amber-500/15  text-amber-400  border-amber-500/30',  icon: Clock },
    connecting:   { label: 'Conectando', className: 'bg-blue-500/15   text-blue-400   border-blue-500/30',   icon: Loader2 },
    suspended:    { label: 'Suspenso',   className: 'bg-red-500/15    text-red-400    border-red-500/30',    icon: AlertTriangle },
    failed:       { label: 'Falhou',     className: 'bg-red-500/15    text-red-400    border-red-500/30',    icon: AlertTriangle },
    disconnected: { label: 'Desconectado', className: 'bg-gray-500/15 text-gray-400   border-gray-500/30',   icon: AlertTriangle },
  };

  const cfg = map[status] ?? map.disconnected;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'connecting' ? 'animate-spin' : status === 'active' ? 'text-green-400' : ''}`} />
      {cfg.label}
    </span>
  );
}

// ─── Disconnect Modal ─────────────────────────────────────────────────────────
function DisconnectModal({ onClose, onConfirm, isLoading }: {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <Unlink className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Desconectar conta</h3>
            <p className="text-xs text-gray-400">Esta ação é reversível</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          Ao desconectar, sua clínica deixará de receber e enviar mensagens pelo WhatsApp Business.
          Os dados históricos serão preservados. Você poderá reconectar a qualquer momento pelo
          fluxo Embedded Signup da Meta.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-sm font-bold text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Desconectando...</span></>
            ) : (
              <><Unlink className="w-4 h-4" /><span>Confirmar</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function WabaAccountDetails() {
  const { connection, status, fetchStatus, isSyncing } = useWhatsAppStore();
  const { copiedKey, copy } = useCopy();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    // Disconnect action — store will handle via fetchStatus after
    // In a full implementation this would call DELETE /whatsapp/connections/{id}/
    setTimeout(() => {
      setIsDisconnecting(false);
      setShowDisconnect(false);
      fetchStatus();
    }, 1500);
  };

  const activatedAtFormatted = connection?.activated_at
    ? new Date(connection.activated_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/20">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Conta WABA</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Detalhes técnicos da sua conta WhatsApp Business gerenciada pela Damaface
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchStatus()}
            disabled={isSyncing}
            title="Atualizar status"
            className="p-2 rounded-xl border border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-900/80 border border-gray-800 rounded-xl">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-white">
                {connection?.display_name ?? 'WhatsApp Business'}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                {connection?.phone_number ?? 'Número não disponível'}
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Technical IDs — the critical section for Meta reviewer */}
        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Identificadores Técnicos — Business Manager
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CopyableField
              label="ID da Conta WABA"
              value={connection?.waba_id}
              fieldKey="waba_id"
              icon={Building2}
              mono
              copiedKey={copiedKey}
              onCopy={copy}
            />
            <CopyableField
              label="ID do Número de Telefone"
              value={(connection as any)?.phone_number_id}
              fieldKey="phone_number_id"
              icon={Hash}
              mono
              copiedKey={copiedKey}
              onCopy={copy}
            />
            <CopyableField
              label="Número WhatsApp Business"
              value={connection?.phone_number}
              fieldKey="phone_number"
              icon={Phone}
              copiedKey={copiedKey}
              onCopy={copy}
            />
            <CopyableField
              label="Nome Exibido no WhatsApp"
              value={connection?.display_name}
              fieldKey="display_name"
              icon={Building2}
              copiedKey={copiedKey}
              onCopy={copy}
            />
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-2.5 px-3.5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300/80 leading-relaxed">
              Esses identificadores são fornecidos pela Meta Platforms via permissão{' '}
              <span className="font-mono font-bold text-blue-300">whatsapp_business_management</span>{' '}
              e são usados para gerenciar a conta WABA desta unidade no Business Manager.
            </p>
          </div>
        </div>

        {/* Connection metadata */}
        {activatedAtFormatted && (
          <div className="grid grid-cols-2 gap-4">
            <div className="px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                Conta conectada desde
              </p>
              <p className="text-sm font-bold text-gray-300">{activatedAtFormatted}</p>
            </div>
            <div className="px-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-xl">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                Modelo de integração
              </p>
              <p className="text-sm font-bold text-gray-300">COEX · Embedded Signup</p>
            </div>
          </div>
        )}

        {/* Verification badge */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/40 border border-gray-800/60 rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-gray-400">
              Infraestrutura verificada pela Meta Platforms · WF Holding Ltda · CNPJ 53.747.814/0001-18
            </span>
          </div>
          <a
            href="https://business.facebook.com/settings/whatsapp-business-accounts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-blue-400 transition-colors"
          >
            <span>Business Manager</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Disconnect */}
        <div className="pt-2 border-t border-gray-800">
          <button
            id="wa-disconnect-btn"
            onClick={() => setShowDisconnect(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 hover:border-red-500/40 transition-all"
          >
            <Unlink className="w-4 h-4" />
            Desconectar conta
          </button>
          <p className="text-[11px] text-gray-600 mt-2 ml-1">
            A desconexão não exclui dados históricos. Você poderá reconectar a qualquer momento.
          </p>
        </div>
      </div>

      {/* Disconnect confirmation modal */}
      {showDisconnect && (
        <DisconnectModal
          onClose={() => setShowDisconnect(false)}
          onConfirm={handleDisconnect}
          isLoading={isDisconnecting}
        />
      )}
    </>
  );
}
