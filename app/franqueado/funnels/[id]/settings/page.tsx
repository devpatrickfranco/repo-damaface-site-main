'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { funnelAdminApi } from '@/lib/funnels/admin-api'
import type { Funnel, FunnelStatus } from '@/types/funnels'
import { Spinner } from '@/components/ui/spinner'

const inputClass =
  'w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all'

export default function FunnelSettingsPage() {
  const { isChecking } = useSuperadminGuard()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const funnelId = params.id

  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<FunnelStatus>('draft')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isChecking) return
    funnelAdminApi
      .get(funnelId)
      .then((data) => {
        setFunnel(data)
        setName(data.name)
        setDescription(data.description ?? '')
        setStatus(data.status)
      })
      .catch(() => setError('Não foi possível carregar as configurações deste funil.'))
      .finally(() => setIsLoading(false))
  }, [isChecking, funnelId])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await funnelAdminApi.update(funnelId, { name, description, status })
    } catch {
      setError('Não foi possível salvar agora — os endpoints administrativos ainda não estão disponíveis (back-end-funil.md §7).')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Excluir este funil permanentemente? Essa ação não pode ser desfeita.')) return
    try {
      await funnelAdminApi.remove(funnelId)
      router.push('/franqueado/funnels')
    } catch {
      alert('Não foi possível excluir o funil agora.')
    }
  }

  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!funnel) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-sm text-gray-400">{error}</p>
        <Link href="/franqueado/funnels" className="mt-4 inline-block text-sm text-pink-400 hover:text-pink-300">
          Voltar para funis
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/franqueado/funnels/${funnelId}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" />
        Voltar para o editor
      </Link>

      <h1 className="text-xl font-bold text-white">Configurações — {funnel.name}</h1>

      <div className="space-y-5 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Nome</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Descrição</label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value as FunnelStatus)} className={inputClass}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-lg bg-pink-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </div>

      <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6">
        <h2 className="text-sm font-semibold text-red-400">Zona de risco</h2>
        <p className="mt-1 text-sm text-gray-400">Excluir este funil remove sua configuração permanentemente.</p>
        <button
          onClick={handleDelete}
          className="mt-4 flex items-center gap-2 rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
          Excluir funil
        </button>
      </div>
    </div>
  )
}
