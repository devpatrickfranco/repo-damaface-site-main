"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, MapPin, Navigation } from "lucide-react"
import type { Unidade } from "@/types/local-seo"
import {
  calculateHaversineDistance,
  getGeolocationErrorState,
  normalizeLocationName,
  reverseGeocode,
  type LocationState,
  type ResolvedLocation,
} from "@/lib/geo"
import { trackEvent } from "@/lib/analytics"
import { whatsappUrl } from "./ClinicSections"
import { formatTelefone } from "./UnidadeSections"

const AGENDAMENTO_URL = "https://typebot-typebot-viewer.i4khe5.easypanel.host/agendamento"

type Grupo = "cidade" | "estado" | "nenhuma" | "todas"

/** Distância em metros até a unidade, ou null se a unidade não tem coordenadas cadastradas. */
function distanciaAteUnidade(geo: ResolvedLocation, unidade: Unidade): number | null {
  const { latitude, longitude } = unidade.endereco
  if (typeof latitude !== "number" || typeof longitude !== "number") return null
  return calculateHaversineDistance(geo, { latitude, longitude })
}

function prioritizarUnidades(unidades: Unidade[], geo: ResolvedLocation | null): { ordenadas: Unidade[]; grupo: Grupo } {
  if (!geo) return { ordenadas: unidades, grupo: "todas" }

  const comDistancia = unidades
    .map((unidade) => ({ unidade, distancia: distanciaAteUnidade(geo, unidade) }))
    .filter((item): item is { unidade: Unidade; distancia: number } => item.distancia !== null)

  if (comDistancia.length > 0) {
    const semCoordenadas = unidades.filter((u) => distanciaAteUnidade(geo, u) === null)
    const ordenadasPorDistancia = [...comDistancia].sort((a, b) => a.distancia - b.distancia).map((item) => item.unidade)

    const maisProxima = ordenadasPorDistancia[0]
    const mesmaCidade = normalizeLocationName(maisProxima.cidade) === normalizeLocationName(geo.city) && maisProxima.estado === geo.stateCode
    const grupo: Grupo = mesmaCidade ? "cidade" : "estado"

    return { ordenadas: [...ordenadasPorDistancia, ...semCoordenadas], grupo }
  }

  // Fallback para unidades sem lat/lng cadastrada: agrupa pela cidade/estado da geocodificação reversa.
  const cidadeAlvo = normalizeLocationName(geo.city)
  const mesmaCidade = unidades.filter((u) => normalizeLocationName(u.cidade) === cidadeAlvo && u.estado === geo.stateCode)
  if (mesmaCidade.length > 0) {
    const resto = unidades.filter((u) => !mesmaCidade.includes(u))
    return { ordenadas: [...mesmaCidade, ...resto], grupo: "cidade" }
  }

  const mesmoEstado = geo.stateCode ? unidades.filter((u) => u.estado === geo.stateCode) : []
  if (mesmoEstado.length > 0) {
    const resto = unidades.filter((u) => !mesmoEstado.includes(u))
    return { ordenadas: [...mesmoEstado, ...resto], grupo: "estado" }
  }

  return { ordenadas: unidades, grupo: "nenhuma" }
}

function UnitCard({ unidade, procedimentoSlug, destaque = false }: { unidade: Unidade; procedimentoSlug: string; destaque?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${destaque ? "border-brand-pink/30 shadow-lg" : "border-gray-100"}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image src={unidade.imagemHero} alt={unidade.nome} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900">{unidade.nome}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-brand-pink" />
          {unidade.cidade}, {unidade.estado}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            className="inline-flex items-center justify-center rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink/90"
            href={whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação na Damaface ${unidade.cidade}.`)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("unit_booking_clicked", { unidade: unidade.slug })}
          >
            Agendar avaliação
          </a>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-pink hover:text-brand-pink"
            href={`/${unidade.slug}/${procedimentoSlug}`}
            onClick={() => trackEvent("unit_clicked", { unidade: unidade.slug })}
          >
            Conhecer unidade
          </Link>
        </div>
      </div>
    </div>
  )
}

function RecommendedUnitCard({ unidade, procedimentoSlug, tier }: { unidade: Unidade; procedimentoSlug: string; tier: "cidade" | "estado" }) {
  const ribbon = tier === "cidade" ? "Mais próxima de você" : "Disponível no seu estado"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-pink/20 bg-white shadow-xl shadow-brand-pink/10 lg:flex">
      <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-pink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
        {ribbon}
      </span>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 lg:aspect-auto lg:w-2/5">
        <Image src={unidade.imagemHero} alt={unidade.nome} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900">{unidade.nome}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-brand-pink" />
          {unidade.cidade}, {unidade.estado}
        </p>
        {unidade.descricao && <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{unidade.descricao}</p>}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-pink/20 transition hover:bg-brand-pink/90"
            href={whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação na Damaface ${unidade.cidade}.`)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("unit_booking_clicked", { unidade: unidade.slug, recomendada: true })}
          >
            Agendar avaliação
          </a>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-pink hover:text-brand-pink"
            href={`/${unidade.slug}/${procedimentoSlug}`}
            onClick={() => trackEvent("unit_clicked", { unidade: unidade.slug, recomendada: true })}
          >
            Conhecer unidade
          </Link>
        </div>
      </div>
    </div>
  )
}

