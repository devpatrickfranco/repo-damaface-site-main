import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { JsonLd } from "@/components/local-seo/JsonLd"
import { PageViewTracker } from "@/components/local-seo/PageViewTracker"
import { ProceduresCarousel } from "@/components/local-seo/ProceduresCarousel"
import {
  ProcedureFaq,
  ProcedureFinalCTA,
  ProcedureHero,
  ProcedureHowItWorks,
  ProcedureIndications,
  ProcedureLocation,
  ProcedureOverview,
  ProcedureSafety,
} from "@/components/local-seo/ProcedureSections"
import { UnidadeReviews } from "@/components/local-seo/UnidadeSections"
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
  const outrosProcedimentos = procedimentosDaUnidade.filter((item) => item.slug !== procedimento.slug)

  const breadcrumbItems = [
    { label: "Início", href: "/" },
    { label: unidade.cidade, href: `/${unidade.slug}` },
    { label: procedimento.nome, href: `/${unidade.slug}/${procedimento.slug}` },
  ]

  return (
    <>
      <Header />
      <PageViewTracker event="procedure_local_page_view" payload={{ unidade: unidade.slug, procedimento: procedimento.slug }} />
      <JsonLd data={schemaDaUnidade(unidade)} />
      <JsonLd data={schemaDoProcedimento(procedimento, unidade)} />
      <JsonLd data={schemaFaq(procedimento.faqs)} />
      <JsonLd data={schemaBreadcrumb(breadcrumbItems)} />

      <main>
        <ProcedureHero procedimento={procedimento} unidade={unidade} />
        <ProcedureOverview procedimento={procedimento} />
        <ProcedureIndications procedimento={procedimento} />
        <ProcedureHowItWorks procedimento={procedimento} />
        <UnidadeReviews unidade={unidade} />
        <ProcedureSafety procedimento={procedimento} />
        <ProcedureFaq faqs={procedimento.faqs} />
        <ProcedureLocation unidade={unidade} />

        {outrosProcedimentos.length > 0 && (
          <section className="bg-gray-50 py-16 sm:py-20">
            <div className="container">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Continue explorando</p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Conheça outros procedimentos em {unidade.cidade}
              </h2>
              <div className="mt-10">
                <ProceduresCarousel unidade={unidade} procedimentos={outrosProcedimentos} />
              </div>
            </div>
          </section>
        )}

        <ProcedureFinalCTA procedimento={procedimento} unidade={unidade} />
      </main>

      <Footer unidade={unidade} />
    </>
  )
}
