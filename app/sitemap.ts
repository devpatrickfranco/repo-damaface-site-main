import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getProcedimentosDaUnidade, getUnidadesIndexaveis } from '@/services/unidades'
import { getProcedimentos } from '@/services/procedimentos'

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.damaface.com.br'

  // Fetch dynamic blog posts
  const posts = await getAllPosts()
  const blogPosts: MetadataRoute.Sitemap = posts
    .filter((post) => post.status === 'APROVADO' && post.published)
    .map((post) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.published_at || post.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const lastMod = new Date('2025-08-29')

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/corporal`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/facial`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nao-invasivos`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Catálogo antigo (/procedimentos/{slug}) agora redireciona (301) para a rota nova —
  // não deve mais aparecer no sitemap, só a URL canônica em nationalSeoRoutes.

  const unidadesIndexaveis = await getUnidadesIndexaveis()
  const localSeoRoutesPorUnidade = await Promise.all(
    unidadesIndexaveis.map(async (unidade) => {
      const procedimentosDaUnidade = await getProcedimentosDaUnidade(unidade.slug)
      return [
        { url: `${baseUrl}/${unidade.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        ...procedimentosDaUnidade.map((procedimento) => ({ url: `${baseUrl}/${unidade.slug}/${procedimento.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
      ]
    }),
  )
  const localSeoRoutes: MetadataRoute.Sitemap = localSeoRoutesPorUnidade.flat()

  const procedimentosNacionais = await getProcedimentos()
  const nationalSeoRoutes: MetadataRoute.Sitemap = procedimentosNacionais.map((procedimento) => ({
    url: `${baseUrl}/${procedimento.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))


  return [...staticRoutes, ...nationalSeoRoutes, ...localSeoRoutes, ...blogPosts]
}
