'use client';

import { ArrowRight, Sparkles, Zap, Heart } from 'lucide-react';
import Link from 'next/link';

const Categories = () => {
  const categories = [
    {
      title: 'Tratamentos Faciais',
      description: 'Rejuvenescimento, harmonização e cuidados especializados para o rosto',
      icon: <Sparkles className="w-8 h-8" />,
      href: '/facial',
      image: '/images/categorias/facial-1.png',
      treatments: ['Botox', 'Preenchimento', 'Bioestimulador', 'Fios de Sustentação'],
      color: 'from-brand-pink/20 to-purple-500/20'
    },
    {
      title: 'Tratamentos Corporais',
      description: 'Modelagem corporal, redução de medidas e tratamentos para o corpo',
      icon: <Zap className="w-8 h-8" />,
      href: '/corporal',
      image: '/images/categorias/corporal-1.png',
      treatments: ['Criolipólise', 'Criofrequência', 'Emagrecimento', 'Flacidez'],
      color: 'from-blue-500/20 to-brand-pink/20'
    },
    {
      title: 'Não Invasivos',
      description: 'Tratamentos suaves e eficazes sem necessidade de procedimentos invasivos',
      icon: <Heart className="w-8 h-8" />,
      href: '/nao-invasivos',
      image: '/images/categorias/não-invasivo-1.png',
      treatments: ['Limpeza de Pele', 'Peeling', 'Laser CO2', 'Microagulhamento'],
      color: 'from-green-500/20 to-brand-pink/20'
    }
  ];

  return (
    <section className="section-padding">
      <div className="container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Nossas</span>{' '}
            <span className="text-brand-pink">Especialidades</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Oferecemos uma gama completa de tratamentos estéticos com tecnologia de ponta e resultados excepcionais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group cursor-pointer animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Link href={category.href}>
                <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 border border-gray-800 transition-all duration-500 hover:border-brand-pink/50 hover:shadow-2xl hover:shadow-brand-pink/10 hover:-translate-y-2">
                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url("${category.image}")` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    
                    {/* Icon */}
                    <div className="absolute top-6 left-6 text-brand-pink bg-white/10 backdrop-blur-sm rounded-full p-3">
                      {category.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-pink transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Treatment List */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {category.treatments.map((treatment) => (
                        <div
                          key={treatment}
                          className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700"
                        >
                          {treatment}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-brand-pink font-semibold">Ver Tratamentos</span>
                      <ArrowRight className="w-5 h-5 text-brand-pink group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
