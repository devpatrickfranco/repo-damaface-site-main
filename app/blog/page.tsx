// app/blog/page.tsx
'use client';


import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogFilters from './BlogFilters';

// Função para formatar a data de forma amigável
function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function BlogPage() {
  // Busca categorias e tags para filtros
  const [categories, tags, posts] = await Promise.all([
    prisma.category.findMany(),
    prisma.tag.findMany(),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true } },
        categories: true,
        tags: true,
      },
    })
  ]);

  return (

    <section className="section-padding bg-gray-900/30">
      <Header />
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Nosso</span>{' '}
            <span className="text-brand-pink">Blog</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Fique por dentro das últimas novidades, dicas e artigos sobre estética e bem-estar.
          </p>
        </div>

        {/* Filtros de busca e seleção */}
        <BlogFilters categories={categories} tags={tags} onFilter={() => {}} />

        {posts.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>Nenhum post publicado no momento. Volte em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card-dark group flex flex-col cursor-pointer" // card-dark para consistência
              >
                {post.coverImage && (
                  <div className="relative w-full h-48 overflow-hidden rounded-lg mb-4">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}
                
                <div className="flex flex-col flex-grow space-y-4">
                    <h2 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors">
                        {post.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="text-xs text-gray-500 space-y-2 pt-4">
                        <div className="flex items-center space-x-2">
                            <User className="w-3 h-3" />
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <span className="flex items-center space-x-1 text-white/80 group-hover:text-brand-pink transition-colors">
                        <span className="text-sm font-medium">Leia mais</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}