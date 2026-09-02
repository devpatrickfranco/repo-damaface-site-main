'use client'

// components/funnel-runtime/blocks/UnitChoiceBlock.tsx
// Deixa o usuário escolher em qual unidade quer ser atendido. Puxa as unidades
// do MESMO endpoint público já usado pelas páginas `/[slug]`/`/[slug]/[procedimento]`
// (`services/unidades.ts` → `GET /unidades/`) — não do endpoint `/users/franquias/`
// usado em `/franqueado/usuarios`, que exige sessão autenticada e não pode ser
// chamado a partir do runtime público.

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { getUnidadesIndexaveis } from '@/services/unidades'
import type { Unidade } from '@/types/local-seo'
import { useFunnelRuntimeContext } from '../FunnelRuntimeContext'
import type { FunnelBlockProps } from './types'

export function UnitChoiceBlock({ step, onAnswer }: FunnelBlockProps) {
  const { selectUnit, selectedUnit } = useFunnelRuntimeContext()
  const [unidades, setUnidades] = useState<Unidade[] | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getUnidadesIndexaveis()
      .then((data) => {
        if (!cancelled) setUnidades(data)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSelect = (unidade: Unidade) => {
    selectUnit({ slug: unidade.slug, nome: unidade.nome, whatsapp: unidade.whatsapp })
    onAnswer({ id: unidade.slug, label: unidade.nome, value: unidade.slug, next_step_id: step.next_step_id ?? null, position: 0 }, unidade.slug)
  }

  if (hasError) {
    return <p className="text-sm text-red-500">Não foi possível carregar as unidades agora. Tente novamente em instantes.</p>
  }

  if (!unidades) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {unidades.map((unidade) => (
        <button
          key={unidade.slug}
          type="button"
          onClick={() => handleSelect(unidade)}
          className={`flex items-center gap-3 overflow-hidden rounded-2xl border bg-white p-3 text-left transition active:scale-[0.99] ${
            selectedUnit?.slug === unidade.slug ? 'border-brand-pink bg-brand-pink/5' : 'border-gray-200 hover:border-brand-pink hover:bg-brand-pink/5'
          }`}
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image src={unidade.imagemHero || '/placeholder.svg'} alt={unidade.nome} fill loading="lazy" sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{unidade.nome}</p>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {unidade.cidade}
                {unidade.estado ? ` — ${unidade.estado}` : ''}
              </span>
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
