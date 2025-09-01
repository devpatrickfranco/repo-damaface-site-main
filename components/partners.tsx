'use client';

import { Star, Award, Shield, Heart } from 'lucide-react';
import { CtaButtonWhatsapp } from './CtaButtonWhatsapp';

const Partners = () => {
  const partners = [
    {
      id: 'allergan',
      name: 'Allergan',
      description: 'Líder mundial em produtos para harmonização facial',
      logo: '/images/partners/logo-allerngan.png',
      products: ['Botox', 'Juvederm', 'Voluma'],
      certification: 'Certificação Diamond',
      rating: 5.0
    },
    {
      id: 'merz',
      name: 'Merz Aesthetics',
      description: 'Excelência em bioestimuladores e preenchimentos',
      logo: '/images/partners/logo-merz.png',
      products: ['Radiesse', 'Belotero', 'Xeomin'],
      certification: 'Centro de Excelência',
      rating: 5.0
    },
    {
      id: 'galderma',
      name: 'Galderma',
      description: 'Inovação em dermatologia e medicina estética',
      logo: '/images/partners/logo-galderma.jpg',
      products: ['Restylane', 'Sculptra', 'Emervel'],
      certification: 'Parceiro Premium',
      rating: 5.0
    },

    {
      id: 'rennova',
      name: 'Rennova',
      description: 'Excelência em tratamentos estéticos e dermocosméticos',
      logo: '/images/partners/logo-rennova.png',
      products: ['Toxina Nabota', 'Bioestimuladores Elleva e Diamond', 'Linha completa de preenchedores'],
      certification: 'Distribuidor Oficial',
      rating: 4.9
    }

  ];

  const certifications = [
    {
      icon: Award,
      title: 'Certificações Internacionais',
      description: 'Reconhecimento mundial em medicina estética'
    },
    {
      icon: Shield,
      title: 'Produtos Aprovados',
      description: 'Todos os produtos são aprovados pela ANVISA'
    },
    {
      icon: Heart,
      title: 'Compromisso com Qualidade',
      description: 'Parceria com as melhores marcas do mercado'
    }
  ];

  return (
    <section className="section-padding bg-gray-900/30 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-pink/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">

        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Nossas</span>{' '}
            <span className="text-brand-pink">Parcerias</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Trabalhamos exclusivamente com as marcas mais renomadas e confiáveis do mercado mundial de medicina estética
          </p>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="card-dark text-center animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <cert.icon className="w-8 h-8 text-brand-pink" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {cert.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="card-dark group cursor-pointer animate-on-scroll hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Logo */}
              <div className="relative w-full h-32 overflow-hidden rounded-lg mb-6 bg-white/5"> {/* Mantido w-full h-32 no pai para definir o espaço */}
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  className="object-cover w-full h-full" 
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors">
                    {partner.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-brand-pink">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{partner.rating}/5</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {partner.description}
                </p>

                {/* Certification Badge */}
                <div className="inline-flex items-center space-x-2 bg-brand-pink/20 text-brand-pink px-3 py-1 rounded-full text-xs font-semibold">
                  <Award className="w-3 h-3" />
                  <span>{partner.certification}</span>
                </div>

                {/* Products */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Principais Produtos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="text-center animate-on-scroll">
          <div className="card-dark max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-brand-pink" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Garantia de Qualidade e Segurança
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Todos os produtos utilizados na DamaFace são originais, importados diretamente dos fabricantes
              e possuem registro na ANVISA. Nossa equipe é constantemente treinada e certificada pelas marcas parceiras,
              garantindo que você receba sempre o melhor tratamento com os mais altos padrões de segurança.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-pink mb-1">100%</div>
                <div className="text-xs text-gray-400">Produtos Originais</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-pink mb-1">6+</div>
                <div className="text-xs text-gray-400">Marcas Parceiras</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-pink mb-1">50+</div>
                <div className="text-xs text-gray-400">Produtos Disponíveis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-pink mb-1">5★</div>
                <div className="text-xs text-gray-400">Avaliação Média</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6 text-center mt-12 animate-on-scroll">
        <CtaButtonWhatsapp className='mt-12' />
      </div>
    </section>
  );
};

export default Partners;