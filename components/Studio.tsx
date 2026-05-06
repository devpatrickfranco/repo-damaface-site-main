'use client';

import { ArrowRight, Smartphone, Scan, LineChart, Gift } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Studio = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    animatedElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: <Scan className="w-6 h-6" />,
      title: 'Análise Facial IA',
      description: 'Diagnóstico inteligente que avalia simetria, terços faciais e textura da pele.'
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Índice de Harmonia',
      description: 'Acompanhe sua pontuação de beleza e evolução clínica mês a mês.'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Plano Digital',
      description: 'Seu roteiro de tratamentos e cuidados personalizados na palma da mão.'
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Clube de Vantagens',
      description: 'Ganhe pontos cuidando de você e troque por procedimentos exclusivos.'
    }
  ];

  const handleStudioClick = () => {
    window.open('https://studio.damaface.com.br/', '_blank');
  };

  return (
    <section ref={sectionRef} className="section-padding bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-pink/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Mobile Preview Column */}
          <div className="order-2 lg:order-1 animate-on-scroll">
            <div className="relative mx-auto max-w-[280px] sm:max-w-[320px]">
              {/* Fake Mobile Mockup */}
              <div className="relative border-[8px] border-gray-800 rounded-[3rem] overflow-hidden bg-gray-900 shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="App interface" 
                  className="w-full h-[500px] object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                  <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs text-gray-300">Índice de Harmonia</span>
                       <span className="text-brand-pink font-bold">8.4</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-brand-pink h-full w-[84%]" />
                    </div>
                  </div>
                  <div className="w-full bg-brand-pink text-white py-3 rounded-xl text-center text-sm font-bold">
                    Planejamento Facial
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-gray-800 shadow-xl animate-bounce">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink">
                       <Scan className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-400">Scan IA Ativo</p>
                       <p className="text-white text-xs font-bold">Symmetry Analysis</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="order-1 lg:order-2 animate-on-scroll">
            <div className="mb-0 sm:mb-8">
              <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-brand-pink/20">
                Experiência B2C para Pacientes
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
                Damaface Studio: 
                <span className="block text-brand-pink mt-2">Sua Clínica Digital</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Tenha sua jornada de beleza na palma da mão. Com o Damaface Studio, 
                você realiza sua própria análise facial por IA, acompanha sua evolução 
                mensal e acessa seu plano personalizado a qualquer momento.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                {steps.map((step) => (
                  <div key={step.title} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-brand-pink group-hover:border-brand-pink/50 transition-colors">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 group-hover:text-brand-pink transition-colors">{step.title}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleStudioClick}
                  className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-pink/25 flex items-center gap-2 justify-center group"
                >
                  <span>Iniciar Minha Análise</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={handleStudioClick}
                  className="btn-secondary py-4 px-10"
                >
                  Conhecer o App
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Studio;
