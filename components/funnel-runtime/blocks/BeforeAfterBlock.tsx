'use client'

import Image from 'next/image'
import type { FunnelBlockProps } from './types'

export function BeforeAfterBlock({ step, onAnswer }: FunnelBlockProps) {
  const pairs = step.pairs ?? []

  return (
    <div className="flex flex-col gap-6">
      {pairs.map((pair) => (
        <div key={pair.id} className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-2">
            <div className="relative aspect-[3/4] w-full">
              <Image src={pair.before_url || '/placeholder.svg'} alt="Antes" fill loading="lazy" sizes="50vw" className="object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                Antes
              </span>
            </div>
            <div className="relative aspect-[3/4] w-full">
              <Image src={pair.after_url || '/placeholder.svg'} alt="Depois" fill loading="lazy" sizes="50vw" className="object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-brand-pink px-2 py-0.5 text-xs font-semibold text-white">
                Depois
              </span>
            </div>
          </div>
          {pair.caption && <p className="px-3 py-2 text-center text-sm text-gray-500">{pair.caption}</p>}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onAnswer(undefined, 'sim')}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90"
      >
        Quero conhecer minhas opções
      </button>
    </div>
  )
}
