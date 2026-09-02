'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { funnelAdminApi } from '@/lib/funnels/admin-api'
import { Spinner } from '@/components/ui/spinner'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const inputClass =
  'w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all'

export default function CreateFunnelPage() {
  const { isChecking } = useSuperadminGuard()
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !slug.trim()) return

    setIsSubmitting(true)
    setError(null)
    try {
      const funnel = await funnelAdminApi.create({ name: name.trim(), slug: slug.trim(), description: description.trim() || undefined })
      router.push(`/franqueado/funnels/${funnel.id}`)
    } catch {
      setError('Não foi possível criar o funil agora — os endpoints administrativos ainda não estão disponíveis (back-end-funil.md §7).')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/franqueado/funnels" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" />
        Voltar para funis
      </Link>

      <div>
        <h1 className="text-xl font-bold text-white">Novo funil</h1>
        <p className="text-sm text-gray-400">Comece com o nome — steps e blocos são configurados no editor.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Nome do funil *</label>
          <input
            type="text"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Ex: Botox — Vinhedo"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true)
              setSlug(slugify(event.target.value))
            }}
            placeholder="botox-vinhedo"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Descrição</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Uso interno — não aparece para o usuário final"
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !slug.trim()}
          className="w-full rounded-lg bg-pink-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Criando...' : 'Criar funil'}
        </button>
      </form>
    </div>
  )
}
