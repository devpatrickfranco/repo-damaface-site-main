'use client'

import type { FunnelBlockProps } from './types'

export function ResultBlock({ step, onAnswer }: FunnelBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      {step.description && <p className="text-sm text-gray-600">{step.description}</p>}
      <button
        type="button"
        onClick={() => onAnswer(undefined, 'resultado_visto')}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90"
      >
        {step.cta_label ?? 'Quero saber mais'}
      </button>
    </div>
  )
}
