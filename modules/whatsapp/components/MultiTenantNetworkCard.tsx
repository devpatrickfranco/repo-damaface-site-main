'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Wifi,
  WifiOff,
  Clock,
  Users,
  ShieldCheck,
  Globe,
  ChevronDown,
  ChevronUp,
  Loader2,
  Zap,
} from 'lucide-react';
import { whatsappApi } from '../api/whatsapp-api';
import { WabaConnection } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Masks a phone number for display in multi-tenant list.
 * e.g. 5511987654321 → +55 11 9****-4321
 */
function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '(***) *****-****';
  const d = phone.replace(/\D/g, '');
  if (d.length < 10) return phone;
  const country = d.slice(0, 2);
  const ddd    = d.slice(2, 4);
  const last4  = d.slice(-4);
  return `+${country} (${ddd}) *****-${last4}`;
}

/**
 * Mask the unit identifier — keeps only the last chars of the WABA ID.
 */
function maskUnitId(connection: WabaConnection, index: number): string {
  if (connection.waba_id) {
    return `Unidade #${String(index + 1).padStart(2, '0')} · ···${connection.waba_id.slice(-6)}`;
  }
  return `Unidade #${String(index + 1).padStart(2, '0')}`;
}

// ─── Status badge per connection ─────────────────────────────────────────────
function ConnectionStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; dot: string; text: string }> = {
    active:       { label: 'Ativo',        dot: 'bg-green-500 animate-pulse', text: 'text-green-400' },
    pending:      { label: 'Pendente',     dot: 'bg-amber-500',               text: 'text-amber-400' },
    connecting:   { label: 'Conectando',  dot: 'bg-blue-500 animate-pulse',   text: 'text-blue-400'  },
    suspended:    { label: 'Suspenso',    dot: 'bg-red-500',                  text: 'text-red-400'   },
    failed:       { label: 'Falhou',      dot: 'bg-red-500',                  text: 'text-red-400'   },
    disconnected: { label: 'Inativo',     dot: 'bg-gray-500',                 text: 'text-gray-400'  },
  };
  const cfg = configs[status] ?? configs.disconnected;

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Single unit row ──────────────────────────────────────────────────────────
function UnitRow({ connection, index }: { connection: WabaConnection; index: number }) {
  const isActive = connection.registration_status === 'active';

  return (
    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors ${
      isActive
        ? 'bg-green-500/5 border-green-500/15 hover:bg-green-500/10'
        : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/70'
    }`}>
      {/* Unit icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isActive ? 'bg-green-500/20' : 'bg-gray-700'
      }`}>
        {isActive
          ? <Wifi className="w-3.5 h-3.5 text-green-400" />
          : <WifiOff className="w-3.5 h-3.5 text-gray-500" />
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-300 truncate">
          {maskUnitId(connection, index)}
        </p>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
          {maskPhone(connection.phone_number)}
        </p>
      </div>

      {/* Status */}
      <ConnectionStatusBadge status={connection.registration_status} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function MultiTenantNetworkCard() {
  const [connections, setConnections] = useState<WabaConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    whatsappApi
      .getConnections()
      .then((data) => {
        if (!cancelled) setConnections(data);
      })
      .catch(() => {
        if (!cancelled) setConnections([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const activeCount = connections.filter(c => c.registration_status === 'active').length;
  const visibleRows = expanded ? connections : connections.slice(0, 3);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Animated globe icon */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Globe className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">
              Rede Damaface — WABA Central
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">
              Technology Provider · manage_app_solution
            </p>
          </div>
        </div>

        {/* Active counter badge */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 border border-green-500/25 rounded-lg">
              <Users className="w-3 h-3 text-green-400" />
              <span className="text-xs font-black text-green-400">
                {activeCount} ativa{activeCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg">
              <Zap className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-bold text-gray-400">
                {connections.length} total
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Carregando unidades...</span>
          </div>
        ) : connections.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <p className="text-xs text-gray-600">Nenhuma unidade conectada</p>
          </div>
        ) : (
          <>
            {visibleRows.map((conn, i) => (
              <UnitRow key={conn.id ?? i} connection={conn} index={i} />
            ))}

            {connections.length > 3 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-gray-500 hover:text-gray-300 transition-colors"
              >
                {expanded ? (
                  <><ChevronUp className="w-3.5 h-3.5" /><span>Mostrar menos</span></>
                ) : (
                  <><ChevronDown className="w-3.5 h-3.5" /><span>Ver todas as {connections.length} unidades</span></>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-900/40">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
            Damaface · Meta Technology Partner
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-gray-700" />
          <span className="text-[10px] text-gray-700 font-medium">
            AWS Brasil · LGPD · WF Holding
          </span>
        </div>
      </div>
    </div>
  );
}
