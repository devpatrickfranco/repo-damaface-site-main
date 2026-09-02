'use client'

// Contexto interno do runtime — carrega dados que só alguns blocos precisam
// (ex: CTABlock precisa do link de WhatsApp e do sessionId para disparar o
// evento antes do redirect), sem forçar todo bloco a receber essas props.

import { createContext, useContext } from 'react'
import type { FunnelEventName } from '@/types/funnels'

export interface FunnelRuntimeContextValue {
  sessionId: string | null
  whatsappUrl: string
  trackEvent: (event: FunnelEventName, stepId?: string | null, metadata?: Record<string, unknown>) => void
}

export const FunnelRuntimeContext = createContext<FunnelRuntimeContextValue | null>(null)

export function useFunnelRuntimeContext(): FunnelRuntimeContextValue {
  const ctx = useContext(FunnelRuntimeContext)
  if (!ctx) {
    throw new Error('useFunnelRuntimeContext deve ser usado dentro de <FunnelRuntime>')
  }
  return ctx
}
