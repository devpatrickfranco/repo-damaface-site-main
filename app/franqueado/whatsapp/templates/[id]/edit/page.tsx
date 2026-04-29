'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft, GitBranch, Loader2, Eye, EyeOff, AlertTriangle, Info
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useTemplate, useUpdateTemplate } from '@/modules/whatsapp/hooks/useTemplates';
import { ComponentEditor } from '@/modules/whatsapp/components/templates/ComponentEditor';
import { TemplatePreview } from '@/modules/whatsapp/components/templates/TemplatePreview';
import { StatusBadge } from '@/modules/whatsapp/components/templates/StatusBadge';
import type { TemplateComponent, TemplateCategory } from '@/modules/whatsapp/types/templates';

const CATEGORY_LABELS: Record<string, string> = {
  MARKETING: 'Marketing',
  UTILITY: 'Utilitário',
  AUTHENTICATION: 'Autenticação',
};

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { template, isLoading: isLoadingTemplate } = useTemplate(id);
  const { updateTemplate, isLoading: isSaving } = useUpdateTemplate();

  const [components, setComponents] = useState<TemplateComponent[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [componentError, setComponentError] = useState('');

  // Populate form when template loads
  useEffect(() => {
    if (template) {
      setComponents(template.components ?? []);
    }
  }, [template]);

  const validate = (): boolean => {
    if (components.length === 0) {
      setComponentError('Adicione pelo menos um componente');
      return false;
    }
    if (!components.some(c => c.type === 'BODY')) {
      setComponentError('É obrigatório ter ao menos um componente BODY');
      return false;
    }
    setComponentError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;
    if (!validate()) return;

    try {
      const result = await updateTemplate(id, {
        name: template.name,
        language: template.language,
        category: template.category as TemplateCategory,
        components,
      });
      toast.success(`Nova versão v${result.version ?? ''} criada com sucesso!`);
      router.push(`/franqueado/whatsapp/templates/${result.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao versionar template');
    }
  };

  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-semibold">Template não encontrado</p>
          <button
            onClick={() => router.push('/franqueado/whatsapp/templates')}
            className="mt-4 text-pink-400 hover:text-pink-300 text-sm underline"
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
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-xl transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-white truncate">
              Editar: <span className="font-mono text-pink-400">{template.name}</span>
            </h1>
            <StatusBadge status={template.status} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Versão atual: v{template.version ?? 1} · {template.language} · {CATEGORY_LABELS[template.category]}
          </p>
        </div>

        <button
          onClick={() => setShowPreview(p => !p)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all flex-shrink-0"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Ocultar preview' : 'Ver preview'}
        </button>
      </div>

      {/* ⚠️ Versioning Warning */}
      <div className="flex items-start gap-3 p-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-300 mb-1">
            Atenção: Você não está editando o template atual
          </p>
          <p className="text-sm text-amber-400/80 leading-relaxed">
            Alterar este template <strong>criará uma nova versão</strong> (v{(template.version ?? 1) + 1}).
            A nova versão será submetida para aprovação da Meta. 
            O template atual continuará disponível até ser substituído.
          </p>
        </div>
      </div>

      {/* Acknowledgment checkbox */}
      {!acknowledged && (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-2xl flex items-start gap-3">
          <input
            type="checkbox"
            id="ack-versioning"
            checked={acknowledged}
            onChange={e => setAcknowledged(e.target.checked)}
            className="mt-0.5 accent-pink-500 w-4 h-4 flex-shrink-0 cursor-pointer"
          />
          <label htmlFor="ack-versioning" className="text-sm text-gray-400 cursor-pointer">
            Entendi que esta ação criará uma <strong className="text-gray-300">nova versão</strong> do template,
            não modificará o atual.
          </label>
        </div>
      )}

      <div className={clsx(
        'grid gap-8',
        showPreview ? 'lg:grid-cols-[1fr_340px]' : 'max-w-3xl'
      )}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only info */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
              Informações (imutáveis)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-gray-600 uppercase font-semibold tracking-wider mb-1">Nome</p>
                <p className="text-sm text-gray-300 font-mono">{template.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase font-semibold tracking-wider mb-1">Idioma</p>
                <p className="text-sm text-gray-300">{template.language}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-600 uppercase font-semibold tracking-wider mb-1">Categoria</p>
                <p className="text-sm text-gray-300">{CATEGORY_LABELS[template.category]}</p>
              </div>
            </div>
          </div>

          {/* Components editor */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                Componentes
              </h2>
              <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">
                {components.length} componente{components.length !== 1 ? 's' : ''}
              </span>
            </div>

            {componentError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-400">{componentError}</p>
              </div>
            )}

            <ComponentEditor components={components} onChange={setComponents} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !acknowledged}
              title={!acknowledged ? 'Confirme que entendeu o versionamento' : ''}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GitBranch className="w-4 h-4" />
              )}
              {isSaving ? 'Criando nova versão...' : `Criar v${(template.version ?? 1) + 1}`}
            </button>
          </div>
        </form>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Preview</h2>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg font-semibold">
                  v{(template.version ?? 1) + 1} (nova)
                </span>
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

              <TemplatePreview components={components} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
