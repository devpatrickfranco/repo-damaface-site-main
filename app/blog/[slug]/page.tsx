// app/blog/[slug]/page.tsx

import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

// Reutilizamos a função para formatar a data
function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Tipamos os parâmetros que a página recebe da URL
interface PostPageProps {
  params: {
    slug: string;
  };
}

// Esta função opcional melhora a performance, dizendo ao Next.js para
// pré-renderizar todas as páginas de posts publicados durante o build.
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// O componente da página em si
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  // 1. Buscamos o post específico no banco usando o slug da URL
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true, // Importante: Garante que apenas posts publicados possam ser vistos
    },
    include: {
      author: { select: { name: true } },
    },
  });

  // 2. Se nenhum post for encontrado (ou não estiver publicado), mostramos uma página 404
  if (!post) {
    notFound();
  }

  return (
    <section className="section-padding bg-gray-900/30">
      <div className="container">
        <article className="max-w-3xl mx-auto">
          {/* Cabeçalho do Artigo */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              {post.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Imagem de Capa */}
          {post.coverImage && (
            <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg mb-12 shadow-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority // Carregar a imagem principal com prioridade
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg ...">
            {/* USAMOS dangerouslySetInnerHTML PARA RENDERIZAR O HTML */}
            {/* Isso é seguro aqui, pois o conteúdo vem do seu próprio dashboard */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

           {/* Link para voltar */}
           <div className="text-center mt-16">
            <Link href="/blog" className="text-brand-pink hover:underline font-semibold">
                &larr; Voltar para o Blog
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}