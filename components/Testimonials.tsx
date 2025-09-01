'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { CtaButtonWhatsapp } from './CtaButtonWhatsapp';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Marina Silva',
      age: 32,
      treatment: 'Botox + Preenchimento Labial',
      rating: 5,
      comment: 'Resultado incrível! Fiquei com uma aparência muito natural e rejuvenescida. A equipe da DamaFace é excepcional, me senti muito segura durante todo o procedimento.',
      image: '/images/testimonials/depoimento-1.png',
    },
    {
      id: 2,
      name: 'Carla Santos',
      age: 28,
      treatment: 'Bioestimulador de Colágeno',
      rating: 5,
      comment: 'Melhor investimento que já fiz! Minha pele ficou mais firme e luminosa. O atendimento personalizado e o cuidado com cada detalhe fazem toda a diferença.',
      image: '/images/testimonials/depoimento-2.png',
    },
    {
      id: 3,
      name: 'Ana Paula',
      age: 35,
      treatment: 'Fios de Sustentação',
      rating: 5,
      comment: 'Efeito lifting incrível sem cirurgia! Recuperei a firmeza do rosto de forma natural. Indico a DamaFace para todas as minhas amigas.',
      image: '/images/testimonials/depoimento-3.png',
    },
    {
      id: 4,
      name: 'Juliana Costa',
      age: 29,
      treatment: 'Skinbooster + Peeling',
      rating: 5,
      comment: 'Minha pele nunca esteve tão hidratada e luminosa! O resultado superou todas as minhas expectativas. Profissionais extremamente competentes.',
      image: '/images/testimonials/depoimento-4.png',
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://typebot.damaface.com.br/agendar Vi os depoimentos e gostaria de saber mais sobre os tratamentos.', '_blank');
  };

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900/80 to-black/20">
      <div className="container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">O que nossos</span>
            <span className="block text-brand-pink">Clientes dizem</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Histórias reais de transformação e satisfação dos nossos clientes
          </p>
        </div>

        {/* Main Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="card-dark p-8 md:p-12 relative overflow-hidden animate-on-scroll">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Client Info */}
              <div className="text-center md:text-left">
                <div
                  className="w-20 h-20 rounded-full bg-cover bg-center mx-auto md:mx-0 mb-4 border-3 border-brand-pink/50"
                  style={{ backgroundImage: `url("${testimonials[currentSlide].image}")` }}
                />
                <h3 className="text-xl font-semibold text-white mb-1">
                  {testimonials[currentSlide].name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {testimonials[currentSlide].age} anos
                </p>
                <p className="text-brand-pink text-sm font-medium">
                  {testimonials[currentSlide].treatment}
                </p>
              </div>

              {/* Testimonial Content */}
              <div className="md:col-span-2">
                <Quote className="w-8 h-8 text-brand-pink/50 mb-4" />
                
                {/* Stars */}
                <div className="flex justify-center md:justify-start mb-4 space-x-1">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-brand-pink fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                  "{testimonials[currentSlide].comment}"
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-800">
              <button
                onClick={prevSlide}
                className="p-2 text-gray-400 hover:text-brand-pink transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-brand-pink' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 text-gray-400 hover:text-brand-pink transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-on-scroll">
          <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-brand-pink mb-2">98%</div>
            <div className="text-gray-400 text-sm">Taxa de Satisfação</div>
          </div>
          <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-brand-pink mb-2">1.2M</div>
            <div className="text-gray-400 text-sm">Clientes Atendidos</div>
          </div>
          <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-brand-pink mb-2">4.9/5</div>
            <div className="text-gray-400 text-sm">Avaliação Média</div>
          </div>
          <div className="text-center p-6 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-3xl font-bold text-brand-pink mb-2">90%</div>
            <div className="text-gray-400 text-sm">Clientes Retornam</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6 text-center mt-12 animate-on-scroll">
        <CtaButtonWhatsapp className='mt-12'/>
      </div>
    </section>
  );
};

export default Testimonials;
