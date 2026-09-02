'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import type { FunnelBlockProps } from './types'

export function TestimonialBlock({ step, onAnswer }: FunnelBlockProps) {
  const testimonials = step.testimonials ?? []

  return (
    <div className="flex flex-col gap-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
              <Image src={testimonial.avatar_url || '/placeholder.svg'} alt={testimonial.author} fill loading="lazy" sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
              {typeof testimonial.rating === 'number' && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-3.5 w-3.5 ${index < testimonial.rating! ? 'fill-brand-pink text-brand-pink' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600">{testimonial.content}</p>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onAnswer(undefined, 'visto')}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90"
      >
        Continuar
      </button>
    </div>
  )
}
