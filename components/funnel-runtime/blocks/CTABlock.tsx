'use client'

import { useState } from 'react'
import { funnelRuntimeApi } from '@/lib/funnels/api'
import { useFunnelRuntimeContext } from '../FunnelRuntimeContext'
import type { FunnelBlockProps } from './types'

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function CTABlock({ step, onAnswer }: FunnelBlockProps) {
  const { sessionId, whatsappUrl } = useFunnelRuntimeContext()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleClick = async () => {
    setIsRedirecting(true)
    onAnswer(undefined, 'whatsapp_click')

    if (sessionId) {
      const payload = { event: 'whatsapp_click' as const, step_id: step.id }

      // sendBeacon sobrevive à navegação — estratégia preferencial
      // (back-end-funil.md §10: o evento precisa ser registrado ANTES do redirect).
      const sent = funnelRuntimeApi.sendBeaconEvent(sessionId, payload)

      if (!sent) {
        // Fallback: dá uma janela curta para o fetch completar sem travar o clique
        // em conexão lenta (PDI-front-end-funil.md Fase 1, item 8).
        await Promise.race([funnelRuntimeApi.postEvent(sessionId, payload).catch(() => {}), timeout(400)])
      }
    }

    window.location.href = whatsappUrl
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isRedirecting}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90 disabled:opacity-70"
      >
        {isRedirecting ? 'Abrindo WhatsApp…' : (step.cta_label ?? 'Falar com nossa equipe')}
      </button>
    </div>
  )
}
