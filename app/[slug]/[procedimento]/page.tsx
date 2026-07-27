import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/local-seo/Breadcrumb"
import { ClinicCTA, ClinicHero, FaqSection, ProcedureList } from "@/components/local-seo/ClinicSections"
import { JsonLd } from "@/components/local-seo/JsonLd"
import { metadataDoProcedimento, schemaBreadcrumb, schemaDaUnidade, schemaDoProcedimento, schemaFaq } from "@/services/seo"
import { getProcedimentoDaUnidade, getProcedimentosDaUnidade, getUnidadesIndexaveis, getUnidade } from "@/services/unidades"

export const revalidate = 3600
type Props = { params: Promise<{ slug: string; procedimento: string }> }

export async function generateStaticParams() {
  const unidades = await getUnidadesIndexaveis()
  const porUnidade = await Promise.all(
    unidades.map(async (unidade) => {
      const procedimentos = await getProcedimentosDaUnidade(unidade.slug)
      return procedimentos.map((procedimento) => ({ slug: unidade.slug, procedimento: procedimento.slug }))
    }),
  )
  return porUnidade.flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, procedimento: procedimentoSlug } = await params
  const [unidade, procedimento] = await Promise.all([getUnidade(slug), getProcedimentoDaUnidade(slug, procedimentoSlug)])
  if (!unidade || !procedimento) return { title: "Página não encontrada", robots: { index: false, follow: false } }
  return metadataDoProcedimento(procedimento, unidade)
}

export default async function ProcedimentoLocal({ params }: Props) {
  const { slug, procedimento: procedimentoSlug } = await params
  const [unidade, procedimento] = await Promise.all([getUnidade(slug), getProcedimentoDaUnidade(slug, procedimentoSlug)])
  if (!unidade || !procedimento) notFound()
  const procedimentosDaUnidade = await getProcedimentosDaUnidade(unidade.slug)
  const relacionados = procedimentosDaUnidade.filter((item) => item.slug !== procedimento.slug)
  return <main className="container py-8 sm:py-12"><Breadcrumb items={[{ label: "Início", href: "/" }, { label: unidade.cidade, href: `/${unidade.slug}` }, { label: procedimento.nome }]} /><JsonLd data={schemaDaUnidade(unidade)} /><JsonLd data={schemaDoProcedimento(procedimento, unidade)} /><JsonLd data={schemaFaq(procedimento.faqs)} /><JsonLd data={schemaBreadcrumb([{ label: "Início", href: "/" }, { label: unidade.cidade, href: `/${unidade.slug}` }, { label: procedimento.nome, href: `/${unidade.slug}/${procedimento.slug}` }])} /><ClinicHero unidade={unidade} procedimento={procedimento} /><div className="section-padding space-y-16"><section className="max-w-4xl"><h2 className="text-3xl font-semibold">Sobre {procedimento.nome}</h2><p className="mt-5 text-lg leading-8 text-gray-300">{procedimento.descricao}</p></section><div className="grid gap-8 md:grid-cols-2"><section><h2 className="text-2xl font-semibold">Benefícios</h2><ul className="mt-5 space-y-3 text-gray-300">{procedimento.beneficios.map((item) => <li key={item}>• {item}</li>)}</ul></section><section><h2 className="text-2xl font-semibold">Indicações</h2><ul className="mt-5 space-y-3 text-gray-300">{procedimento.indicacoes.map((item) => <li key={item}>• {item}</li>)}</ul></section></div><section className="card-dark"><h2 className="text-2xl font-semibold">Como funciona</h2><ol className="mt-5 grid gap-4 md:grid-cols-3">{procedimento.comoFunciona.map((item, index) => <li className="rounded-xl bg-black/30 p-4 text-gray-300" key={item}><span className="mr-2 font-semibold text-brand-pink">0{index + 1}</span>{item}</li>)}</ol></section><section><h2 className="text-2xl font-semibold">Contraindicações e cuidados</h2><p className="mt-4 leading-7 text-gray-300">A indicação depende de avaliação individual. Informe à equipe sobre seu histórico de saúde, medicamentos e condições atuais.</p><ul className="mt-4 space-y-2 text-gray-300">{procedimento.contraindicacoes.map((item) => <li key={item}>• {item}</li>)}</ul></section><FaqSection faqs={procedimento.faqs} cidade={unidade.cidade} /><section className="card-dark"><h2 className="text-2xl font-semibold">Unidade Damaface {unidade.cidade}</h2><p className="mt-4 text-gray-300">{unidade.endereco.rua}, {unidade.endereco.numero} · {unidade.endereco.bairro}</p><Link className="mt-5 inline-block text-brand-pink hover:underline" href={`/${unidade.slug}`}>Ver detalhes da unidade</Link></section>{relacionados.length > 0 && <ProcedureList unidade={unidade} procedimentos={relacionados} />}<ClinicCTA unidade={unidade} procedimento={procedimento} /></div></main>
}
