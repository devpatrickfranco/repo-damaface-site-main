import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-damaface.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center lg:text-left pt-32 lg:pt-40">
        <div className="max-w-4xl mx-auto lg:mx-0">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gradient">Resultados Naturais</span>
              <br />
              <span className="text-white">com Especialistas em</span>
              <br />
              <span className="text-brand-pink">Estética Facial</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transforme sua beleza natural com tratamentos personalizados e tecnologia de ponta.
              Agende sua avaliação gratuita com nossa equipe de especialistas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://typebot-typebot-viewer.i4khe5.easypanel.host/agendamento"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group text-lg flex items-center justify-center space-x-2"
              >
                <span>Agende sua Avaliação no WhatsApp</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <button className="btn-secondary text-lg">
                Conheça Nossos Tratamentos
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-800/50">
            <div className="text-center lg:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-brand-pink mb-2">1.2M </div>
              <div className="text-gray-400">Clientes Satisfeitos</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-brand-pink mb-2">5+</div>
              <div className="text-gray-400">Anos de Experiência</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-brand-pink mb-2">98%</div>
              <div className="text-gray-400">Taxa de Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
