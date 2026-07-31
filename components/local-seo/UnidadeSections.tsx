import Image from "next/image"
import Link from "next/link"
import {
  Award,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react"
import type { PostSummary } from "@/lib/posts"
import { getMediaUrl } from "@/lib/api-backend"
import type { Faq, Unidade } from "@/types/local-seo"
import { whatsappUrl } from "./ClinicSections"
import { Breadcrumb } from "./Breadcrumb"

function formatTelefone(whatsapp: string) {
  const digitos = whatsapp.replace(/\D/g, "").replace(/^55/, "")
  const match = digitos.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (!match) return whatsapp
  const [, ddd, primeiraParte, segundaParte] = match
  return `(${ddd}) ${primeiraParte}-${segundaParte}`
}

const HERO_DESTAQUES = [
  { icon: Users, texto: "Profissionais especializados" },
  { icon: Sparkles, texto: "Tecnologia de ponta" },
  { icon: ShieldCheck, texto: "Protocolos exclusivos" },
  { icon: HeartHandshake, texto: "Ambiente seguro e acolhedor" },
]

export function UnidadeHero({ unidade }: { unidade: Unidade }) {
  const resumo = unidade.descricao?.trim() || `Tratamentos faciais e corporais com atendimento personalizado em ${unidade.cidade}.`
  const horariosAbertos = unidade.horarios.filter((horario) => horario.aberto).slice(0, 2)
  const enderecoQuery = encodeURIComponent(`${unidade.endereco.rua}, ${unidade.endereco.numero}, ${unidade.cidade} ${unidade.estado}`)

  return (
    <section className="relative overflow-hidden bg-[#0b0f1a]">
      <div className="absolute inset-0">
        <Image src={unidade.imagemHero} alt="" fill priority className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a] via-[#0b0f1a]/85 to-[#0b0f1a]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-[#0b0f1a]/40" />
      </div>

      <div className="container relative pb-14 pt-28 sm:pb-16 sm:pt-36">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Unidades" }, { label: unidade.cidade }]} />
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Damaface {unidade.cidade}</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">Clínica de estética em {unidade.cidade}</h1>
        <h3 className="mt-6 max-w-2xl text-lg font-normal leading-8 text-gray-300">{resumo}</h3>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {HERO_DESTAQUES.map(({ icon: Icon, texto }) => (
            <div className="flex items-center gap-2 text-sm text-gray-200" key={texto}>
              <Icon className="h-5 w-5 shrink-0 text-brand-pink" />
              <span className="max-w-[9rem] leading-tight">{texto}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:bg-brand-pink/90"
            href={whatsappUrl(unidade.whatsapp, "Olá! Quero agendar uma avaliação.")}
            target="_blank"
            rel="noreferrer"
          >
            Agendar avaliação
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition hover:border-brand-pink hover:text-brand-pink"
            href={whatsappUrl(unidade.whatsapp, "Olá! Gostaria de falar com a Damaface.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="container flex flex-wrap items-start gap-x-10 gap-y-4 py-6 text-sm text-gray-200">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink" />
            <span>
              {unidade.endereco.rua}, {unidade.endereco.numero}
              <br />
              {unidade.endereco.bairro} · {unidade.cidade}/{unidade.estado}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 shrink-0 text-brand-pink" />
            <span>{formatTelefone(unidade.whatsapp)}</span>
          </div>

          {horariosAbertos.length > 0 && (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink" />
              <span>
                {horariosAbertos.map((horario) => (
                  <span className="block" key={horario.dias}>
                    {horario.dias}: {horario.abre} às {horario.fecha}
                  </span>
                ))}
              </span>
            </div>
          )}

          <a
            className="flex items-center gap-3 font-medium text-white hover:text-brand-pink"
            href={`https://www.google.com/maps/search/?api=1&query=${enderecoQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin className="h-5 w-5 shrink-0 text-brand-pink" />
            Ver no mapa
          </a>
        </div>
      </div>
    </section>
  )
}

const CHECKLIST_UNIDADE = [
  "Equipe altamente capacitada e atualizada",
  "Protocolos exclusivos e personalizados",
  "Equipamentos de última geração",
  "Ambiente moderno, confortável e seguro",
]

export function UnidadeAbout({ unidade }: { unidade: Unidade }) {
  const [principal, ...resto] = unidade.galeria
  const miniaturas = resto.slice(0, 3)

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Sobre a Damaface {unidade.cidade}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sua melhor versão, com confiança e segurança</h2>
          <p className="mt-5 leading-7 text-gray-600">
            A unidade Damaface {unidade.cidade} foi criada para oferecer uma experiência completa em beleza, saúde e bem-estar. Cada
            detalhe é pensado para que você se sinta segura, acolhida e confiante.
          </p>

          <ul className="mt-6 space-y-3">
            {CHECKLIST_UNIDADE.map((item) => (
              <li className="flex items-start gap-3 text-gray-700" key={item}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink" />
                {item}
              </li>
            ))}
          </ul>

          <a
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/20 transition hover:bg-brand-pink/90"
            href={whatsappUrl(unidade.whatsapp, "Olá! Quero conhecer a unidade Damaface.")}
            target="_blank"
            rel="noreferrer"
          >
            Conhecer a unidade
          </a>
        </div>

        {principal && (
          <div className="grid grid-cols-3 gap-3">
            <div className="relative col-span-3 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={principal} alt={`Damaface ${unidade.cidade} — ambiente da unidade`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            {miniaturas.map((imagem, index) => (
              <div className="relative aspect-square overflow-hidden rounded-xl" key={imagem}>
                <Image src={imagem} alt={`Damaface ${unidade.cidade} — ambiente ${index + 2}`} fill className="object-cover" sizes="(max-width: 1024px) 33vw, 17vw" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const DIFERENCIAIS = [
  { icon: ClipboardCheck, titulo: "Avaliação personalizada", texto: "Planos de tratamento exclusivos para você." },
  { icon: Wand2, titulo: "Procedimentos minimamente invasivos", texto: "Resultados naturais e recuperação rápida." },
  { icon: Award, titulo: "Resultados duradouros", texto: "Realce sua beleza de forma sutil e harmoniosa." },
  { icon: Users, titulo: "Acompanhamento completo", texto: "Suporte antes, durante e após o procedimento." },
]

export function UnidadeHighlights() {
  return (
    <section className="bg-white pb-20 sm:pb-28">
      <div className="container">
        <div className="grid gap-8 rounded-3xl bg-brand-pink/5 px-6 py-10 sm:px-10 md:grid-cols-2 lg:grid-cols-4">
          {DIFERENCIAIS.map(({ icon: Icon, titulo, texto }) => (
            <div className="flex items-start gap-4" key={titulo}>
              <Icon className="h-7 w-7 shrink-0 text-brand-pink" />
              <div>
                <h3 className="font-semibold text-gray-900">{titulo}</h3>
                <p className="mt-1 text-sm text-gray-600">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.27A11.98 11.98 0 000 12c0 1.94.46 3.77 1.27 5.38z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  )
}

const AVALIACOES_MOCK = [
  { autor: "Juliana M.", texto: "Atendimento impecável desde a recepção até o pós-procedimento. Resultados naturais e me senti muito segura!" },
  { autor: "Patrícia A.", texto: "Profissionais incríveis e muito atenciosas. Ambiente acolhedor e tecnologia de ponta. Super recomendo!" },
  { autor: "Carla R.", texto: "Estou amando os resultados! A pele está mais firme e com mais viço. Me senti cuidada em cada etapa." },
  { autor: "Renata S.", texto: "Melhor clínica da região! Equipe maravilhosa e resultados que realmente fazem a diferença." },
]

export function UnidadeReviews() {
  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Avaliações do Google</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">O que nossos pacientes dizem</h2>
          </div>
          <a
            className="text-sm font-semibold text-brand-pink hover:underline"
            href="https://www.google.com/search?q=damaface"
            target="_blank"
            rel="noreferrer"
          >
            Ver todas avaliações no Google →
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AVALIACOES_MOCK.map((avaliacao) => (
            <blockquote className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm" key={avaliacao.autor}>
              <GoogleLogo />
              <p className="mt-3 text-brand-pink">{"★".repeat(5)}</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">“{avaliacao.texto}”</p>
              <footer className="mt-4 text-sm font-medium text-gray-900">{avaliacao.autor}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

const FORMACAO_LABEL: Record<string, string> = {
  BIOMEDICA_ESTETICA: "Biomédica Estética",
  FARMACEUTICA_ESTETICA: "Farmacêutica Estética",
  DENTISTA: "Dentista",
  DERMATOLOGISTA: "Dermatologista",
}

export function UnidadeTeam({ unidade }: { unidade: Unidade }) {
  if (!unidade.equipe.length) return null

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Nossa equipe</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Especialistas que cuidam da sua beleza</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Profissionais experientes e em constante atualização para oferecer o melhor em harmonização facial e estética.
          </p>
          <a
            className="mt-6 inline-flex items-center justify-center rounded-full border border-brand-pink px-7 py-3 font-semibold text-brand-pink transition hover:bg-brand-pink hover:text-white"
            href={whatsappUrl(unidade.whatsapp, "Olá! Quero conhecer a equipe da Damaface.")}
            target="_blank"
            rel="noreferrer"
          >
            Conhecer a equipe
          </a>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {unidade.equipe.map((pessoa) => {
            const especialista = pessoa.profissao === "ESPECIALISTA"
            const formacao = pessoa.formacao ? FORMACAO_LABEL[pessoa.formacao] ?? pessoa.formacao : undefined
            const iniciais = pessoa.nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()
            return (
              <div className="text-center" key={pessoa.nome}>
                <div className="relative mx-auto aspect-square w-full max-w-[9rem] overflow-hidden rounded-2xl bg-gray-100">
                  {pessoa.foto ? (
                    <Image src={pessoa.foto} alt={pessoa.nome} fill className="object-cover" sizes="144px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-pink/20 to-gray-100 text-xl font-semibold text-brand-pink">
                      {iniciais || "?"}
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{pessoa.nome}</h3>
                <p className="text-sm text-brand-pink">{especialista ? formacao ?? "Especialista" : "Consultor(a) Comercial"}</p>
                {especialista && pessoa.registro && <p className="text-xs text-gray-500">{pessoa.registro}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Data não disponível"
  return new Date(dateString).toLocaleDateString("pt-BR")
}

function calculateReadTime(excerpt: string) {
  const wordsPerMinute = 200
  const wordCount = excerpt.split(" ").length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function UnidadeBlog({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null

  return (
    <section className="bg-gray-50 py-20 sm:py-28">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Do blog</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Conteúdos para você se informar e cuidar ainda mais de si
            </h2>
          </div>
          <Link className="text-sm font-semibold text-brand-pink hover:underline" href="/blog">
            Ver todos os artigos →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getMediaUrl(post.cover_image)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {post.categories[0]?.name || "Geral"}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-500">
                  {formatDate(post.published_at)} · {calculateReadTime(post.excerpt)} min de leitura
                </p>
                <h3 className="mt-2 font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-brand-pink">{post.title}</h3>
                <span className="mt-3 inline-block text-sm font-medium text-brand-pink">Ler mais →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function UnidadeFaq({ faqs, cidade }: { faqs: Faq[]; cidade: string }) {
  if (!faqs.length) return null

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Dúvidas frequentes</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Perguntas frequentes em {cidade}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details className="group rounded-xl border border-gray-200 bg-gray-50 p-5 open:border-brand-pink/40" key={faq.pergunta}>
              <summary className="cursor-pointer list-none font-medium text-gray-900 marker:content-none">{faq.pergunta}</summary>
              <p className="mt-3 leading-7 text-gray-600">{faq.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function UnidadeCTA({ unidade }: { unidade: Unidade }) {
  const enderecoQuery = encodeURIComponent(`${unidade.endereco.rua}, ${unidade.endereco.numero}, ${unidade.cidade} ${unidade.estado}`)
  const horariosAbertos = unidade.horarios.filter((horario) => horario.aberto).slice(0, 2)

  return (
    <section className="bg-gray-50 pb-20 sm:pb-28">
      <div className="container">
        <div className="grid gap-8 rounded-3xl bg-[#0b0f1a] px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-brand-pink" />
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Pronta para transformar a sua beleza?</h2>
            </div>
            <p className="mt-3 max-w-xl text-gray-300">Agende sua avaliação personalizada e descubra o melhor protocolo para você.</p>
            <a
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-pink px-7 py-3 font-semibold text-white shadow-lg shadow-brand-pink/25 transition hover:bg-brand-pink/90"
              href={whatsappUrl(unidade.whatsapp, "Olá! Quero agendar uma avaliação.")}
              target="_blank"
              rel="noreferrer"
            >
              Agendar pelo WhatsApp
            </a>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-6 text-sm text-gray-300 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-semibold text-white">Damaface {unidade.cidade}</p>
            <p>
              {unidade.endereco.rua}, {unidade.endereco.numero}
              <br />
              {unidade.endereco.bairro} · {unidade.cidade}/{unidade.estado}
            </p>
            <p>{formatTelefone(unidade.whatsapp)}</p>
            {horariosAbertos.map((horario) => (
              <p key={horario.dias}>
                {horario.dias}: {horario.abre} às {horario.fecha}
              </p>
            ))}
            <a
              className="mt-3 block overflow-hidden rounded-xl border border-white/10"
              href={`https://www.google.com/maps/search/?api=1&query=${enderecoQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              <iframe
                title={`Mapa Damaface ${unidade.cidade}`}
                src={`https://www.google.com/maps?q=${enderecoQuery}&output=embed`}
                className="h-32 w-full"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
