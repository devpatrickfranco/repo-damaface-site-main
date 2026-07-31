"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Procedimento, Unidade } from "@/types/local-seo"
import { IMAGEM_POR_SLUG, ordenarProcedimentos } from "./ClinicSections"

export function ProceduresCarousel({ unidade, procedimentos }: { unidade: Unidade; procedimentos: Procedimento[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progresso, setProgresso] = useState(0)
  const ordenados = ordenarProcedimentos(procedimentos)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>("[data-card]")
    const amount = (card?.offsetWidth ?? 280) + 20
    track.scrollBy({ left: amount * direction, behavior: "smooth" })
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setProgresso(max > 0 ? track.scrollLeft / max : 0)
  }

  if (!ordenados.length) return null

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Ver procedimento anterior"
        onClick={() => scrollByCard(-1)}
        className="absolute -left-4 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-brand-pink hover:text-brand-pink sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="region"
        aria-label={`Procedimentos disponíveis na Damaface ${unidade.cidade}`}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ordenados.map((procedimento) => {
          const imagem = IMAGEM_POR_SLUG[procedimento.slug] ?? procedimento.imagem
          return (
            <Link
              data-card
              href={`/${unidade.slug}/${procedimento.slug}`}
              key={procedimento.slug}
              className="group w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[280px] lg:w-[300px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={imagem}
                  alt={procedimento.nome}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 65vw, (max-width: 1024px) 40vw, 300px"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-pink">{procedimento.nome}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{procedimento.resumo}</p>
                <span className="mt-3 inline-block text-sm font-medium text-brand-pink">Saiba mais →</span>
              </div>
            </Link>
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Ver próximo procedimento"
        onClick={() => scrollByCard(1)}
        className="absolute -right-4 top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-brand-pink hover:text-brand-pink sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {ordenados.length > 1 && (
        <div className="mx-auto mt-6 h-1 w-24 overflow-hidden rounded-full bg-gray-100" aria-hidden>
          <div
            className="h-full rounded-full bg-brand-pink transition-[width] duration-150"
            style={{ width: `${Math.max(12, progresso * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
