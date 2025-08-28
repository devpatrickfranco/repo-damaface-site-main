'use client';

import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BestSellers = () => {
  const treatments = [
    {
      id: 'botox',
      name: 'Botox',
      description: 'Suaviza rugas de expressão com resultados naturais e duradouros',
      price: 'A partir de R$ 349,00',
      image: '/images/procedimentos/botox/gerais/botox-1.png',
      rating: 4.9,
      category: 'facial',
      popular: true
    },
    {
      id: 'full-face',
      name: 'Harmonização Facial Full Face',
      description: 'Redefine os contornos do rosto, promovendo equilíbrio e rejuvenescimento natural.',
      price: 'Sob consulta',
      image: '/images/procedimentos/full-face/gerais/full-face-1.png',
      rating: 4.8,
      category: 'facial'
    },
    {
      id: 'bioestimulador',
      name: 'Bioestimulador de Colágeno',
      description: 'Estimula a produção natural de colágeno, rejuvenescendo a pele',
      price: 'A partir de R$ 1.799,00',
      image: '/images/procedimentos/bioestimulador/gerais/bioestimulador-1.jpeg',
      rating: 4.8,
      category: 'facial'
    },
    {
      id: 'preenchimento-labial',
      name: 'Preenchimento Labial',
      description: 'Volume e definição natural para lábios harmoniosos',
      price: 'A partir de R$ 990,00',
      image: '/images/procedimentos/labial/gerais/labial-1.png',
      rating: 4.9,
      category: 'facial'
    },
    {
      id: 'fios-sustentacao',
      name: 'Fios de Sustentação',
      description: 'Lifting facial sem cirurgia com efeito lifting imediato',
      price: 'A partir de R$ 349,00',
      image: '/images/procedimentos/fios/gerais/fios-1.png',
      rating: 4.7,
      category: 'facial'
    },
    {
      id: 'peim',
      name: 'Peim',
      description: 'Secagem de Vasinhos',
      price: 'A partir de R$ 189,00',
      image: '/images/procedimentos/peim/gerais/peim-1.png',
      rating: 4.8,
      category: 'facial'
    }
  ];

  return (
    <section className="section-padding bg-gray-900/30 relative pb-24">
      <div className="container">

      {/* Scroll Indicator - topo da seção */}
      <div className="pointer-events-none z-20 flex justify-center mb-6 animate-bounce">
        <div className="w-7 h-12 border-2 border-white/40 bg-black/30 rounded-full flex justify-center items-start relative">
          <div className="w-1.5 h-4 bg-white/80 rounded-full mt-2 animate-pulse shadow-md"></div>
        </div>
      </div>

        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Tratamentos</span>{' '}
            <span className="text-brand-pink">Mais Procurados</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Descubra os procedimentos favoritos dos nossos clientes, com resultados comprovados e satisfação garantida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => {
            // Gerar slug para o procedimento
            const slugMap = {
              'botox': 'toxina-botulinica',
              'bioestimulador': 'bioestimulador-de-colageno',
              'preenchimento-labial': 'preenchimento-facial',
              'fios-sustentacao': 'fios-de-sustentacao',
              'skinbooster': 'skinbooster',
              'full-face': 'harmonizacao-facial',
            };
            const slug = (slugMap as Record<string, string>)[treatment.id] || treatment.id;
            return (
              <Link
                key={treatment.id}
                href={`/procedimentos/${slug}`}
                className="card-dark group cursor-pointer animate-on-scroll block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {treatment.popular && (
                  <div className="absolute -top-3 left-6 bg-brand-pink text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Mais Popular
                  </div>
                )}

                {/* Imagem com Next/Image */}
                <div className="relative w-full h-48 overflow-hidden rounded-lg mb-4">
                  <Image
                    src={treatment.image}
                    alt={treatment.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors">
                      {treatment.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-brand-pink">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{treatment.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {treatment.description}
                  </p>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-lg font-semibold text-brand-pink">
                      {treatment.price}
                    </span>
                    <span className="flex items-center space-x-1 text-white/80 group-hover:text-brand-pink transition-colors">
                      <span className="text-sm font-medium">Saiba mais</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <Link href="/facial" className="btn-primary">
            Ver Todos os Tratamentos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
