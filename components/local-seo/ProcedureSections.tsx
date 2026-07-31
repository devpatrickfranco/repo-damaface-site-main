import Image from "next/image"
import {
  Award,
  CalendarCheck,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Droplet,
  MessageCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  TrendingUp,
} from "lucide-react"
import type { Faq, Procedimento } from "@/types/local-seo"
import { Breadcrumb } from "./Breadcrumb"

const AGENDAMENTO_URL = "https://typebot-typebot-viewer.i4khe5.easypanel.host/agendamento"

const BENEFIT_ICONS = [Repeat2, TrendingUp, Droplet, ShieldCheck, Sparkles, Award, Clock]
const benefitIcon = (index: number) => BENEFIT_ICONS[index % BENEFIT_ICONS.length]

const STEP_TITLES = ["Avaliação", "Planejamento", "Aplicação", "Acompanhamento"]
const STEP_ICONS = [Stethoscope, Target, Syringe, CalendarCheck, ClipboardCheck, Award]
const stepTitle = (index: number) => STEP_TITLES[index] ?? `Etapa ${index + 1}`
const stepIcon = (index: number) => STEP_ICONS[index % STEP_ICONS.length]

const HERO_DESTAQUES = [
  { icon: Clock, texto: "Procedimento rápido" },
  { icon: Sparkles, texto: "Resultados naturais" },
  { icon: Award, texto: "Feito por especialistas em harmonização" },
]

export function ProcedureHero({ procedimento }: { procedimento: Procedimento }) {
  return (
    <section className="relative overflow-hidden bg-[#0b0f1a]">
      <div className="absolute inset-0">
        <Image src={procedimento.imagem} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a] via-[#0b0f1a]/80 to-transparent sm:via-[#0b0f1a]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-[#0b0f1a]/50" />
      </div>

      <div className="container relative pb-14 pt-28 sm:pb-16 sm:pt-36">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Procedimentos" }, { label: procedimento.nome }]} />

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Procedimento Damaface</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">{procedimento.nome}</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">{procedimento.resumo}</p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:-translate-y-0.5 hover:bg-brand-pink/90 hover:shadow-xl hover:shadow-brand-pink/30"
            href="#localizacao"
          >
            Encontrar uma unidade
          </a>
          <a className="inline-flex items-center gap-1 text-sm font-semibold text-gray-200 underline-offset-4 hover:text-white hover:underline" href="#sobre">
            Saiba mais sobre o procedimento
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-gray-800/60 pt-8">
          {HERO_DESTAQUES.map(({ icon: Icon, texto }, index) => (
            <span className="flex items-center gap-2 text-sm text-gray-300" key={texto}>
              {index > 0 && <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:block" aria-hidden />}
              <Icon className="h-4 w-4 shrink-0 text-brand-pink" />
              {texto}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProcedureOverview({ procedimento }: { procedimento: Procedimento }) {
  const beneficios = procedimento.beneficios.slice(0, 4)

  return (
    <section id="sobre" className="bg-white py-20 sm:py-28">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl lg:order-1">
          <Image
            src={procedimento.imagem}
            alt={procedimento.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{procedimento.nome}: o que é?</h2>
          <p className="mt-5 leading-7 text-gray-600">{procedimento.descricao}</p>

          {beneficios.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {beneficios.map((beneficio, index) => {
                const Icon = benefitIcon(index)
                return (
                  <div className="flex items-start gap-3" key={beneficio}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="pt-2 text-sm font-medium leading-tight text-gray-800">{beneficio}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function ProcedureHowItWorks({ procedimento }: { procedimento: Procedimento }) {
  const passos = procedimento.comoFunciona
  if (!passos.length) return null

  return (
    <section id="como-funciona" className="bg-gray-50 py-20 sm:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Como funciona</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-brand-pink" aria-hidden />
        </div>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {passos.length > 1 && (
            <div className="absolute left-0 right-0 top-6 hidden border-t border-dashed border-gray-300 lg:block" aria-hidden />
          )}
          {passos.map((descricao, index) => {
            const Icon = stepIcon(index)
            return (
              <li className="relative flex flex-col items-center text-center" key={descricao}>
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-sm font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-pink shadow-sm">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{stepTitle(index)}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{descricao}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export function ProcedureFaq({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null

  return (
    <section id="duvidas" className="bg-white py-20 sm:py-28">
      <div className="container max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Dúvidas frequentes</h2>
          <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-brand-pink" aria-hidden />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <details
              className="group rounded-xl border border-gray-200 bg-gray-50 p-5 open:border-brand-pink/40 open:bg-white open:shadow-sm"
              key={faq.pergunta}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900 marker:content-none">
                {faq.pergunta}
                <ChevronDown className="h-5 w-5 shrink-0 text-brand-pink transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-7 text-gray-600">{faq.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProcedureFinalCTA({ procedimento }: { procedimento: Procedimento }) {
  return (
    <section className="bg-white pb-20 sm:pb-28">
      <div className="container">
        <div className="grid overflow-hidden rounded-3xl bg-[#0b0f1a] sm:grid-cols-2 sm:items-center">
          <div className="relative h-56 sm:h-full sm:min-h-[320px]">
            <Image src={procedimento.imagem} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
          </div>
          <div className="px-6 py-12 sm:px-10 sm:py-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Pronta para cuidar de você?</h2>
            <p className="mt-4 max-w-md text-gray-300">
              Agende sua avaliação em uma unidade Damaface e descubra o melhor plano de tratamento para você.
            </p>
            <a
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:bg-brand-pink/90"
              href={AGENDAMENTO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Agendar avaliação pelo WhatsApp
            </a>
            <a className="mt-4 block text-sm font-medium text-gray-300 underline-offset-4 hover:text-white hover:underline" href="#localizacao">
              Falar com nossa equipe
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
