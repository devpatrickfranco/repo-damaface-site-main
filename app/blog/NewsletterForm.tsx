'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { newsletter } from '@/lib/utils'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function subscribe() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Por favor, digite um email válido')
      return
    }
    setIsLoading(true)
    try {
      await newsletter(email)
      setEmail('')
      toast.success('Newsletter cadastrada com sucesso! 🎉')
    } catch {
      toast.error('Ops! Algo deu errado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(event) => { event.preventDefault(); subscribe(); }}>
      <input
        type="email"
        aria-label="Seu melhor e-mail"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isLoading}
        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink transition-colors"
      />
      <button type="submit" disabled={isLoading} className="btn-primary whitespace-nowrap">
        {isLoading ? 'Cadastrando...' : 'Assinar Newsletter'}
      </button>
    </form>
  )
}