export function LocationFinder({ unidades, procedimentoSlug }: { unidades: Unidade[]; procedimentoSlug: string }) {
  const [state, setState] = useState<LocationState>("idle")
  const [geo, setGeo] = useState<ResolvedLocation | null>(null)
  const [showAll, setShowAll] = useState(false)

  const { ordenadas, grupo } = useMemo(() => prioritizarUnidades(unidades, geo), [unidades, geo])
  const temRecomendada = state === "granted" && (grupo === "cidade" || grupo === "estado")
  const recomendada = temRecomendada ? ordenadas[0] : null
  const outrasTodas = recomendada ? ordenadas.slice(1) : ordenadas

  // Só usa o título "em {estado}" quando a lista abaixo de fato está restrita a esse estado;
  // caso contrário mostra todas as unidades (ordenadas por distância) com um título genérico.
  const outrasMesmoEstado = temRecomendada && geo ? outrasTodas.filter((u) => u.estado === geo.stateCode) : []
  const outras = outrasMesmoEstado.length > 0 ? outrasMesmoEstado : outrasTodas
  const visiveis = showAll ? outras : outras.slice(0, 4)

  const outrasHeading = outrasMesmoEstado.length > 0 ? `Outras unidades em ${geo?.state ?? ""}` : "Unidades Damaface"

  useEffect(() => {
    if (recomendada) trackEvent("unit_recommended_viewed", { unidade: recomendada.slug, grupo })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recomendada?.slug])

  const handleUseLocation = () => {
    if (state === "requesting") return

    trackEvent("location_request_clicked")

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("unavailable")
      return
    }

    setState("requesting")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const resolved = await reverseGeocode(position.coords.latitude, position.coords.longitude)
          if (!resolved) {
            setState("error")
            return
          }
          setGeo(resolved)
          setState("granted")
          trackEvent("location_permission_granted", { city: resolved.city, state: resolved.stateCode })
        } catch {
          setState("error")
        }
      },
      (error) => {
        const nextState = getGeolocationErrorState(error)
        setState(nextState)
        trackEvent(nextState === "denied" ? "location_permission_denied" : "location_error")
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }

  if (!unidades.length) return null

  return (
    <section id="localizacao" className="bg-gray-50 py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Encontre a Damaface mais próxima de você</h2>
          <p className="mt-3 text-gray-600">
            Permita que a Damaface identifique sua localização para mostrarmos primeiro as unidades mais relevantes para você.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-stretch">
          <LocationCard state={state} geo={geo} onUseLocation={handleUseLocation} />
          {recomendada && <RecommendedUnitCard unidade={recomendada} procedimentoSlug={procedimentoSlug} tier={grupo as "cidade" | "estado"} />}
        </div>

        {outras.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900">{outrasHeading}</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visiveis.map((unidade) => (
                <UnitCard key={unidade.slug} unidade={unidade} procedimentoSlug={procedimentoSlug} />
              ))}
            </div>
            {outras.length > 4 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-pink hover:text-brand-pink"
                >
                  {showAll ? "Ver menos unidades" : "Ver todas as unidades"}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/20 transition hover:bg-brand-pink/90"
            href={AGENDAMENTO_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("final_cta_clicked", { origem: "localizacao" })}
          >
            Agendar avaliação pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

function LocationCard({ state, geo, onUseLocation }: { state: LocationState; geo: ResolvedLocation | null; onUseLocation: () => void }) {
  return (
    <div className="flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
        {state === "requesting" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Navigation className="h-6 w-6" />}
      </span>

      <div aria-live="polite" aria-atomic="true" className="flex flex-col items-start">
        {state === "idle" && (
          <>
            <h3 className="mt-4 text-lg font-bold text-gray-900">Encontre uma DamaFace perto de você</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">Permita sua localização para encontrarmos uma unidade próxima de você.</p>
            <button
              type="button"
              onClick={onUseLocation}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-pink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-pink/20 transition hover:bg-brand-pink/90"
            >
              Usar minha localização
            </button>
            <p className="mt-3 text-xs text-gray-400">Sua localização é usada apenas para identificar sua região e sugerir unidades próximas.</p>
          </>
        )}

        {state === "requesting" && (
          <>
            <h3 className="mt-4 text-lg font-bold text-gray-900">Identificando sua localização...</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">Isso leva só alguns segundos.</p>
          </>
        )}

        {state === "granted" && (
          <>
            <CheckCircle2 className="mt-4 h-6 w-6 text-green-600" />
            <h3 className="mt-2 text-lg font-bold text-gray-900">Localização identificada</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {geo ? `Mostrando unidades a partir de ${geo.city}${geo.stateCode ? `/${geo.stateCode}` : ""}.` : "Priorizamos as unidades mais relevantes para você."}
            </p>
            <button
              type="button"
              onClick={onUseLocation}
              className="mt-5 text-sm font-semibold text-brand-pink hover:underline"
            >
              Buscar novamente
            </button>
          </>
        )}

        {(state === "denied" || state === "unavailable" || state === "error") && (
          <>
            <AlertCircle className="mt-4 h-6 w-6 text-amber-500" />
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              {state === "denied" && "Não conseguimos acessar sua localização."}
              {state === "unavailable" && "A localização não está disponível neste dispositivo."}
              {state === "error" && "Não foi possível identificar sua localização."}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">Você pode escolher uma unidade manualmente na lista abaixo.</p>
            <button type="button" onClick={onUseLocation} className="mt-5 text-sm font-semibold text-brand-pink hover:underline">
              Tentar novamente
            </button>
          </>
        )}
      </div>
    </div>
  )
}
