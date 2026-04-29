'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft, Pencil, Trash2, GitBranch, Calendar, RefreshCw,
  Clock, Globe, Tag, Hash, Loader2, ExternalLink, AlertCircle,
  ChevronRight, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTemplate, useTemplateHistory, useDeleteTemplate } from '@/modules/whatsapp/hooks/useTemplates';
import { StatusBadge } from '@/modules/whatsapp/components/templates/StatusBadge';
import { TemplatePreview } from '@/modules/whatsapp/components/templates/TemplatePreview';
import { DeleteModal } from '@/modules/whatsapp/components/templates/DeleteModal';

const CATEGORY_LABELS: Record<string, string> = {
  MARKETING: 'Marketing',
  UTILITY: 'Utilitário',
  AUTHENTICATION: 'Autenticação',
};

const LANGUAGE_LABELS: Record<string, string> = {
  pt_BR: '🇧🇷 Português (Brasil)',
  en_US: '🇺🇸 English (US)',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Français',
};

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className="p-2 rounded-lg bg-gray-800 flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { template, isLoading, error } = useTemplate(id);
  const { history } = useTemplateHistory(id);
  const { deleteTemplate, isLoading: isDeleting } = useDeleteTemplate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return dateStr; }
  };

  const handleDelete = async () => {
    if (!template) return;
    try {
      await deleteTemplate(template.id);
      toast.success('Template deletado com sucesso');
      router.push('/franqueado/whatsapp/templates');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao deletar template');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-gray-400 font-semibold">Template não encontrado</p>
          <button
            onClick={() => router.push('/franqueado/whatsapp/templates')}
            className="text-pink-400 hover:text-pink-300 text-sm underline"
          >
            Voltar para templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-xl transition-all mt-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-white font-mono">{template.name}</h1>
            <StatusBadge status={template.status} />
            <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-2 py-1 rounded-lg font-mono">
              v{template.version ?? 1}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {LANGUAGE_LABELS[template.language] ?? template.language} · {CATEGORY_LABELS[template.category] ?? template.category}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => router.push(`/franqueado/whatsapp/templates/${template.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Deletar
          </button>
        </div>
      </div>

      {/* Rejection Reason */}
      {template.status === 'REJECTED' && template.rejection_reason && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-300">Motivo da rejeição</p>
            <p className="text-sm text-red-400/80 mt-0.5">{template.rejection_reason}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* ── Left column ── */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Metadados</h2>
            <div>
              <InfoItem icon={Hash} label="Nome" value={template.name} />
              <InfoItem icon={Globe} label="Idioma" value={LANGUAGE_LABELS[template.language] ?? template.language} />
              <InfoItem icon={Tag} label="Categoria" value={CATEGORY_LABELS[template.category] ?? template.category} />
              <InfoItem icon={GitBranch} label="Versão" value={`v${template.version ?? 1}`} />
              {template.parent_template && (
                <InfoItem icon={ChevronRight} label="Template Pai" value={template.parent_template} />
              )}
              {template.meta_template_id && (
                <InfoItem icon={ExternalLink} label="ID Meta" value={template.meta_template_id} />
              )}
              <InfoItem icon={Calendar} label="Criado em" value={formatDate(template.created_at)} />
              <InfoItem icon={RefreshCw} label="Última sync" value={formatDate(template.synced_at)} />
            </div>
          </div>

          {/* Components (rendered) */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Componentes</h2>
              <button
                onClick={() => setShowRawJson(p => !p)}
                className="text-[10px] text-gray-500 hover:text-gray-400 underline transition-colors"
              >
                {showRawJson ? 'Ver visual' : 'Ver JSON'}
              </button>
            </div>

            {showRawJson ? (
              <pre className="bg-gray-950 rounded-xl border border-gray-800 p-4 text-xs text-gray-400 overflow-auto max-h-96 font-mono leading-relaxed">
                {JSON.stringify(template.components, null, 2)}
              </pre>
            ) : (
              <div className="space-y-3">
                {template.components.map((comp, i) => (
                  <div key={i} className="border border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        comp.type === 'HEADER' ? 'bg-blue-500/20 text-blue-400' :
                        comp.type === 'BODY' ? 'bg-green-500/20 text-green-400' :
                        comp.type === 'FOOTER' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {comp.type}
                      </span>
                      {comp.format && (
                        <span className="text-[10px] text-gray-600">· {comp.format}</span>
                      )}
                    </div>
                    <div className="px-4 py-3">
                      {comp.text && (
                        <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{comp.text}</p>
                      )}
                      {comp.buttons && comp.buttons.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {comp.buttons.map((btn, bi) => (
                            <div key={bi} className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="bg-gray-700 rounded px-1.5 py-0.5 font-semibold uppercase text-[9px]">{btn.type}</span>
                              <span>{btn.text}</span>
                              {btn.url && <span className="text-blue-400 truncate">→ {btn.url}</span>}
                              {btn.phone_number && <span className="text-green-400">{btn.phone_number}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Version History */}
          {history.length > 0 && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <button
                onClick={() => setShowHistory(p => !p)}
                className="flex items-center justify-between w-full"
              >
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Histórico de Versões ({history.length})
                </h2>
                {showHistory ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {showHistory && (
                <div className="mt-4 space-y-2">
                  {history.map((h, i) => (
                    <button
                      key={h.id}
                      onClick={() => router.push(`/franqueado/whatsapp/templates/${h.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-all text-left group"
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-pink-500' : 'bg-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-300 font-mono">
                            v{h.version ?? history.length - i}
                          </span>
                          {i === 0 && (
                            <span className="text-[9px] bg-pink-600/20 text-pink-400 border border-pink-600/30 px-1.5 py-0.5 rounded font-bold uppercase">
                              atual
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(h.created_at)}
                        </div>
                      </div>
                      <StatusBadge status={h.status} size="sm" />
                      <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Preview ── */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview WhatsApp</h2>
              <StatusBadge status={template.status} size="sm" />
            </div>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {template.name[0]?.toUpperCase() ?? 'T'}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{template.name}</div>
                <div className="text-[10px] text-green-400">online</div>
              </div>
            </div>

            <TemplatePreview components={template.components} />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        templateName={template.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
