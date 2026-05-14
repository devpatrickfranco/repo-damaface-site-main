import { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import BlogClientPage from "./BlogClientPage";

export const revalidate = 60;

// Geração de rotas estáticas
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Metadata dinâmica
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post não encontrado",
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

      images: [
        {
          url: post.cover_image,
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
      images: [post.cover_image],
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

  if (!post) {
    return <div>Post não encontrado</div>;
  }

  return <BlogClientPage post={post} />;
}