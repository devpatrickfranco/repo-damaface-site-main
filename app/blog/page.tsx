'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

import { Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { newsletter } from '@/lib/utils'
import { useState, useEffect } from 'react';
import { getAllPosts, type PostSummary } from '@/lib/posts';
import { getMediaUrl } from '@/lib/api-backend';


const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      // Only show published/approved posts to visitors
      const publishedPosts = data.filter(post => post.status === 'APROVADO');
      setPosts(publishedPosts);
      setIsFetching(false);
    };
    fetchPosts();
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error('Por favor, digite seu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, digite um email válido');
      return;
    }

    setIsLoading(true);

    try {
      await newsletter(email);
      toast.success('Newsletter cadastrada com sucesso! 🎉');
      setEmail('');
    } catch (error) {
      toast.error('Ops! Algo deu errado. Tente novamente.');
      console.error('Erro ao cadastrar newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (excerpt: string) => {
    const wordsPerMinute = 200;
    const wordCount = excerpt.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-pink/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 section-padding">

          <div className="text-center mb-16 animate-on-scroll">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Nosso</span>{' '}
              <span className="text-brand-pink">Blog</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades em estética, dicas de cuidados e informações sobre nossos procedimentos
            </p>
          </div>

          {isFetching ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="card-dark group cursor-pointer animate-on-scroll hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative w-full h-48 overflow-hidden rounded-lg mb-6">
                    <img
                      src={getMediaUrl(post.cover_image)}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-pink/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.categories[0]?.name || 'Geral'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{calculateReadTime(post.excerpt)} min</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-brand-pink transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.slug}
                          className="inline-flex items-center space-x-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag.name}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gray-800">
                          {post.author?.avatar ? (
                            <img
                              src={getMediaUrl(post.author?.avatar) || "https://ui-avatars.com/api/?name=Author"}
                              alt={post.author?.name || "Author"}
                              className="w-8 h-8 rounded-full border border-pink-500/20"
                            />
                          ) : (
                            <User className="p-1 text-gray-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{post.author?.name || 'Damaface'}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center space-x-1 text-brand-pink hover:text-pink-300 transition-colors text-sm font-medium"
                      >
                        <span>Ler mais</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center animate-on-scroll">
            <div className="card-dark max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quer ficar por dentro de tudo?
              </h3>
              <p className="text-gray-400 mb-6">
                Assine nossa newsletter e receba as últimas novidades em estética e cuidados com a pele
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="btn-primary whitespace-nowrap">
                  {isLoading ? 'Cadastrando...' : 'Assinar Newsletter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;