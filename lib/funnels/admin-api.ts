// lib/funnels/admin-api.ts
// Client isolado das chamadas administrativas do Funnel Center (back-end-funil.md §7).
// Usado só pelo Builder (`app/franqueado/funnels/**`) — nunca importar aqui dentro
// do Runtime público (PDI-front-end-funil.md, Fase 0).

import { apiBackend } from '@/lib/api-backend'
import type { Funnel, FunnelStatus, FunnelStep } from '@/types/funnels'

export interface CreateFunnelPayload {
  name: string
  slug: string
  description?: string
}

export type UpdateFunnelPayload = Partial<CreateFunnelPayload> & { status?: FunnelStatus }

export type CreateStepPayload = Omit<FunnelStep, 'id'>
export type UpdateStepPayload = Partial<Omit<FunnelStep, 'id'>>

export const funnelAdminApi = {
  list() {
    return apiBackend.get<Funnel[]>('/funnels/admin/funnels/')
  },

  /** A entidade `Funnel` do contrato (back-end-funil.md §6) não lista `steps` — assume-se
   * que o GET por id os retorna aninhados, já que o Builder precisa da árvore completa. */
  get(id: string) {
    return apiBackend.get<Funnel & { steps: FunnelStep[] }>(`/funnels/admin/funnels/${id}/`)
  },

  create(payload: CreateFunnelPayload) {
    return apiBackend.post<Funnel>('/funnels/admin/funnels/', payload)
  },

  update(id: string, payload: UpdateFunnelPayload) {
    return apiBackend.patch<Funnel>(`/funnels/admin/funnels/${id}/`, payload)
  },

  remove(id: string) {
    return apiBackend.delete(`/funnels/admin/funnels/${id}/`)
  },

  /** Endpoint dedicado — o back-end rejeita `status: 'published'` via PATCH genérico
   * (apps/funnels/views.py `FunnelAdminViewSet.update`), só aceita via esta action. */
  publish(id: string) {
    return apiBackend.post<Funnel>(`/funnels/admin/funnels/${id}/publish/`)
  },

  createStep(funnelId: string, payload: CreateStepPayload) {
    return apiBackend.post<FunnelStep>(`/funnels/admin/funnels/${funnelId}/steps/`, payload)
  },

  updateStep(funnelId: string, stepId: string, payload: UpdateStepPayload) {
    return apiBackend.patch<FunnelStep>(`/funnels/admin/funnels/${funnelId}/steps/${stepId}/`, payload)
  },

  deleteStep(funnelId: string, stepId: string) {
    return apiBackend.delete(`/funnels/admin/funnels/${funnelId}/steps/${stepId}/`)
  },
}
