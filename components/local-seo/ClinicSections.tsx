import Image from "next/image"
import Link from "next/link"
import type { Procedimento, Unidade } from "@/types/local-seo"

export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`

const SUBHEADLINE_MAX_LENGTH = 180

function truncateSubheadline(texto: string, max = SUBHEADLINE_MAX_LENGTH) {
  if (texto.length <= max) return texto
  const cortado = texto.slice(0, max)
  return `${cortado.slice(0, cortado.lastIndexOf(" "))}…`
}

// Slugs dos procedimentos cadastrados no backend ainda não têm foto própria — usamos as fotos
// já existentes no repo do front-end como imagem padrão de cada procedimento.
export const IMAGEM_POR_SLUG: Record<string, string> = {
  "botox": "/images/procedimentos/botox/gerais/botox-2.png",
  "toxina-botulinica": "/images/procedimentos/botox/gerais/botox-2.png",
  "preenchimento": "/images/procedimentos/preenchimento/facial-2.png",
  "preenchimento-facial": "/images/procedimentos/preenchimento/facial-2.png",
  "bioestimulador": "/images/procedimentos/bioestimulador/gerais/bioestimulador-1.jpeg",
  "bioestimulador-de-colageno": "/images/procedimentos/bioestimulador/gerais/bioestimulador-1.jpeg",
  "bioestimulador-corporal": "/images/procedimentos/.corporal/bioestimulador-coporal/gerais/bioestimulador-coporal-1.webp",
  "fios": "/images/procedimentos/fios/gerais/fios-1.png",
  "fios-de-sustentacao": "/images/procedimentos/fios/gerais/fios-1.png",
  "full-face": "/images/procedimentos/full-face/gerais/full-face-1.png",
  "harmonizacao-facial": "/images/procedimentos/full-face/gerais/full-face-1.png",
  "labial": "/images/procedimentos/labial/gerais/labial-1.png",
  "lipo-de-papada": "/images/procedimentos/lipo-de-papada/gerais/lipo-de-papada-1.png",
  "microagulhamento": "/images/procedimentos/microagulhamento/gerais/microagulhamento-1.png",
  "peeling-quimico": "/images/procedimentos/peeling-quimico/gerais/peeling-quimico-1.png",
  "peim": "/images/procedimentos/peim/gerais/peim-1.png",
  "skinbooster": "/images/procedimentos/skinbooster/gerais/skinbooster-1.png",
  "criolipolise": "/images/procedimentos/.nao-invasivo/criolipolise/gerais/criolipolis-1.webp",
  "depilacao-a-laser": "/images/procedimentos/.nao-invasivo/depilacao-laser/gerais/depilacao-laser-1.webp",
  "enzimas-para-gordura-localizada": "/images/procedimentos/.corporal/gordura-localizada/gerais/gordura-localizada-1.webp",
  "laser-co2": "/images/procedimentos/.nao-invasivo/laser-co2/gerais/laser-co2-1.webp",
  "lavieen": "/images/procedimentos/.nao-invasivo/lavieen/gerais/laser-lavieen-1.webp",
  "limpeza-de-pele": "/images/procedimentos/.nao-invasivo/limpeza-de-pele/gerais/limpeza-de-pele-1.webp",
  "massagem-modeladora": "/images/procedimentos/.corporal/massagem-modeladora/gerais/massagem-modeladora-1.webp",
  "massagem-relaxante": "/images/procedimentos/.corporal/massagem-relaxante/gerais/massagem-relaxante-1.webp",
  "preenchimento-de-gluteo": "/images/procedimentos/.corporal/preenchimento-de-gluteo/gerais/preenchimento-de-gluteo-1.webp",
  "ultraformer": "/images/categorias/não-invasivo-1.webp",
}

export function ClinicHero({ unidade, procedimento }: { unidade: Unidade; procedimento?: Procedimento }) {
  const titulo = procedimento ? `${procedimento.nome} em ${unidade.cidade}` : `Clínica de estética em ${unidade.cidade}`
  const resumoPadrao = `Tratamentos faciais e corporais com atendimento personalizado em ${unidade.cidade}.`
  const resumo = procedimento ? procedimento.resumo : truncateSubheadline(unidade.descricao?.trim() || resumoPadrao)
  const imagemHero = procedimento ? (IMAGEM_POR_SLUG[procedimento.slug] ?? procedimento.imagem) : unidade.imagemHero
  return <section className="relative overflow-hidden rounded-3xl bg-zinc-900"><Image src={imagemHero} alt="" fill priority className="object-cover opacity-30" sizes="(max-width: 1280px) 100vw, 1280px" /><div className="relative px-6 py-20 sm:px-12 sm:py-28"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Damaface {unidade.cidade}</p><h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{titulo}</h1><p className="mt-6 max-w-2xl text-lg text-gray-200">{resumo}</p><a className="btn-primary mt-8 inline-block" href={whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação${procedimento ? ` para ${procedimento.nome}` : ""}.`)} target="_blank" rel="noreferrer">Agendar avaliação</a></div></section>
}

