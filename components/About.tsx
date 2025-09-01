'use client';

import { Award, Users, Clock, Shield } from 'lucide-react';
import { CtaButtonWhatsapp } from './CtaButtonWhatsapp';

const About = () => {
  const team = [
    {
      name: 'Fernanda Valim',
      role: 'Owner',
      speciality: 'Administração e Gestão de Franquias',
      image: '/images/about/Fernanda-Valim.png',
      description: 'Especialista em gestão de empresas e finanças com 15 anos de experiência'
    },
    {
      name: 'Wellison Santos',
      role: 'CEO',
      speciality: 'Expansão e Desenvolvimento de Franquias',
      image: '/images/about/Wellison-Santos.png',
      description: 'Especialista em expansão de negócios com foco em franquias, atuando há 10 anos no setor'
    },
    
  ];

  const differentials = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excelência Técnica',
      description: 'Profissionais certificados e em constante atualização'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Atendimento Personalizado',
      description: 'Cada cliente recebe um plano de tratamento exclusivo'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Resultados Duradouros',
      description: 'Técnicas avançadas com efeitos prolongados e naturais'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Segurança Garantida',
      description: 'Protocolos rigorosos e produtos de qualidade internacional'
    }
  ];

  return (
    <section id='about' className="section-padding bg-gray-900/20">
      <div className="container">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gradient">Sobre a</span>
              <span className="block text-brand-pink">DamaFace</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Com mais de 5 anos de experiência no mercado de estética, 
              a DamaFace se consolidou como referência em tratamentos faciais 
              e corporais, oferecendo resultados naturais e duradouros.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Nossa missão é realçar a beleza natural de cada cliente através 
              de procedimentos seguros, personalizados e executados por uma 
              equipe altamente qualificada. Utilizamos apenas produtos e 
              tecnologias de última geração, garantindo os melhores resultados.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-brand-pink mb-2">1.2M</div>
                <div className="text-gray-400 text-sm">Clientes Atendidos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-brand-pink mb-2">5+</div>
                <div className="text-gray-400 text-sm">Anos no Mercado</div>
              </div>
            </div>
          </div>

          <div className="animate-on-scroll">
            <div className="relative">
              <div
                className="w-full h-96 bg-cover bg-center rounded-2xl shadow-2xl"
                style={{
                  backgroundImage: 'url("/images/about/img-evento.jpeg")'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Nossos</span>{' '}
              <span className="text-brand-pink">Fundadores</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Profissionais especializados e certificados, dedicados a oferecer o melhor atendimento
            </p>
          </div>

            <div className="flex flex-wrap justify-center items-stretch gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="card-dark flex flex-col text-center group animate-on-scroll justify-between items-center max-w-sm w-full p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-36 h-36 mx-auto mb-6">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center border-4 border-brand-pink/50 group-hover:border-brand-pink transition-colors"
                    style={{ backgroundImage: `url("${member.image}")` }}
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-brand-pink transition-colors">
                  {member.name}
                </h3>
                <p className="text-brand-pink text-base font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-base mb-4">
                  {member.speciality}
                </p>
                <p className="text-gray-300 text-base leading-relaxed break-words whitespace-pre-line">
                  {member.description}
                </p>
              </div>
            ))}
            </div>
        </div>

        {/* Differentials */}
        <div>
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Nossos</span>{' '}
              <span className="text-brand-pink">Diferenciais</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              O que nos torna únicos no mercado de estética
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentials.map((item, index) => (
              <div
                key={item.title}
                className="text-center animate-on-scroll group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-brand-pink mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-brand-pink transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6 text-center mt-12 animate-on-scroll">
        <CtaButtonWhatsapp className='mt-12'/>
      </div>
    </section>
  );
};

export default About;
