import Image from "next/image"
import Link from "next/link"
import type { Procedimento, Unidade } from "@/types/local-seo"

const whatsappUrl = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`

export function ClinicHero({ unidade, procedimento }: { unidade: Unidade; procedimento?: Procedimento }) {
  const titulo = procedimento ? `${procedimento.nome} em ${unidade.cidade}` : `Clínica de estética em ${unidade.cidade}`
  const resumo = procedimento ? procedimento.resumo : `Tratamentos faciais e corporais com atendimento personalizado em ${unidade.cidade}.`
  return <section className="relative overflow-hidden rounded-3xl bg-zinc-900"><Image src={procedimento?.imagem ?? unidade.imagemHero} alt="" fill priority className="object-cover opacity-30" sizes="(max-width: 1280px) 100vw, 1280px" /><div className="relative px-6 py-20 sm:px-12 sm:py-28"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Damaface {unidade.cidade}</p><h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{titulo}</h1><p className="mt-6 max-w-2xl text-lg text-gray-200">{resumo}</p><a className="btn-primary mt-8 inline-block" href={whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação${procedimento ? ` para ${procedimento.nome}` : ""}.`)} target="_blank" rel="noreferrer">Agendar avaliação</a></div></section>
}

export function ClinicAddress({ unidade }: { unidade: Unidade }) {
  const { endereco } = unidade
  return <section id="endereco" className="card-dark"><h2 className="text-2xl font-semibold">Endereço e contato</h2><address className="mt-4 not-italic leading-7 text-gray-300">{endereco.rua}, {endereco.numero}<br />{endereco.bairro} · {endereco.cidade}/{endereco.estado}<br />CEP {endereco.cep}</address><a className="mt-5 inline-block text-brand-pink hover:underline" href={whatsappUrl(unidade.whatsapp, "Olá! Gostaria de falar com a Damaface.")} target="_blank" rel="noreferrer">Falar pelo WhatsApp</a></section>
}

export function ClinicHours({ unidade }: { unidade: Unidade }) {
  return <section className="card-dark"><h2 className="text-2xl font-semibold">Horários</h2><dl className="mt-4 space-y-3 text-gray-300">{unidade.horarios.map((horario) => <div className="flex justify-between gap-4" key={horario.dias}><dt>{horario.dias}</dt><dd>{horario.abre} às {horario.fecha}</dd></div>)}</dl></section>
}

export function ClinicGallery({ unidade }: { unidade: Unidade }) {
  return <section><h2 className="text-2xl font-semibold">Conheça a unidade</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{unidade.galeria.map((imagem, index) => <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" key={imagem}><Image src={imagem} alt={`Damaface ${unidade.cidade} — ambiente ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" /></div>)}</div></section>
}

export function ClinicMap({ unidade }: { unidade: Unidade }) {
  const query = encodeURIComponent(`${unidade.endereco.rua}, ${unidade.endereco.numero}, ${unidade.cidade} ${unidade.estado}`)
  return <section className="card-dark"><h2 className="text-2xl font-semibold">Como chegar</h2><p className="mt-3 text-gray-300">Planeje sua rota até a Damaface {unidade.cidade} pelo Google Maps.</p><a className="mt-5 inline-block text-brand-pink hover:underline" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Abrir no Google Maps</a></section>
}

export function ClinicDoctors({ unidade }: { unidade: Unidade }) {
  return <section><h2 className="text-2xl font-semibold">Equipe</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{unidade.equipe.map((pessoa) => <article className="card-dark" key={pessoa.nome}><h3 className="font-semibold">{pessoa.nome}</h3><p className="mt-1 text-sm text-brand-pink">{pessoa.cargo}</p><p className="mt-3 text-gray-300">{pessoa.descricao}</p></article>)}</div></section>
}

export function ProcedureList({ procedimentos, unidade }: { procedimentos: Procedimento[]; unidade: Unidade }) {
  return <section><h2 className="text-2xl font-semibold">Procedimentos em {unidade.cidade}</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{procedimentos.map((procedimento) => <Link href={`/${unidade.slug}/${procedimento.slug}`} className="card-dark group" key={procedimento.slug}><h3 className="font-semibold group-hover:text-brand-pink">{procedimento.nome}</h3><p className="mt-3 text-sm text-gray-300">{procedimento.resumo}</p><span className="mt-4 inline-block text-sm text-brand-pink">Saiba mais →</span></Link>)}</div></section>
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
