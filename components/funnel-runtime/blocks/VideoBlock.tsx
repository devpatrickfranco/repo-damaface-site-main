'use client'

import type { FunnelBlockProps } from './types'

export function VideoBlock({ step, onAnswer }: FunnelBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      {step.video_url && (
        <video
          src={step.video_url}
          controls
          playsInline
          preload="none"
          className="w-full rounded-2xl border border-gray-200 bg-black"
        />
      )}
      <button
        type="button"
        onClick={() => onAnswer(undefined, 'assistido')}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90"
      >
        Continuar
      </button>
    </div>
  )
}
