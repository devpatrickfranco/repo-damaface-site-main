'use client'

import type { FunnelBlockProps } from './types'

export function ChoiceBlock({ step, onAnswer }: FunnelBlockProps) {
  const options = step.options ?? []

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onAnswer(option, option.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left text-base font-medium text-gray-900 transition hover:border-brand-pink hover:bg-brand-pink/5 active:scale-[0.99]"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
