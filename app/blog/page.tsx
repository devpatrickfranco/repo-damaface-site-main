'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

import { Calendar, User, Tag, ArrowRight, Clock } from 'lucide-react';
import { newsletter } from '@/lib/utils'
import { useState } from 'react';


const BlogPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Dados estáticos dos posts
  const posts = [
    {
      id: '1',
      title: 'Os Benefícios do Botox para Rugas de Expressão',
      slug: 'beneficios-botox-rugas-expressao',
      excerpt: 'Descubra como o botox pode suavizar rugas de expressão de forma natural e segura, proporcionando um visual mais jovem e descansado.',
      content: 'Conteúdo completo do post...',
      coverImage: 'https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg',
      published: true,
      author: {
        name: 'Dra. Maria Silva',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'
      },
      categories: [
        { name: 'Procedimentos Faciais', slug: 'procedimentos-faciais' }
      ],
      tags: [
        { name: 'Botox', slug: 'botox' },
        { name: 'Rugas', slug: 'rugas' },
        { name: 'Rejuvenescimento', slug: 'rejuvenescimento' }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      publishedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Harmonização Facial: O que Você Precisa Saber',
      slug: 'harmonizacao-facial-guia-completo',
      excerpt: 'Um guia completo sobre harmonização facial, desde os procedimentos mais comuns até os cuidados pós-tratamento.',
      content: 'Conteúdo completo do post...',
      coverImage: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg',
      published: true,
      author: {
        name: 'Dr. João Santos',
        avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg'
      },
      categories: [
        { name: 'Harmonização', slug: 'harmonizacao' }
      ],
      tags: [
        { name: 'Harmonização Facial', slug: 'harmonizacao-facial' },
        { name: 'Preenchimento', slug: 'preenchimento' },
        { name: 'Estética', slug: 'estetica' }
      ],
      createdAt: '2024-01-10T14:30:00Z',
      publishedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '3',
      title: 'Cuidados Pós-Procedimento: Dicas Essenciais',
      slug: 'cuidados-pos-procedimento-dicas',
      excerpt: 'Saiba quais cuidados são fundamentais após realizar procedimentos estéticos para garantir os melhores resultados.',
      content: 'Conteúdo completo do post...',
      coverImage: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg',
      published: true,
      author: {
        name: 'Dra. Ana Costa',
        avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg'
      },
      categories: [
        { name: 'Cuidados', slug: 'cuidados' }
      ],
      tags: [
        { name: 'Pós-procedimento', slug: 'pos-procedimento' },
        { name: 'Cuidados', slug: 'cuidados' },
        { name: 'Recuperação', slug: 'recuperacao' }
      ],
      createdAt: '2024-01-05T09:15:00Z',
      publishedAt: '2024-01-05T09:15:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-pink/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 section-padding">
        
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Nosso</span>{' '}
            <span className="text-brand-pink">Blog</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Fique por dentro das últimas novidades em estética, dicas de cuidados e informações sobre nossos procedimentos
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {posts.map((post, index) => (
            <article 
              key={post.id}
              className="card-dark group cursor-pointer animate-on-scroll hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-lg mb-6">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-pink/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.categories[0]?.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt!)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadTime(post.content)} min</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white group-hover:text-brand-pink transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
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

                {/* Author & Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-8 h-8 overflow-hidden rounded-full">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <User className="w-3 h-3" />
                      <span>{post.author.name}</span>
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
 
        {/* CTA Section */}
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