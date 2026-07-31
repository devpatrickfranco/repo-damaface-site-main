import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ProceduresCarousel } from "@/components/local-seo/ProceduresCarousel"
import { UnidadeAbout, UnidadeCTA, UnidadeFaq, UnidadeBlog, UnidadeHero, UnidadeHighlights, UnidadeMidCTA, UnidadeReviews, UnidadeTeam } from "@/components/local-seo/UnidadeSections"
import { ProcedureFaq, ProcedureFinalCTA, ProcedureHero, ProcedureHowItWorks, ProcedureOverview } from "@/components/local-seo/ProcedureSections"
import { LocationFinder } from "@/components/local-seo/LocationFinder"
import { PageViewTracker } from "@/components/local-seo/PageViewTracker"
import { JsonLd } from "@/components/local-seo/JsonLd"
import { getPaginaRaiz, getProcedimentosDaUnidade, getUnidadesIndexaveis, getUnidadesPorProcedimento } from "@/services/unidades"
import { getProcedimentos } from "@/services/procedimentos"
import { metadataDaUnidade, metadataDoProcedimento, schemaBreadcrumb, schemaDaUnidade, schemaFaq } from "@/services/seo"
import { getAllPosts } from "@/lib/posts"
import Blog from "@/components/Blog"

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const [unidades, procedimentos] = await Promise.all([getUnidadesIndexaveis(), getProcedimentos()])
  return [
    ...unidades.map(({ slug }) => ({ slug })),
    ...procedimentos.map(({ slug }) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pagina = await getPaginaRaiz(slug)
  if (!pagina) return { title: "Página não encontrada", robots: { index: false, follow: false } }
  return pagina.tipo === "unidade" ? metadataDaUnidade(pagina.unidade) : metadataDoProcedimento(pagina.procedimento)
}

export default async function PaginaRaiz({ params }: Props) {
  const { slug } = await params
  const pagina = await getPaginaRaiz(slug)
  if (!pagina) notFound()

  if (pagina.tipo === "procedimento") {
    const { procedimento } = pagina
    const unidades = await getUnidadesPorProcedimento(procedimento.slug)

    return (
      <>
        <Header />
        <PageViewTracker event="procedure_page_view" payload={{ procedimento: procedimento.slug }} />
        <JsonLd data={schemaFaq(procedimento.faqs)} />
        <JsonLd
          data={schemaBreadcrumb([
            { label: "Início", href: "/" },
            { label: procedimento.nome, href: `/${procedimento.slug}` },
          ])}
        />
        <main>
          <ProcedureHero procedimento={procedimento} />
          <ProcedureOverview procedimento={procedimento} />
          <ProcedureHowItWorks procedimento={procedimento} />
          <LocationFinder unidades={unidades} procedimentoSlug={procedimento.slug} />
          <ProcedureFaq faqs={procedimento.faqs} />
          <ProcedureFinalCTA procedimento={procedimento} />
        </main>
        <Footer />
      </>
    )
  }

  const { unidade } = pagina
  const procedimentosDaUnidade = await getProcedimentosDaUnidade(unidade.slug)

  const todosPosts = await getAllPosts()
  const recentPosts = todosPosts
    .filter((post) => post.status === "APROVADO")
    .sort((a, b) => {
      const dataA = new Date(a.published_at || a.created_at).getTime()
      const dataB = new Date(b.published_at || b.created_at).getTime()
      return dataB - dataA
    })
    .slice(0, 3)

  return (
    <>
      <Header />
      <JsonLd data={schemaDaUnidade(unidade)} />
      <JsonLd data={schemaFaq(unidade.faqs)} />
      <JsonLd data={schemaBreadcrumb([{ label: "Início", href: "/" }, { label: unidade.cidade, href: `/${unidade.slug}` }])} />
      <main>
        <UnidadeHero unidade={unidade} />

        <section className="animate-on-scroll bg-white py-20 sm:py-28">
          <div className="container">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Nossos tratamentos</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Encontre o tratamento ideal para você</h2>
            <p className="mt-3 max-w-xl text-gray-600">Tecnologia, experiência e protocolos personalizados para valorizar sua beleza.</p>
            <div className="mt-10">
              <ProceduresCarousel unidade={unidade} procedimentos={procedimentosDaUnidade} />
            </div>
            </div>
        </section>

        <UnidadeAbout unidade={unidade} />
        <UnidadeHighlights />
        <UnidadeReviews unidade={unidade} />
        <UnidadeTeam unidade={unidade} />
        <UnidadeMidCTA unidade={unidade} />
        <Blog posts={recentPosts} />
        <UnidadeFaq faqs={unidade.faqs} cidade={unidade.cidade} />
        <UnidadeCTA unidade={unidade} />
      </main>
      <Footer unidade={unidade} />
    </>
  )
}
