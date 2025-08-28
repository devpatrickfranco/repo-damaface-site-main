import { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import BlogClientPage from "./BlogClientPage";

export const revalidate = 60; // 🔹 já pronto pro futuro (ISR)

type PageProps = {
  params: { slug: string };
};

// Static params (enquanto for mock/local)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

// Server component que injeta os dados no Client
export default async function BlogPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div>Post não encontrado</div>;
  }

  return <BlogClientPage post={post} />;
}
