import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Breadcrumb } from "@/components/local-seo/Breadcrumb"
import { ProceduresCarousel } from "@/components/local-seo/ProceduresCarousel"
import { UnidadeAbout, UnidadeCTA, UnidadeFaq, UnidadeBlog, UnidadeHero, UnidadeHighlights, UnidadeMidCTA, UnidadeReviews, UnidadeTeam } from "@/components/local-seo/UnidadeSections"
import { JsonLd } from "@/components/local-seo/JsonLd"
import { getPaginaRaiz, getProcedimentosDaUnidade, getUnidadesIndexaveis } from "@/services/unidades"
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
    const unidades = await getUnidadesIndexaveis()
    return <main className="container py-12 sm:py-20"><Breadcrumb items={[{ label: "Início", href: "/" }, { label: pagina.procedimento.nome }]} /><section className="rounded-3xl bg-zinc-900 px-6 py-16 sm:px-12"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-pink">Procedimento Damaface</p><h1 className="mt-4 text-4xl font-bold sm:text-6xl">{pagina.procedimento.nome}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">{pagina.procedimento.descricao}</p><h2 className="mt-12 text-2xl font-semibold">Encontre uma unidade</h2><div className="mt-5 flex flex-wrap gap-3">{unidades.map((unidade) => <Link className="rounded-full border border-gray-700 px-5 py-3 hover:border-brand-pink" href={`/${unidade.slug}/${pagina.procedimento.slug}`} key={unidade.slug}>{pagina.procedimento.nome} em {unidade.cidade}</Link>)}</div></section></main>
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
