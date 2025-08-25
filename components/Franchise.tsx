'use client';

import { ArrowRight, Users, TrendingUp, Award, MapPin } from 'lucide-react';
const Franchise = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Suporte Completo',
      description: 'Treinamento, marketing e suporte operacional contínuo'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Mercado em Crescimento',
      description: 'Segmento de estética com alta demanda e rentabilidade'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Marca Consolidada',
      description: 'Reconhecimento no mercado e credibilidade estabelecida'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Territórios Disponíveis',
      description: 'Oportunidades em diversas regiões do país'
    }
  ];

  const handleFranchiseClick = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Tenho interesse em ser franqueado DamaFace.', '_blank');
  };

  return (
      <section
          className="section-padding bg-gradient-to-br from-gray-900/90 to-gray-800/70 relative overflow-hidden"
          style={{
            backgroundImage: 'url("/recepção clinic.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
      >
        {/* Overlay escuro */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.7, pointerEvents: 'none', zIndex: 1 }}
        />
  <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-on-scroll">
            <div className="mb-8">
              <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Oportunidade de Negócio
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
                Seja um Franqueado
                <span className="block text-brand-pink">DamaFace</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Faça parte da rede de clínicas de estética que mais cresce no Brasil. 
                Oferecemos um modelo de negócio comprovado, com alta rentabilidade 
                e suporte completo para seu sucesso.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="text-2xl font-bold text-brand-pink mb-1">50+</div>
                <div className="text-sm text-gray-400">Franquias Ativas</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                <div className="text-2xl font-bold text-brand-pink mb-1">ROI 18%</div>
                <div className="text-sm text-gray-400">Retorno Médio</div>
              </div>
            </div>
 
            <button
              onClick={handleFranchiseClick}
              className="btn-primary group mb-8"
            >
              <span>Quero ser Franqueado</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Contact Info */}
            <div className="text-sm text-gray-400">
              <p>📞 Central de Franquias: (11) 99999-9999</p>
              <p>📧 franquias@damaface.com.br</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="animate-on-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="card-dark text-center group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-brand-pink mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-pink transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Investment Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-brand-pink/10 to-purple-500/10 rounded-xl border border-brand-pink/20">
              <h3 className="text-xl font-semibold text-white mb-3">Investimento</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">Taxa de Franquia: <span className="text-brand-pink font-semibold">R$ 45.000</span></p>
                <p className="text-gray-300">Capital de Giro: <span className="text-brand-pink font-semibold">R$ 80.000</span></p>
                <p className="text-gray-300">Investimento Total: <span className="text-brand-pink font-semibold">a partir de R$ 150.000</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Franchise;
