import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.damaface.com.br'

  // Fetch dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogPosts = posts
      .filter((post) => post.status === 'APROVADO')
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.published_at || post.created_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  } catch (error) {
    console.error('Error generating sitemap for blog posts:', error)
  }

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

  const proceduresSlugs = [
    'harmonizacao-facial',
    'toxina-botulinica',
    'bioestimulador-de-colageno',
    'preenchimento-facial',
    'fios-de-sustentacao',
    'lipo-de-papada',
    'skinbooster',
    'peeling-quimico',
    'bioestimulador-corporal',
    'peim',
    'preenchimento-de-gluteo',
    'enzimas-para-gordura-localizada',
    'massagem-relaxante',
    'massagem-modeladora',
    'ultraformer',
    'lavieen',
    'criolipolise',
    'laser-co2',
    'depilacao-a-laser',
    'limpeza-de-pele',
    'microagulhamento',
  ]

  const procedureRoutes: MetadataRoute.Sitemap = proceduresSlugs.map((slug) => ({
    url: `${baseUrl}/procedimentos/${slug}`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))


  return [...staticRoutes, ...procedureRoutes, ...blogPosts]
}
