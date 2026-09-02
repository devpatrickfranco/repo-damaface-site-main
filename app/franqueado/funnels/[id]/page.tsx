'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GripVertical, Plus, Settings, Trash2 } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { useFunnelBuilder } from '@/hooks/useFunnelBuilder'
import { funnelAdminApi } from '@/lib/funnels/admin-api'
import type { Funnel, FunnelBlockType, FunnelStep } from '@/types/funnels'
import { Spinner } from '@/components/ui/spinner'
import { FUNNEL_BLOCK_REGISTRY } from '@/components/funnel-runtime/blocks'
import { FunnelRuntimeContext, type FunnelRuntimeContextValue } from '@/components/funnel-runtime/FunnelRuntimeContext'

// Stub para o preview do Builder — CTABlock/UnitChoiceBlock leem o contexto do
// Runtime (sessionId, whatsappUrl, unidade selecionada), que não existe fora do
// funil real. Clique/seleção ficam inertes aqui — é só visual.
const PREVIEW_RUNTIME_CONTEXT: FunnelRuntimeContextValue = {
  sessionId: null,
  whatsappUrl: '#',
  trackEvent: () => {},
  selectedUnit: null,
  selectUnit: () => {},
}

const MVP_BLOCK_TYPES: { type: FunnelBlockType; label: string }[] = [
  { type: 'choice', label: 'Choice' },
  { type: 'image_choice', label: 'Image Choice' },
  { type: 'before_after', label: 'Before / After' },
  { type: 'unit_choice', label: 'Escolha de unidade' },
  { type: 'text_input', label: 'Text Input' },
  { type: 'phone', label: 'Phone' },
  { type: 'cta', label: 'CTA' },
]

const inputClass =
  'w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all'

function isLocalId(id: string): boolean {
  return id.includes('_local_')
}