export function ClinicAddress({ unidade }: { unidade: Unidade }) {
  const { endereco } = unidade
  return <section id="endereco" className="card-dark"><h2 className="text-2xl font-semibold">Endereço e contato</h2><address className="mt-4 not-italic leading-7 text-gray-300">{endereco.rua}, {endereco.numero}<br />{endereco.bairro} · {endereco.cidade}/{endereco.estado}<br />CEP {endereco.cep}</address><a className="mt-5 inline-block text-brand-pink hover:underline" href={whatsappUrl(unidade.whatsapp, "Olá! Gostaria de falar com a Damaface.")} target="_blank" rel="noreferrer">Falar pelo WhatsApp</a></section>
}

export function ClinicHours({ unidade }: { unidade: Unidade }) {
  return <section className="card-dark"><h2 className="text-2xl font-semibold">Horários</h2><dl className="mt-4 space-y-3 text-gray-300">{unidade.horarios.map((horario) => <div className="flex justify-between gap-4" key={horario.dias}><dt>{horario.dias}</dt><dd>{horario.aberto ? `${horario.abre} às ${horario.fecha}` : "Fechado"}</dd></div>)}</dl></section>
}

export function ClinicGallery({ unidade }: { unidade: Unidade }) {
  return <section><h2 className="text-2xl font-semibold">Conheça a unidade</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{unidade.galeria.map((imagem, index) => <div className="relative aspect-square overflow-hidden rounded-xl" key={imagem}><Image src={imagem} alt={`Damaface ${unidade.cidade} — ambiente ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" /></div>)}</div></section>
}

export function ClinicMap({ unidade }: { unidade: Unidade }) {
  const query = encodeURIComponent(`${unidade.endereco.rua}, ${unidade.endereco.numero}, ${unidade.cidade} ${unidade.estado}`)
  return <section className="card-dark"><h2 className="text-2xl font-semibold">Como chegar</h2><p className="mt-3 text-gray-300">Planeje sua rota até a Damaface {unidade.cidade} pelo Google Maps.</p><a className="mt-5 inline-block text-brand-pink hover:underline" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Abrir no Google Maps</a></section>
}

const FORMACAO_LABEL: Record<string, string> = {
  BIOMEDICA_ESTETICA: "Biomédica Estética",
  FARMACEUTICA_ESTETICA: "Farmacêutica Estética",
  DENTISTA: "Dentista",
  DERMATOLOGISTA: "Dermatologista",
}

function AvatarEquipe({ nome, foto }: { nome: string; foto?: string }) {
  if (foto) {
    return <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-800"><Image src={foto} alt={nome} fill className="object-cover" sizes="64px" /></div>
  }
  const iniciais = nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase()
  return <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink/40 to-gray-800 text-lg font-semibold text-white">{iniciais || "?"}</div>
}

export function ClinicDoctors({ unidade }: { unidade: Unidade }) {
  if (!unidade.equipe.length) return null
  return <section><h2 className="text-2xl font-semibold">Equipe</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{unidade.equipe.map((pessoa) => { const especialista = pessoa.profissao === "ESPECIALISTA"; const formacao = pessoa.formacao ? FORMACAO_LABEL[pessoa.formacao] ?? pessoa.formacao : undefined; return <article className="card-dark flex gap-4" key={pessoa.nome}><AvatarEquipe nome={pessoa.nome} foto={pessoa.foto} /><div><h3 className="font-semibold">{pessoa.nome}</h3><p className="mt-1 text-sm text-brand-pink">{especialista ? formacao ?? "Especialista" : "Consultor(a) Comercial"}</p>{especialista && pessoa.registro && <p className="mt-2 text-sm text-gray-300">{pessoa.registro}</p>}</div></article> })}</div></section>
}

// Bioestimulador de Colágeno, Toxina Botulínica e Preenchimento Facial vêm primeiro (nessa
// ordem, mesma linha do grid de 3 colunas); os demais mantêm a ordem que já vinha do backend.
const NOMES_PRIORITARIOS = ["Bioestimulador de Colágeno", "Toxina Botulínica", "Preenchimento Facial"].map((nome) =>
  nome.toLowerCase(),
)

export function ordenarProcedimentos(procedimentos: Procedimento[]) {
  const prioritarios = NOMES_PRIORITARIOS
    .map((nome) => procedimentos.find((p) => p.nome.toLowerCase() === nome))
    .filter((p): p is Procedimento => Boolean(p))
  const slugsPrioritarios = new Set(prioritarios.map((p) => p.slug))
  const resto = procedimentos.filter((p) => !slugsPrioritarios.has(p.slug))
  return [...prioritarios, ...resto]
}

export function ProcedureList({ procedimentos, unidade }: { procedimentos: Procedimento[]; unidade: Unidade }) {
  const ordenados = ordenarProcedimentos(procedimentos)
  return <section><h2 className="text-2xl font-semibold">Procedimentos em {unidade.cidade}</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{ordenados.map((procedimento) => { const imagem = IMAGEM_POR_SLUG[procedimento.slug] ?? procedimento.imagem; return <Link href={`/${unidade.slug}/${procedimento.slug}`} className="card-dark group overflow-hidden p-0" key={procedimento.slug}><div className="relative aspect-[4/3] overflow-hidden"><Image src={imagem} alt={procedimento.nome} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="p-5"><h3 className="font-semibold group-hover:text-brand-pink">{procedimento.nome}</h3><p className="mt-3 text-sm text-gray-300">{procedimento.resumo}</p><span className="mt-4 inline-block text-sm text-brand-pink">Saiba mais →</span></div></Link> })}</div></section>
}

export function FaqSection({ faqs, cidade }: { faqs: { pergunta: string; resposta: string }[]; cidade?: string }) {
  return <section><h2 className="text-2xl font-semibold">Perguntas frequentes{cidade ? ` em ${cidade}` : ""}</h2><div className="mt-6 space-y-3">{faqs.map((faq) => <details className="rounded-xl border border-gray-800 bg-gray-900/50 p-5" key={faq.pergunta}><summary className="cursor-pointer font-medium">{faq.pergunta}</summary><p className="mt-3 leading-7 text-gray-300">{faq.resposta}</p></details>)}</div></section>
}

export function ReviewSection({ unidade }: { unidade: Unidade }) {
  if (!unidade.avaliacoes.length) return null
  return <section><h2 className="text-2xl font-semibold">Avaliações</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{unidade.avaliacoes.map((avaliacao) => <blockquote className="card-dark" key={`${avaliacao.autor}-${avaliacao.data}`}><p className="text-brand-pink">{"★".repeat(avaliacao.nota)}</p><p className="mt-3 text-gray-300">“{avaliacao.texto}”</p><footer className="mt-4 text-sm">{avaliacao.autor}</footer></blockquote>)}</div></section>
}

export function ClinicCTA({ unidade, procedimento }: { unidade: Unidade; procedimento?: Procedimento }) {
  return <section className="rounded-3xl bg-brand-pink px-6 py-12 text-center sm:px-12"><h2 className="text-3xl font-bold">Agende sua avaliação em {unidade.cidade}</h2><p className="mx-auto mt-4 max-w-xl text-white/90">Converse com a equipe para tirar dúvidas sobre {procedimento?.nome ?? "os procedimentos"} e encontrar o melhor horário.</p><a className="mt-7 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-pink" href={whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação${procedimento ? ` para ${procedimento.nome}` : ""}.`)} target="_blank" rel="noreferrer">Chamar no WhatsApp</a></section>
}
