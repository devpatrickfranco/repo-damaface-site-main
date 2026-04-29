'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, RefreshCw, Eye, Pencil, Trash2,
  Library, Clock, ChevronRight, AlertCircle, Filter,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useTemplates, useDeleteTemplate, useSyncTemplates } from '@/modules/whatsapp/hooks/useTemplates';
import { StatusBadge } from '@/modules/whatsapp/components/templates/StatusBadge';
import { DeleteModal } from '@/modules/whatsapp/components/templates/DeleteModal';
import { TemplateSkeleton } from '@/modules/whatsapp/components/templates/TemplateSkeleton';
import type { TemplateStatus, WhatsAppTemplate } from '@/modules/whatsapp/types/templates';

const STATUS_FILTERS: { label: string; value: TemplateStatus | 'ALL' }[] = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Aprovados', value: 'APPROVED' },
  { label: 'Pendentes', value: 'PENDING' },
  { label: 'Rejeitados', value: 'REJECTED' },
  { label: 'Pausados', value: 'PAUSED' },
];

const CATEGORY_LABELS: Record<string, string> = {
  MARKETING: 'Marketing',
  UTILITY: 'Utilitário',
  AUTHENTICATION: 'Autenticação',
};

export default function WhatsAppTemplatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | 'ALL'>('ALL');
  const [franchiseFilter, setFranchiseFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<WhatsAppTemplate | null>(null);

  const queryParams = useMemo(() => ({
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    ...(search ? { search } : {}),
    ...(franchiseFilter ? { franchise_id: franchiseFilter } : {}),
  }), [statusFilter, search, franchiseFilter]);

  const { templates, isLoading, error, revalidate } = useTemplates(queryParams);
  const { deleteTemplate, isLoading: isDeleting } = useDeleteTemplate();
  const { syncTemplates, isLoading: isSyncing } = useSyncTemplates();

  const handleSync = async () => {
    try {
      const res = await syncTemplates();
      toast.success(
        res?.message ?? 'Templates sincronizados com sucesso!'
      );
    } catch (err: any) {
      toast.error(err?.message ?? 'Falha ao sincronizar com a Meta');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTemplate(deleteTarget.id);
      toast.success(`Template "${deleteTarget.name}" deletado com sucesso`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao deletar template');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg shadow-pink-500/20">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Templates WhatsApp</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerencie seus templates HSM da Meta Business
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-60"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isSyncing ? 'Sincronizando...' : 'Sincronizar com Meta'}
          </button>

          <button
            onClick={() => router.push('/franqueado/whatsapp/templates/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Template
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-600 transition-all"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={clsx(
                'px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all',
                statusFilter === f.value
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Admin: franchise filter */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={franchiseFilter}
              onChange={e => setFranchiseFilter(e.target.value)}
              placeholder="ID da franquia..."
              className="w-40 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-600 transition-all"
            />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <TemplateSkeleton />
      ) : error ? (
        <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Falha ao carregar templates</p>
            <p className="text-sm text-red-400/70 mt-0.5">{error?.message}</p>
          </div>
          <button
            onClick={() => revalidate()}
            className="ml-auto text-sm text-red-400 hover:text-red-300 underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="p-5 rounded-3xl bg-gray-800/50 border border-gray-700">
            <Library className="w-10 h-10 text-gray-600" />
          </div>
          <div>
            <p className="text-gray-400 font-semibold">Nenhum template encontrado</p>
            <p className="text-gray-600 text-sm mt-1">
              {search || statusFilter !== 'ALL'
                ? 'Tente ajustar os filtros'
                : 'Crie seu primeiro template para começar'}
            </p>
          </div>
          {!search && statusFilter === 'ALL' && (
            <button
              onClick={() => router.push('/franqueado/whatsapp/templates/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Criar Template
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_130px_120px_80px_160px_120px] gap-4 px-6 py-3 bg-gray-900/50 border-b border-gray-800">
            {['Nome', 'Status', 'Categoria', 'Versão', 'Última sync', 'Ações'].map(h => (
              <span key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-800/60">
            {templates.map(tpl => (
              <div
                key={tpl.id}
                className="grid grid-cols-[1fr_130px_120px_80px_160px_120px] gap-4 items-center px-6 py-4 hover:bg-gray-800/30 transition-colors group"
              >
                {/* Name */}
                <div className="min-w-0">
                  <button
                    onClick={() => router.push(`/franqueado/whatsapp/templates/${tpl.id}`)}
                    className="text-sm font-semibold text-white hover:text-pink-400 transition-colors text-left truncate flex items-center gap-1.5 group/name"
                  >
                    <span className="truncate font-mono tracking-tight">{tpl.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover/name:text-pink-400 opacity-0 group-hover/name:opacity-100 transition-all flex-shrink-0" />
                  </button>
                  <p className="text-[10px] text-gray-600 mt-0.5">{tpl.language}</p>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={tpl.status} size="sm" />
                  {tpl.rejection_reason && (
                    <p className="text-[9px] text-red-400/70 mt-0.5 truncate" title={tpl.rejection_reason}>
                      {tpl.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Category */}
                <span className="text-xs text-gray-400 font-medium">
                  {CATEGORY_LABELS[tpl.category] ?? tpl.category}
                </span>

                {/* Version */}
                <span className="text-xs text-gray-400 font-mono">
                  v{tpl.version ?? 1}
                </span>

                {/* Last sync */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(tpl.synced_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {/* View */}
                  <button
                    onClick={() => router.push(`/franqueado/whatsapp/templates/${tpl.id}`)}
                    title="Ver detalhes"
                    className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit (versioning) */}
                  <button
                    onClick={() => router.push(`/franqueado/whatsapp/templates/${tpl.id}/edit`)}
                    title="Editar (nova versão)"
                    className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(tpl)}
                    title="Deletar"
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats bar */}
      {!isLoading && templates.length > 0 && (
        <p className="text-xs text-gray-600 text-center">
          {templates.length} template{templates.length !== 1 ? 's' : ''} encontrado{templates.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        templateName={deleteTarget?.name ?? ''}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
