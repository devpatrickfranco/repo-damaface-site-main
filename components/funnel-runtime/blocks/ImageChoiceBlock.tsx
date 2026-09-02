'use client'

import Image from 'next/image'
import type { FunnelBlockProps } from './types'

export function ImageChoiceBlock({ step, onAnswer }: FunnelBlockProps) {
  const options = step.options ?? []

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onAnswer(option, option.value)}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-brand-pink active:scale-[0.99]"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={option.image_url || '/placeholder.svg'}
              alt={option.label}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 45vw, 200px"
              className="object-cover"
            />
          </div>
          <span className="block px-3 py-2 text-sm font-medium text-gray-900 group-hover:text-brand-pink">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}