export default function FunnelEditorPage() {
  const { isChecking } = useSuperadminGuard()
  const params = useParams<{ id: string }>()
  const funnelId = params.id

  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletedStepIds, setDeletedStepIds] = useState<string[]>([])

  const builder = useFunnelBuilder([])

  useEffect(() => {
    if (isChecking) return
    funnelAdminApi
      .get(funnelId)
      .then((data) => {
        setFunnel(data)
        setName(data.name)
        builder.setSteps(data.steps ?? [])
      })
      .catch(() =>
        setLoadError('Não foi possível carregar este funil — os endpoints administrativos ainda não estão disponíveis (back-end-funil.md §7).'),
      )
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecking, funnelId])

  const selectedStep = builder.steps.find((step) => step.id === builder.selectedStepId)

  const handleRemoveStep = (step: FunnelStep) => {
    if (!isLocalId(step.id)) setDeletedStepIds((prev) => [...prev, step.id])
    builder.handleRemoveStep(step.id)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      if (funnel && name !== funnel.name) {
        await funnelAdminApi.update(funnel.id, { name })
      }

      for (const stepId of deletedStepIds) {
        await funnelAdminApi.deleteStep(funnelId, stepId)
      }

      for (const step of builder.steps) {
        const { id, ...payload } = step
        if (isLocalId(id)) {
          await funnelAdminApi.createStep(funnelId, payload)
        } else {
          await funnelAdminApi.updateStep(funnelId, id, payload)
        }
      }

      setDeletedStepIds([])
      const refreshed = await funnelAdminApi.get(funnelId)
      setFunnel(refreshed)
      builder.setSteps(refreshed.steps ?? [])
    } catch {
      setSaveError('Não foi possível salvar agora — os endpoints administrativos ainda não estão disponíveis (back-end-funil.md §7).')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!funnel) return
    try {
      const updated = await funnelAdminApi.publish(funnel.id)
      setFunnel(updated)
    } catch {
      setSaveError('Não foi possível publicar agora.')
    }
  }

  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (loadError || !funnel) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-sm text-gray-400">{loadError}</p>
        <Link href="/franqueado/funnels" className="mt-4 inline-block text-sm text-pink-400 hover:text-pink-300">
          Voltar para funis
        </Link>
      </div>
    )
  }

  const PreviewComponent = selectedStep ? FUNNEL_BLOCK_REGISTRY[selectedStep.type] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/franqueado/funnels" className="text-gray-400 hover:text-gray-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="bg-transparent text-xl font-bold text-white outline-none focus:border-b focus:border-pink-500"
          />
          <span className="rounded-full border border-gray-600 px-2 py-0.5 text-xs text-gray-400">v{funnel.version}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/franqueado/funnels/${funnel.id}/settings`}
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={handlePublish}
            className="rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600"
          >
            {funnel.status === 'published' ? 'Republicar' : 'Publicar'}
          </button>
        </div>
      </div>

      {saveError && <p className="text-sm text-red-400">{saveError}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_360px]">
        {/* Coluna 1 — lista de steps */}
        <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-800 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Steps</p>
          <div className="space-y-2">
            {builder.steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => builder.setSelectedStepId(step.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  builder.selectedStepId === step.id
                    ? 'border-pink-500 bg-pink-500/10 text-white'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-gray-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate">{index + 1}. {step.title || '(sem título)'}</p>
                  <p className="text-xs text-gray-500">{step.type}</p>
                </div>
                <div className="flex shrink-0 flex-col">
                  <button onClick={(e) => { e.stopPropagation(); builder.handleMoveStep(step.id, 'up') }} className="text-gray-500 hover:text-gray-300" aria-label="Mover para cima">▲</button>
                  <button onClick={(e) => { e.stopPropagation(); builder.handleMoveStep(step.id, 'down') }} className="text-gray-500 hover:text-gray-300" aria-label="Mover para baixo">▼</button>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleRemoveStep(step) }} className="shrink-0 text-red-400 hover:text-red-300" aria-label="Remover step">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <details className="rounded-lg border border-dashed border-gray-700 p-2">
            <summary className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
              <Plus className="h-4 w-4" /> Adicionar step
            </summary>
            <div className="mt-2 space-y-1">
              {MVP_BLOCK_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => builder.handleAddStep(type)}
                  className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700"
                >
                  {label}
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Coluna 2 — configuração do step selecionado */}
        <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
          {!selectedStep ? (
            <p className="text-sm text-gray-500">Selecione um step para editar.</p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Configuração — {selectedStep.type}</p>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Título</label>
                <input
                  value={selectedStep.title}
                  onChange={(event) => builder.handleUpdateStep(selectedStep.id, { title: event.target.value })}
                  className={inputClass}
                />
              </div>

              {(selectedStep.type === 'text_input' || selectedStep.type === 'phone') && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Placeholder</label>
                  <input
                    value={selectedStep.placeholder ?? ''}
                    onChange={(event) => builder.handleUpdateStep(selectedStep.id, { placeholder: event.target.value })}
                    className={inputClass}
                  />
                </div>
              )}

              {selectedStep.type === 'cta' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Texto do botão</label>
                  <input
                    value={selectedStep.cta_label ?? ''}
                    onChange={(event) => builder.handleUpdateStep(selectedStep.id, { cta_label: event.target.value })}
                    className={inputClass}
                  />
                </div>
              )}

              {(selectedStep.type === 'choice' || selectedStep.type === 'image_choice') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-gray-400">Opções</label>
                    <button
                      onClick={() => builder.handleAddOption(selectedStep.id)}
                      className="text-xs font-medium text-pink-400 hover:text-pink-300"
                    >
                      + adicionar
                    </button>
                  </div>
                  {(selectedStep.options ?? []).map((option) => (
                    <div key={option.id} className="space-y-1 rounded-md border border-gray-700 p-2">
                      <input
                        value={option.label}
                        onChange={(event) =>
                          builder.handleUpdateOption(selectedStep.id, option.id, { label: event.target.value, value: event.target.value })
                        }
                        placeholder="Label"
                        className={inputClass}
                      />
                      {selectedStep.type === 'image_choice' && (
                        <input
                          value={option.image_url ?? ''}
                          onChange={(event) => builder.handleUpdateOption(selectedStep.id, option.id, { image_url: event.target.value })}
                          placeholder="URL da imagem"
                          className={inputClass}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <select
                          value={option.next_step_id ?? ''}
                          onChange={(event) =>
                            builder.handleUpdateOption(selectedStep.id, option.id, { next_step_id: event.target.value || null })
                          }
                          className={inputClass}
                        >
                          <option value="">Próximo step: nenhum</option>
                          {builder.steps
                            .filter((s) => s.id !== selectedStep.id)
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title || s.id}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => builder.handleRemoveOption(selectedStep.id, option.id)}
                          className="ml-2 shrink-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(selectedStep.type === 'before_after' ||
                selectedStep.type === 'unit_choice' ||
                selectedStep.type === 'text_input' ||
                selectedStep.type === 'phone') && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Próximo step</label>
                  <select
                    value={selectedStep.next_step_id ?? ''}
                    onChange={(event) => builder.handleUpdateStep(selectedStep.id, { next_step_id: event.target.value || null })}
                    className={inputClass}
                  >
                    <option value="">Nenhum</option>
                    {builder.steps
                      .filter((s) => s.id !== selectedStep.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title || s.id}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        {/* Coluna 3 — preview reaproveitando os blocos do Runtime (mobile 375px) */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Preview</p>
          <div className="mx-auto w-[375px] max-w-full overflow-hidden rounded-3xl border border-gray-600 bg-white">
            <div className="flex flex-col gap-6 px-5 py-6">
              {selectedStep && PreviewComponent ? (
                <FunnelRuntimeContext.Provider value={PREVIEW_RUNTIME_CONTEXT}>
                  <h2 className="text-xl font-bold leading-snug text-gray-900">{selectedStep.title}</h2>
                  <PreviewComponent step={selectedStep} onAnswer={() => {}} />
                </FunnelRuntimeContext.Provider>
              ) : (
                <p className="text-sm text-gray-400">Selecione um step para pré-visualizar.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
