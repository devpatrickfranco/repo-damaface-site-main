import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getMediaUrl } from "@/lib/api-backend";
import BlogClientPage from "./BlogClientPage";
import DOMPurify from "isomorphic-dompurify";

export const revalidate = 60;
// Mantém true (padrão) de propósito: posts publicados depois do build também
// precisam renderizar sob demanda, sem isso um slug novo cairia em 404 até redeploy.
export const dynamicParams = true;

// Geração de rotas estáticas
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts
    .filter((post) => post.status === "APROVADO" && post.published)
    .map((post) => ({
    slug: post.slug,
  }));
}

// Metadata dinâmica
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "APROVADO" || !post.published) {
    return {
      title: "Post não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const url = `https://www.damaface.com.br/blog/${slug}`;

  return {
    title: post.title,

    description: post.excerpt,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      authors: post.author?.name ? [post.author.name] : ["Damaface"],

      images: [
        {
          url: getMediaUrl(post.cover_image),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [getMediaUrl(post.cover_image)],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// Server Component principal
export default async function BlogPage(
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "APROVADO" || !post.published) notFound();

  const safePost = {
    ...post,
    content: DOMPurify.sanitize(post.content)
      .replace(/<h1\b/gi, "<h2")
      .replace(/<\/h1>/gi, "</h2>"),
  };

  const url = `https://www.damaface.com.br/blog/${encodeURIComponent(post.slug)}`;
  const image = getMediaUrl(post.cover_image);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: [image],
      datePublished: post.published_at || post.created_at,
      dateModified: post.published_at || post.created_at,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Person", name: post.author?.name || "Damaface" },
      publisher: {
        "@type": "Organization",
        name: "Damaface",
        url: "https://www.damaface.com.br",
        logo: {
          "@type": "ImageObject",
          url: "https://www.damaface.com.br/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://www.damaface.com.br/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.damaface.com.br/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <BlogClientPage post={safePost} />
    </>
  );
}
