'use client'

// components/funnel-runtime/FunnelLauncher.tsx
// CTA de entrada do funil a partir de páginas de conteúdo (ex: `/vinhedo/botox`).
// Decisão registrada com o usuário: modal client-side simples (sem rota própria) —
// Intercepting Routes ficou descartado para não introduzir uma técnica inédita no
// projeto sem a spike de validação (PDI-front-end-funil.md, seção 5, Riscos).
//
// `next/dynamic` com `ssr: false` garante que o Runtime só entra no bundle quando
// o usuário de fato clica no CTA (PDI Fase 1, requisito de JS mínimo).

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import type { FunnelConfig } from '@/types/funnels'

const FunnelRuntime = dynamic(() => import('./FunnelRuntime').then((mod) => mod.FunnelRuntime), { ssr: false })

interface FunnelLauncherProps {
  config: FunnelConfig
  whatsappNumber: string
  whatsappMessage?: string
  ctaLabel: string
  className?: string
}

export function FunnelLauncher({ config, whatsappNumber, whatsappMessage, ctaLabel, className }: FunnelLauncherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const overlay = isOpen && (
    <div className="fixed inset-0 z-[100] bg-white sm:flex sm:items-center sm:justify-center sm:bg-black/60 sm:p-4">
      <div className="h-full w-full sm:h-[85vh] sm:max-h-[812px] sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-3xl sm:shadow-2xl">
        <FunnelRuntime
          config={config}
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ??
          'inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90 hover:shadow-xl'
        }
      >
        {ctaLabel}
      </button>
      {isMounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  )
}
