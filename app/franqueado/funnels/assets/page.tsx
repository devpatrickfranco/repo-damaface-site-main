'use client'

import Link from 'next/link'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { Spinner } from '@/components/ui/spinner'

// Fase 3 do PDI (PDI-front-end-funil.md) — fora do escopo desta rodada.
// Rota criada agora (Fase 0, estrutura de rotas) para já existir o link no
// dashboard global; upload/seleção de assets fica para a próxima fatia.
export default function FunnelAssetsPage() {
  const { isChecking } = useSuperadminGuard()

  if (isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/franqueado/funnels" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" />
        Voltar para funis
      </Link>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
          <ImageIcon className="h-8 w-8 text-gray-600" />
        </div>
        <h1 className="text-lg font-medium text-white">Biblioteca de assets em desenvolvimento</h1>
        <p className="max-w-md text-sm text-gray-500">
          Grid de assets organizados por procedimento, upload e seleção a partir do Builder chegam na Fase 3 do PDI.
        </p>
      </div>
    </div>
  )
}
