"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Procedimento, Unidade } from "@/types/local-seo"
import { IMAGEM_POR_SLUG, ordenarProcedimentos } from "./ClinicSections"

export function ProceduresCarousel({ unidade, procedimentos }: { unidade: Unidade; procedimentos: Procedimento[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const ordenados = ordenarProcedimentos(procedimentos)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>("[data-card]")
    const amount = (card?.offsetWidth ?? 280) + 20
    track.scrollBy({ left: amount * direction, behavior: "smooth" })
  }

  if (!ordenados.length) return null

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Ver procedimento anterior"
        onClick={() => scrollByCard(-1)}
        className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-brand-pink hover:text-brand-pink sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ordenados.map((procedimento) => {
          const imagem = IMAGEM_POR_SLUG[procedimento.slug] ?? procedimento.imagem
          return (
            <Link
              data-card
              href={`/${unidade.slug}/${procedimento.slug}`}
              key={procedimento.slug}
              className="group w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[240px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={imagem}
                  alt={procedimento.nome}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 60vw, 240px"
                />
              </div>
              <div className="p-4">
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
        className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-brand-pink hover:text-brand-pink sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
