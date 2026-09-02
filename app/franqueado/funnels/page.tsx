'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Edit, ExternalLink, Filter, Plus, Trash2 } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { funnelAdminApi } from '@/lib/funnels/admin-api'
import type { Funnel, FunnelStatus } from '@/types/funnels'
import { Spinner } from '@/components/ui/spinner'

const STATUS_LABEL: Record<FunnelStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
}

const STATUS_BADGE: Record<FunnelStatus, string> = {
  draft: 'bg-gray-700 text-gray-300 border-gray-600',
  published: 'bg-green-900/40 text-green-400 border-green-800',
  archived: 'bg-gray-800 text-gray-500 border-gray-700',
}

export default function FunnelsListPage() {
  const { isChecking } = useSuperadminGuard()
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isChecking) return
    funnelAdminApi
      .list()
      .then(setFunnels)
      .catch(() =>
        setError(
          'Não foi possível conectar à API do Funnel Engine. Os endpoints administrativos ainda não estão disponíveis (back-end-funil.md §7).',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [isChecking])

  const handleDelete = async (funnel: Funnel) => {
    if (!confirm(`Excluir o funil "${funnel.name}"? Essa ação não pode ser desfeita.`)) return
    try {
      await funnelAdminApi.remove(funnel.id)
      setFunnels((prev) => prev.filter((item) => item.id !== funnel.id))
    } catch {
      alert('Não foi possível excluir o funil agora.')
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Funnel Center</h1>
            <p className="text-sm text-gray-400">Crie, edite e publique funis de conversão do site.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/franqueado/funnels/assets"
            className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            Biblioteca de assets
          </Link>
          <Link
            href="/franqueado/funnels/create"
            className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" />
            Novo funil
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner />
          <p className="mt-4 text-gray-500">Carregando funis...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p className="max-w-md text-sm text-gray-400">{error}</p>
        </div>
      ) : funnels.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 py-16 text-center">
          <Filter className="h-8 w-8 text-gray-600" />
          <h3 className="text-lg font-medium text-white">Nenhum funil criado ainda</h3>
          <p className="max-w-sm text-sm text-gray-500">Crie o primeiro funil para começar a capturar leads a partir do site.</p>
          <Link href="/franqueado/funnels/create" className="mt-2 text-sm font-medium text-pink-400 hover:text-pink-300">
            Criar funil →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Versão</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {funnels.map((funnel) => (
                  <tr key={funnel.id} className="hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-white">{funnel.name}</div>
                      <div className="text-sm text-gray-400">/{funnel.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${STATUS_BADGE[funnel.status]}`}>
                        {STATUS_LABEL[funnel.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">v{funnel.version}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/franqueado/funnels/${funnel.id}`} className="p-1 text-blue-400 hover:text-blue-300" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link href={`/franqueado/funnels/${funnel.id}/results`} className="p-1 text-gray-400 hover:text-gray-300" title="Resultados">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(funnel)} className="p-1 text-red-400 hover:text-red-300" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
