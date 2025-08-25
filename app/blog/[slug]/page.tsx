import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen, Tag } from 'lucide-react';
import Link from 'next/link';
import ShareButton from './ShareButton';
import AgendarButton from './AgendarButton';
import Footer from '@/components/Footer';


// Função para calcular tempo de leitura estimado
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Função para formatar a data
function formatDate(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Função para formatar data relativa
function formatRelativeDate(date: Date | null) {
  if (!date) return '';
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
  return `${Math.floor(diffInDays / 365)} anos atrás`;
}

// Tipagem dos parâmetros
interface PostPageProps {
  params: {
    slug: string;
  };
}

// Geração de páginas estáticas
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Geração de metadados dinâmicos
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
    },
  });

  if (!post) {
    return {
      title: 'Post não encontrado',
      
    };
  }

  return {
    title: `${post.title} | DamaFace Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// Componente da página
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  
  // Buscar o post específico
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true,
    },
    include: {
      author: { select: { name: true } },
    },
  });


  if (!post) {
    notFound();
  }

  // Buscar posts relacionados
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });


  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-black">
      {/* Header com navegação */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-gray-400 hover:text-brand-pink transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar ao Blog</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <ShareButton title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {post.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>
        )}
        
        <div className="relative z-10 container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Categoria/Tag */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center space-x-1 bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold">
                <Tag className="w-3 h-3" />
                <span>Estética</span>
              </span>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta informações */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de leitura</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Publicado {formatRelativeDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo do artigo */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Imagem de capa em destaque */}
            {post.coverImage && (
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl mb-12 shadow-2xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Conteúdo do post */}
            <article className="prose prose-invert prose-lg max-w-none">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </article>

            {/* Separador */}
            <div className="my-16 flex items-center justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-pink to-transparent"></div>
            </div>

            {/* Informações do autor */}
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-brand-pink" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Sobre {post.author.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Especialista em estética facial e corporal com anos de experiência em tratamentos 
                    inovadores. Compartilha conhecimento e dicas para ajudar você a alcançar seus 
                    objetivos de beleza e bem-estar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-900/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Artigos Relacionados
                </h2>
                <p className="text-gray-400">
                  Continue lendo sobre estética e cuidados com a pele
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <article className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-pink/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                      {relatedPost.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-pink transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        
                        {relatedPost.excerpt && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {relatedPost.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedPost.author.name}</span>
                          <span>{formatRelativeDate(relatedPost.publishedAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-pink/10 to-purple-500/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Gostou do conteúdo?
            </h2>
            <p className="text-gray-300 mb-8">
              Agende uma avaliação gratuita e descubra os melhores tratamentos para você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AgendarButton />
              <Link
                href="/blog"
                className="border border-gray-600 hover:border-brand-pink text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-pink/10"
              >
                Ver Mais Artigos
              </Link>
            </div>
          </div>
        </div>
      </section>
    <Footer />
    </div>
    
  );
}