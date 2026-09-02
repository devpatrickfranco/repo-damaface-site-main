'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { useSuperadminGuard } from '@/hooks/useSuperadminGuard'
import { Spinner } from '@/components/ui/spinner'

// Fase 5 do PDI (PDI-front-end-funil.md) — bloqueada até os endpoints
// `/api/admin/funnels/{id}/analytics*` existirem (back-end-funil.md §7, V3.3).
export default function FunnelResultsPage() {
  const { isChecking } = useSuperadminGuard()
  const params = useParams<{ id: string }>()

  if (isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href={`/franqueado/funnels/${params.id}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" />
        Voltar para o editor
      </Link>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-800 bg-gray-900/30 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
          <BarChart3 className="h-8 w-8 text-gray-600" />
        </div>
        <h1 className="text-lg font-medium text-white">Analytics ainda não disponível</h1>
        <p className="max-w-md text-sm text-gray-500">
          Este dashboard depende dos endpoints <code className="text-gray-400">/api/admin/funnels/{'{id}'}/analytics*</code> (V3.3
          do back-end-funil.md) — overview, funil de conversão, rankings de página/UTM/campanha/criativo e distribuição de
          respostas. Assim que a API existir em ambiente de dev, esta tela renderiza os dados reais.
        </p>
      </div>
    </div>
  )
}
