'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { newsletter } from '@/lib/utils'
import { useState } from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
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

  const posts = [
    {
      id: 1,
      title: 'Os Benefícios do Botox para Rugas de Expressão', // Título corrigido
      excerpt: 'Descubra como o botox pode suavizar rugas de expressão de forma natural e segura, proporcionando um visual mais jovem e descansado.', // Excerpt do post completo
      author: 'Dra. Maria Silva',
      date: '2024-01-15', // Mantida a mesma data
      readTime: '5 min',
      category: 'Procedimentos Faciais', // Categoria corrigida
      image: 'https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', // Imagem mantida (é a mesma do coverImage)
      slug: 'beneficios-botox-rugas-expressao' // Slug corrigido
    },
    {
      id: 2,
      title: 'Harmonização Facial: O que Você Precisa Saber', // Título corrigido
      excerpt: 'Um guia completo sobre harmonização facial, desde os procedimentos mais comuns até os cuidados pós-tratamento.', // Excerpt do post completo
      author: 'Dr. João Santos',
      date: '2024-01-10', // Mantida a mesma data
      readTime: '4 min',
      category: 'Harmonização', // Categoria mantida
      image: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', // Imagem alterada para match do post 2
      slug: 'harmonizacao-facial-guia-completo' // Slug corrigido
    },
    {
      id: 3,
      title: 'Cuidados Pós-Procedimento: Dicas Essenciais', // Título corrigido
      excerpt: 'Saiba quais cuidados são fundamentais após realizar procedimentos estéticos para garantir os melhores resultados.', // Excerpt do post completo
      author: 'Dr. João Santos',
      date: '2024-01-05', // Mantida a mesma data
      readTime: '6 min',
      category: 'Cuidados', // Categoria mantida
      image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop', // Imagem alterada para match do post 3
      slug: 'cuidados-pos-procedimento-dicas' // Slug corrigido
    }
  ];

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
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="card-dark group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Featured Image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <div
                    className="w-full h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors leading-tight">
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
                        <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-500 text-xs">{post.author}</span>
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