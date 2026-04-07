'use client';

import { ArrowRight, Brain, Target, Sparkles, CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Copiloto = () => {
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

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Análise Facial Profissional',
      description: 'Visão computacional avançada que mapeia cada detalhe anatômico para uma análise técnica sem precedentes.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Precisão Matemática',
      description: 'Cálculos exatos para planos de tratamento que seguem os mais rigorosos padrões clínicos internacionais.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Simulação de Resultados',
      description: 'Gere visualizações realistas de antes e depois que aumentam drasticamente a taxa de conversão de pacientes.'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Plano de Aplicação IA',
      description: 'Receba um guia detalhado passo a passo de como o profissional deve executar o procedimento clínico.'
    }
  ];

  const handleCopilotoClick = () => {
    window.open('https://copiloto.damaface.com.br/', '_blank');
  };

  return (
    <section ref={sectionRef} className="section-padding bg-black relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-on-scroll">
            <div className="mb-8">
              <span className="inline-block bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-500/20">
                Exclusivo para Profissionais HOF
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
                Copiloto DamaFace: 
                <span className="block text-emerald-500 mt-2">Inteligência Facial B2B</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                A ferramenta de HOF mais avançada do mercado. Eleve o padrão das suas consultas 
                com IA de última geração, garantindo que nenhum detalhe clínico passe despercebido 
                pela visão computacional de alta fidelidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <button
                  onClick={handleCopilotoClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 group w-full sm:w-auto justify-center"
                >
                  <span>Acessar Copiloto</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-900/50 rounded-full border border-gray-800">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-emerald-900 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                        IA
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    <strong className="text-emerald-500">500+</strong> especialistas ativos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Features Grid */}
          <div className="animate-on-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-gray-900/60 group"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Disclaimer B2B vs B2C */}
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20">
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold">
                  B2B
                </div>
                <div>
                  <h4 className="text-white font-semibold">Transforme sua Clínica</h4>
                  <p className="text-gray-400 text-sm">O Copiloto foi desenhado para profissionais, focando em diagnóstico e planejamento técnico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Copiloto;
