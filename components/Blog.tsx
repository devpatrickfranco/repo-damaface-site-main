'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { newsletter } from '@/lib/utils'
import { useState } from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { PostSummary } from '@/lib/posts';
import { getMediaUrl } from '@/lib/api-backend';

interface BlogProps {
  posts?: PostSummary[];
}

const Blog = ({ posts: initialPosts }: BlogProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = 'https://www.damaface.com.br';

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error('Por favor, digite seu email');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, digite um email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      await newsletter(email);
      
      // Sucesso
      toast.success('Newsletter cadastrada com sucesso! 🎉');
      setEmail(''); // Limpa o campo
      
    } catch (error) {
      // Erro
      toast.error('Ops! Algo deu errado. Tente novamente.');
      console.error('Erro ao cadastrar newsletter:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Função para envio com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateReadTime = (excerpt: string) => {
    const wordsPerMinute = 200;
    const wordCount = excerpt.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Use initialPosts or empty array
  const displayPosts = initialPosts || [];

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Nosso</span>{' '}
            <span className="text-brand-pink">Blog</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Dicas, novidades e informações especializadas sobre estética e cuidados com a pele
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <article
              key={post.id}
              className="card-dark group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={`${baseUrl}/blog/${post.slug}`}>
                {/* Featured Image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div
                    className="w-full h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url("${getMediaUrl(post.cover_image)}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.categories[0]?.name || 'Geral'}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{calculateReadTime(post.excerpt)} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-500 text-xs">{post.author?.name || 'Damaface'}</span>
                    <ArrowRight className="w-4 h-4 text-brand-pink group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="max-w-2xl mx-auto text-center animate-on-scroll">
          <div className="card-dark">
            <h3 className="text-2xl font-bold text-white mb-4">
              Receba nossas dicas de beleza
            </h3>
            <p className="text-gray-300 mb-6">
              Assine nossa newsletter e receba conteúdos exclusivos sobre estética e cuidados com a pele
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Seu melhor e-mail"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink transition-colors"
                value={email}
              />
              <button 
                onClick={handleSubscribe} 
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Assinar Newsletter'}
              </button>
            </div>
          </div>
        </div>

        {/* CTA to Blog Page */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link href="/blog" className="btn-secondary">
            Ver todos os artigos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;