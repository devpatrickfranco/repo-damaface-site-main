'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const faqs = [
    {
      question: 'Quanto tempo dura o efeito do botox?',
      answer: 'O efeito do botox dura em média de 4 a 6 meses, podendo variar de acordo com o metabolismo de cada pessoa, área aplicada e quantidade utilizada. Após esse período, o movimento muscular retorna gradualmente ao normal.'
    },
    {
      question: 'O preenchimento labial fica natural?',
      answer: 'Sim, quando realizado por profissionais experientes e com a quantidade adequada, o preenchimento labial fica completamente natural. Utilizamos técnicas modernas que respeitam a anatomia e harmonia facial de cada paciente.'
    },
    {
      question: 'Quais são os cuidados pós-procedimento?',
      answer: 'Os cuidados incluem: evitar exposição solar direta, não fazer exercícios físicos intensos nas primeiras 24h, aplicar compressas frias se necessário, não massagear a região tratada e seguir as orientações específicas do profissional.'
    },
    {
      question: 'Como escolher o melhor tratamento para mim?',
      answer: 'O ideal é agendar uma avaliação gratuita com nossa equipe. Durante a consulta, analisamos suas características individuais, objetivos e indicamos os procedimentos mais adequados para alcançar os resultados desejados.'
    },
    {
      question: 'Os procedimentos são seguros?',
      answer: 'Sim, todos os nossos procedimentos são realizados por profissionais certificados, utilizando produtos aprovados pela ANVISA e seguindo rigorosos protocolos de segurança. Nossa clínica possui todas as licenças e certificações necessárias.'
    },
    {
      question: 'Qual é o tempo de recuperação dos tratamentos?',
      answer: 'A maioria dos nossos tratamentos não invasivos permite retorno imediato às atividades normais. Alguns procedimentos podem apresentar leve vermelhidão ou inchaço por 24-48h, mas nada que impeça a rotina diária.'
    },
    {
      question: 'Vocês oferecem algum tipo de garantia?',
      answer: 'Sim, oferecemos garantia de satisfação em todos os nossos procedimentos. Caso não fique satisfeito com o resultado, faremos os ajustes necessários sem custo adicional, respeitando os prazos técnicos de cada tratamento.'
    },
    {
      question: 'Como funciona o agendamento?',
      answer: 'O agendamento pode ser feito pelo WhatsApp, telefone ou presencialmente. Oferecemos avaliação gratuita para novos clientes e flexibilidade de horários, incluindo atendimentos aos sábados.'
    }
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="section-padding bg-gray-900/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Perguntas</span>{' '}
            <span className="text-brand-pink">Frequentes</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos tratamentos e procedimentos
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            
            return (
              <div
                key={index}
                className="card-dark animate-on-scroll"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left flex items-center justify-between p-6 focus:outline-none group"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-brand-pink transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 text-brand-pink">
                    {isOpen ? (
                      <Minus className="w-5 h-5 transition-transform" />
                    ) : (
                      <Plus className="w-5 h-5 transition-transform" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed border-t border-gray-800 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-gray-300 mb-6">
            Não encontrou a resposta que procura?
          </p>
          <button
            onClick={() => window.open('https://typebot.damaface.com.br/agendar Tenho uma dúvida sobre os tratamentos.', '_blank')}
            className="btn-primary"
          >
            Fale conosco no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
