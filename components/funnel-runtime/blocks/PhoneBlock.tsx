'use client'

import { useState } from 'react'
import type { FunnelBlockProps } from './types'

// Validação de FORMATO apenas — regra de negócio real (número existe, é WhatsApp
// válido etc.) fica no back-end (front-end-funil.md §7, back-end-funil.md §4).
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidPhoneFormat(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

export function PhoneBlock({ step, onAnswer }: FunnelBlockProps) {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = isValidPhoneFormat(value)
  const showError = touched && !isValid

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    onAnswer(undefined, value.replace(/\D/g, ''))
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(event) => setValue(formatPhone(event.target.value))}
        onBlur={() => setTouched(true)}
        onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
        placeholder={step.placeholder ?? '(19) 99999-9999'}
        autoFocus
        className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-gray-900 outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
      />
      {showError && <p className="text-sm text-red-500">Informe um WhatsApp válido com DDD.</p>}
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
