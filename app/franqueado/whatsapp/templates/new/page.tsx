'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Plus, Info, Loader2, Eye, EyeOff
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useCreateTemplate } from '@/modules/whatsapp/hooks/useTemplates';
import { ComponentEditor } from '@/modules/whatsapp/components/templates/ComponentEditor';
import { TemplatePreview } from '@/modules/whatsapp/components/templates/TemplatePreview';
import type { TemplateComponent, TemplateCategory } from '@/modules/whatsapp/types/templates';

const LANGUAGES = [
  { value: 'pt_BR', label: '🇧🇷 Português (Brasil)' },
  { value: 'en_US', label: '🇺🇸 English (US)' },
  { value: 'es', label: '🇪🇸 Español' },
  { value: 'fr', label: '🇫🇷 Français' },
];

const CATEGORIES: { value: TemplateCategory; label: string; description: string }[] = [
  { value: 'MARKETING', label: 'Marketing', description: 'Promoções, ofertas e novidades' },
  { value: 'UTILITY', label: 'Utilitário', description: 'Confirmações, lembretes e atualizações' },
  { value: 'AUTHENTICATION', label: 'Autenticação', description: 'OTPs e verificações' },
];

interface FormErrors {
  name?: string;
  language?: string;
  category?: string;
  components?: string;
}

export default function NewTemplatePage() {
  const router = useRouter();
  const { createTemplate, isLoading } = useCreateTemplate();

  const [name, setName] = useState('');
  const [language, setLanguage] = useState('pt_BR');
  const [category, setCategory] = useState<TemplateCategory>('MARKETING');
  const [components, setComponents] = useState<TemplateComponent[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (!/^[a-z0-9_]+$/.test(name)) {
      newErrors.name = 'Apenas letras minúsculas, números e underscores';
    }

    if (!language) newErrors.language = 'Selecione um idioma';
    if (!category) newErrors.category = 'Selecione uma categoria';
    if (components.length === 0) {
      newErrors.components = 'Adicione pelo menos um componente';
    } else if (!components.some(c => c.type === 'BODY')) {
      newErrors.components = 'É obrigatório ter ao menos um componente BODY';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createTemplate({ name, language, category, components });
      toast.success('Template criado e enviado para aprovação da Meta!');
      router.push(`/franqueado/whatsapp/templates/${result.id}`);
    } catch (err: any) {
      const apiError = err?.message ?? 'Erro ao criar template';
      toast.error(apiError);
    }
  };

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
        <div>
          <h1 className="text-2xl font-black text-white">Novo Template</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Crie um template HSM para envio via WhatsApp Business
          </p>
        </div>

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview(p => !p)}
          className="ml-auto flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Ocultar preview' : 'Ver preview'}
        </button>
      </div>

      {/* Approval notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-6">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          O template será enviado para <strong>aprovação da Meta</strong> após a criação. 
          O processo pode levar até 24h. Você será notificado quando o status mudar.
        </p>
      </div>

      <div className={clsx(
        'grid gap-8',
        showPreview ? 'lg:grid-cols-[1fr_340px]' : 'lg:grid-cols-1 max-w-3xl'
      )}>
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              Informações Básicas
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Nome do Template *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="meu_template_marketing"
                className={clsx(
                  'w-full bg-gray-800 border rounded-xl px-4 py-3 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all',
                  errors.name
                    ? 'border-red-500/60 focus:ring-red-500/20'
                    : 'border-gray-700 focus:ring-pink-500/30 focus:border-pink-600'
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
              )}
              <p className="text-[10px] text-gray-600 mt-1.5">
                Apenas letras minúsculas, números e underscores. Ex: promo_verao_2024
              </p>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Idioma *
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-600 transition-all"
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Categoria *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={clsx(
                      'text-left px-4 py-3 rounded-xl border transition-all',
                      category === cat.value
                        ? 'border-pink-500 bg-pink-600/10 text-white'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600 bg-gray-800/40'
                    )}
                  >
                    <div className="text-sm font-semibold">{cat.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{cat.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Components */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                Componentes
              </h2>
              <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-1 rounded-lg">
                {components.length} adicionado{components.length !== 1 ? 's' : ''}
              </span>
            </div>

            {errors.components && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-400">{errors.components}</p>
              </div>
            )}

            <ComponentEditor components={components} onChange={setComponents} />
          </div>

          {/* Submit */}
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
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/20 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isLoading ? 'Criando...' : 'Criar Template'}
            </button>
          </div>
        </form>

        {/* ── Preview panel ── */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Preview WhatsApp
                </h2>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Fake WA header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {name ? name[0].toUpperCase() : 'T'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white truncate max-w-[160px]">
                    {name || 'Template Name'}
                  </div>
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
