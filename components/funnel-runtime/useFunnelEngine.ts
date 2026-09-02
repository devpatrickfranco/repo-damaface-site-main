'use client'

// components/funnel-runtime/useFunnelEngine.ts
// Motor de navegação do Runtime: interpreta `FunnelConfig` e resolve o próximo
// step via `option.next_step_id` (navegação condicional/não-linear —
// PDI-front-end-funil.md Fase 1, item 1). Usa useReducer (não o padrão de
// useState agrupado de `useCourseWizard`) porque o histórico de navegação em
// grafo com "voltar" pede uma transição de estado atômica.

import { useCallback, useMemo, useReducer } from 'react'
import type { FunnelConfig, FunnelOption, FunnelStep } from '@/types/funnels'

interface EngineState {
  history: string[]
  answers: Record<string, { optionId?: string | null; value: string }>
}

type EngineAction =
  | { type: 'ANSWER'; stepId: string; nextStepId: string | null; optionId?: string | null; value: string }
  | { type: 'GO_BACK' }
  | { type: 'RESTART'; entryStepId: string }

function reducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case 'ANSWER': {
      const answers = { ...state.answers, [action.stepId]: { optionId: action.optionId, value: action.value } }
      if (!action.nextStepId) return { ...state, answers }
      return { history: [...state.history, action.nextStepId], answers }
    }
    case 'GO_BACK': {
      if (state.history.length <= 1) return state
      return { ...state, history: state.history.slice(0, -1) }
    }
    case 'RESTART':
      return { history: [action.entryStepId], answers: {} }
    default:
      return state
  }
}

export function useFunnelEngine(config: FunnelConfig) {
  const entryStepId = config.entry_step_id ?? config.steps[0]?.id
  const stepsById = useMemo(() => new Map(config.steps.map((step) => [step.id, step])), [config.steps])

  const [state, dispatch] = useReducer(reducer, { history: entryStepId ? [entryStepId] : [], answers: {} })

  const currentStepId = state.history[state.history.length - 1]
  const currentStep: FunnelStep | undefined = currentStepId ? stepsById.get(currentStepId) : undefined

  const answer = useCallback(
    (step: FunnelStep, option: FunnelOption | undefined, value: string) => {
      const nextStepId = option ? option.next_step_id : (step.next_step_id ?? null)
      dispatch({ type: 'ANSWER', stepId: step.id, nextStepId, optionId: option?.id ?? null, value })
    },
    [],
  )

  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), [])
  const restart = useCallback(() => {
    if (entryStepId) dispatch({ type: 'RESTART', entryStepId })
  }, [entryStepId])

  // Progresso: PDI-front-end-funil.md Fase 1, item 3 e Riscos — em fluxos
  // não-lineares não existe "total" real (o caminho depende das respostas), então
  // usamos o total de steps definidos na versão publicada como estimativa fixa,
  // até o back-end confirmar se deve ser fixo por versão ou estimado dinamicamente.
  const totalSteps = config.steps.length
  const currentIndex = state.history.length

  return {
    currentStep,
    currentStepId,
    canGoBack: state.history.length > 1,
    isComplete: !!currentStep && currentStep.type === 'cta' && (currentStep.next_step_id ?? null) === null,
    answers: state.answers,
    progress: { current: Math.min(currentIndex, totalSteps), total: totalSteps },
    answer,
    goBack,
    restart,
  }
}

export type FunnelEngine = ReturnType<typeof useFunnelEngine>
