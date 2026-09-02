'use client'

// components/funnel-runtime/FunnelRuntime.tsx
// Motor de renderização dinâmica do Runtime público — interpreta `FunnelConfig`
// e não tem NENHUMA pergunta hardcoded (PDI-front-end-funil.md Fase 1, item 1).
// Isolado do Builder/Analytics: nada aqui importa código de `app/franqueado/**`.

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, X } from 'lucide-react'
import type { FunnelConfig, FunnelOption } from '@/types/funnels'
import { useFunnelEngine } from './useFunnelEngine'
import { FunnelRuntimeContext, type FunnelRuntimeContextValue } from './FunnelRuntimeContext'
import { ProgressIndicator } from './ProgressIndicator'
import { FUNNEL_BLOCK_REGISTRY } from './blocks'
import { funnelRuntimeApi } from '@/lib/funnels/api'
import { buildFunnelAttribution } from '@/lib/funnels/attribution'
import { fireAndRetry } from '@/lib/funnels/reliable-post'
import type { FunnelEventName } from '@/types/funnels'

interface FunnelRuntimeProps {
  config: FunnelConfig
  whatsappNumber: string
  whatsappMessage?: string
  onClose: () => void
}

function buildWhatsappUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export function FunnelRuntime({ config, whatsappNumber, whatsappMessage, onClose }: FunnelRuntimeProps) {
  const engine = useFunnelEngine(config)
  const sessionIdRef = useRef<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const leadSentRef = useRef(false)

  const nameStepId = useMemo(() => config.steps.find((step) => step.type === 'text_input')?.id, [config.steps])
  const phoneStepId = useMemo(() => config.steps.find((step) => step.type === 'phone')?.id, [config.steps])

  const trackEvent = (event: FunnelEventName, stepId?: string | null, metadata?: Record<string, unknown>) => {
    const id = sessionIdRef.current
    if (!id) return
    fireAndRetry(() => funnelRuntimeApi.postEvent(id, { event, step_id: stepId ?? null, metadata }))
  }

  // Sessão é criada uma única vez, ao abrir o funil — falha de rede aqui não
  // impede a navegação local (a config já está em memória via props).
  useEffect(() => {
    let cancelled = false
    funnelRuntimeApi
      .createSession(config.id, buildFunnelAttribution())
      .then((res) => {
        if (cancelled) return
        sessionIdRef.current = res.session_id
        setSessionId(res.session_id)
        trackEvent('funnel_start')
      })
      .catch(() => {
        // sem sessão, o runtime continua navegável — só o tracking fica sem efeito
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id])

  useEffect(() => {
    // Também depende de `sessionId`: no mount a sessão ainda não existe (é criada
    // de forma assíncrona no efeito acima), então o step_view do step de entrada
    // só é disparado quando a sessão fica disponível, não perdido silenciosamente.
    if (engine.currentStepId) trackEvent('step_view', engine.currentStepId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.currentStepId, sessionId])

  useEffect(() => {
    if (leadSentRef.current || !sessionId || !nameStepId || !phoneStepId) return
    const name = engine.answers[nameStepId]?.value
    const phone = engine.answers[phoneStepId]?.value
    if (!name || !phone) return

    leadSentRef.current = true
    fireAndRetry(() => funnelRuntimeApi.upsertLead(sessionId, { name, phone }))
    trackEvent('lead_created', phoneStepId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.answers, sessionId, nameStepId, phoneStepId])

  if (!engine.currentStep) {
    return null
  }

  const handleAnswer = (option: FunnelOption | undefined, value: string) => {
    const step = engine.currentStep!
    engine.answer(step, option, value)

    if (sessionId) {
      fireAndRetry(() => funnelRuntimeApi.postAnswer(sessionId, { step_id: step.id, option_id: option?.id ?? null, value }))
    }
    trackEvent('step_answer', step.id, { answer: value })

    const isLastStep = step.type === 'cta' && (option?.next_step_id ?? step.next_step_id ?? null) === null
    if (isLastStep) trackEvent('step_complete', step.id)
  }

  const BlockComponent = FUNNEL_BLOCK_REGISTRY[engine.currentStep.type]

  const contextValue: FunnelRuntimeContextValue = {
    sessionId,
    whatsappUrl: buildWhatsappUrl(whatsappNumber, whatsappMessage),
    trackEvent,
  }

  return (
    <FunnelRuntimeContext.Provider value={contextValue}>
      <div className="flex h-full w-full flex-col bg-white">
        <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          {engine.canGoBack ? (
            <button
              type="button"
              onClick={engine.goBack}
              aria-label="Voltar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-9 w-9 shrink-0" />
          )}

          <div className="flex-1">
            <ProgressIndicator current={engine.progress.current} total={engine.progress.total} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-6">
          <div key={engine.currentStepId} className="mx-auto flex max-w-md flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold leading-snug text-gray-900">{engine.currentStep.title}</h2>
            {engine.currentStep.description && <p className="-mt-4 text-sm text-gray-500">{engine.currentStep.description}</p>}
            <BlockComponent step={engine.currentStep} onAnswer={handleAnswer} />
          </div>
        </main>
      </div>
    </FunnelRuntimeContext.Provider>
  )
}
