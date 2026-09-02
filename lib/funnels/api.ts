// lib/funnels/api.ts
// Client isolado das 4 chamadas públicas do Runtime (back-end-funil.md §7).
// Toda chamada de rede do funil passa por aqui — se o contrato mudar antes da
// API real existir, só este arquivo precisa mudar (ver PDI-front-end-funil.md §5).

import { apiBackend } from '@/lib/api-backend'
import type { FunnelAttribution, FunnelEventName } from '@/types/funnels'

export interface CreateSessionPayload extends FunnelAttribution {}

export interface CreateSessionResponse {
  session_id: string
}

export interface PostEventPayload {
  event: FunnelEventName
  step_id?: string | null
  metadata?: Record<string, unknown>
}

export interface PostAnswerPayload {
  step_id: string
  option_id?: string | null
  value: string
}

export interface UpsertLeadPayload {
  name: string
  phone: string
  email?: string
  treatment?: string
  unit_id?: string
}

export const funnelRuntimeApi = {
  createSession(funnelId: string, payload: CreateSessionPayload) {
    return apiBackend.post<CreateSessionResponse>(`/api/funnels/${funnelId}/sessions`, payload)
  },

  postEvent(sessionId: string, payload: PostEventPayload) {
    return apiBackend.post(`/api/funnels/sessions/${sessionId}/events`, payload)
  },

  postAnswer(sessionId: string, payload: PostAnswerPayload) {
    return apiBackend.post(`/api/funnels/sessions/${sessionId}/answers`, payload)
  },

  upsertLead(sessionId: string, payload: UpsertLeadPayload) {
    return apiBackend.post(`/api/funnels/sessions/${sessionId}/lead`, payload)
  },

  /**
   * Estratégia preferencial para o evento `whatsapp_click`: sobrevive à navegação
   * (diferente de fetch, que pode ser abortado pelo browser no redirect).
   * Retorna `false` se sendBeacon não estiver disponível — quem chamar deve cair
   * para `postEvent` com timeout curto (ver CTABlock).
   */
  sendBeaconEvent(sessionId: string, payload: PostEventPayload): boolean {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) return false
    const baseUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL
    if (!baseUrl) return false

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    try {
      return navigator.sendBeacon(`${baseUrl}/api/funnels/sessions/${sessionId}/events`, blob)
    } catch {
      return false
    }
  },
}
