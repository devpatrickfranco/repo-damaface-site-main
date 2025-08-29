import { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import BlogClientPage from "./BlogClientPage";

export const revalidate = 60; // 🔹 ISR habilitado

type BlogPageProps = {
  params: { slug: string };
};

// Geração de rotas estáticas
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Metadata dinâmica
export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

// Server Component principal
export default async function BlogPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>Post não encontrado</div>;
  }

  return <BlogClientPage post={post} />;
}
