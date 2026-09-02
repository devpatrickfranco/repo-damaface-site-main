'use client'

import { useState } from 'react'
import type { FunnelBlockProps } from './types'

export function TextInputBlock({ step, onAnswer }: FunnelBlockProps) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = value.trim().length >= 2
  const showError = touched && !isValid

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onAnswer(undefined, value.trim())
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => setTouched(true)}
        onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
        placeholder={step.placeholder ?? 'Digite aqui'}
        autoFocus
        className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-gray-900 outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
      />
      {showError && <p className="text-sm text-red-500">Preencha esse campo para continuar.</p>}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90"
      >
        Continuar
      </button>
    </div>
  )
}
