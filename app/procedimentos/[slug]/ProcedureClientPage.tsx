"use client"

 import Image from "next/image"
 import Header from "@/components/Header"
 import Footer from "@/components/Footer"
 import Contact from "@/components/Contact"
 import { ArrowRight, CheckCircle, Clock, Users, Star, Shield, Award, Heart } from "lucide-react"

 interface ProcedureClientPageProps {
  procedure: any;
}



export default function ProcedureClientPage({ procedure }: ProcedureClientPageProps) {

  
    const pricingPackages: Array<{
      title: string;
      price: string;
      oldPrice?: string;
      features: string[];
      popular?: boolean;
    }> = procedure.pricingPackages || [
      {
        title: "Sessão Avulsa",
        price: "R$ 800",
        features: [
          "Avaliação completa",
          "1 sessão de bioestimulador",
          "Acompanhamento pós-procedimento",
          "Orientações personalizadas"
        ]
      },
      {
        title: "Pacote Completo",
        price: "R$ 2.100",
        oldPrice: "R$ 2.400",
        features: [
          "3 sessões de bioestimulador",
          "Avaliação e acompanhamento",
          "Desconto de 12,5%",
          "Garantia de resultados",
          "Retornos inclusos"
        ],
        popular: true
      }
    ];

  const handleWhatsAppClick = () => {
    window.open(
      `https://typebot.damaface.com.br/agendar`,
      "_blank",
    )
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={procedure.heroImage || "/placeholder.svg"}
            alt={procedure.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20"></div>
        </div>

        <div className="relative z-10 container text-center lg:text-left">
          <div className="max-w-4xl mx-auto lg:mx-0">
            <div className="animate-fade-up">
              <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {procedure.category}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Transforme sua autoestima</span>
                <br />
                <span className="text-brand-pink">{procedure.title}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {procedure.subtitle}
              </p>

              <button
                onClick={handleWhatsAppClick}
                className="btn-primary group text-lg flex items-center justify-center lg:justify-start space-x-2 mx-auto lg:mx-0 w-fit"
              >
                <span>Agende sua Avaliação</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-12 border-t border-gray-800/50">
              <div className="text-center lg:text-left">
                <Clock className="w-6 h-6 text-brand-pink mb-2 mx-auto lg:mx-0" />
                <div className="text-sm text-gray-400">Duração</div>
                <div className="text-white font-semibold">{procedure.duration}</div>
              </div>
              <div className="text-center lg:text-left">
                <Users className="w-6 h-6 text-brand-pink mb-2 mx-auto lg:mx-0" />
                <div className="text-sm text-gray-400">Sessões</div>
                <div className="text-white font-semibold">{procedure.sessions}</div>
              </div>
              <div className="text-center lg:text-left">
                <Award className="w-6 h-6 text-brand-pink mb-2 mx-auto lg:mx-0" />
                <div className="text-sm text-gray-400">Resultados</div>
                <div className="text-white font-semibold">{procedure.results}</div>
              </div>
              <div className="text-center lg:text-left">
                <Heart className="w-6 h-6 text-brand-pink mb-2 mx-auto lg:mx-0" />
                <div className="text-sm text-gray-400">Preço</div>
                <div className="text-white font-semibold">{procedure.price}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Procedure */}
      <section className="section-padding bg-gray-900/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">{procedure.whatIs.title}</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{procedure.whatIs.content}</p>

                <div className="space-y-4">
                  <div className="card-dark">
                    <h3 className="text-brand-pink font-semibold mb-2">Tecnologia Utilizada</h3>
                    <p className="text-gray-300">{procedure.whatIs.technology}</p>
                  </div>

                  <div className="card-dark">
                    <h3 className="text-brand-pink font-semibold mb-2">Objetivo do Tratamento</h3>
                    <p className="text-gray-300">{procedure.whatIs.objective}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/images/procedimentos/botox/gerais/botox-1.png"
                  alt="Procedimento"
                  width={600}
                  height={400}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Who is Indicated */}
      <section className="section-padding bg-black/40">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Para Quem é</span> <span className="text-brand-pink">Indicado?</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card-dark">
                <h3 className="text-xl font-bold text-brand-pink mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Perfil Ideal
                </h3>
                <ul className="space-y-3">
                  {procedure.forWho.ideal.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-dark">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Contraindicações
                </h3>
                <ul className="space-y-3">
                  {procedure.forWho.contraindications.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 border-2 border-red-400 rounded-full mt-0.5 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-gray-900/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Benefícios</span> <span className="text-brand-pink">Esperados</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {procedure.benefits.map((benefit: string, index: number) => (
                <div key={index} className="card-dark text-center">
                  <CheckCircle className="w-8 h-8 text-brand-pink mx-auto mb-4" />
                  <p className="text-white font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-padding bg-black/40">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Como Funciona o</span> <span className="text-brand-pink">Procedimento?</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Passo a Passo</h3>
                <div className="space-y-6">
                  {procedure.howWorks.steps.map((step: any, index: number) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Cuidados Pós-Procedimento</h3>
                <div className="card-dark">
                  <ul className="space-y-3">
                    {procedure.howWorks.aftercare.map((care: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-brand-pink mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{care}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before and After */}
      <section className="section-padding bg-gray-900/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Resultados</span> <span className="text-brand-pink">Antes e Depois</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {procedure.beforeAfterImages.map((img: { src: string; alt?: string }, idx: number) => (
                  <div key={idx} className="card-dark">
                    <div className="relative mb-4">
                      <Image
                        src={img.src}
                        alt={img.alt || `Resultado ${idx + 1}`}
                        width={400}
                        height={300}
                        className="rounded-lg w-full"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        Antes/Depois
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-black/40">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Depoimentos de</span> <span className="text-brand-pink">Clientes</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {procedure.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="card-dark">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.age} anos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-gray-900/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              <span className="text-white">Preços e</span> <span className="text-brand-pink">Pacotes</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pricingPackages.map((pkg: {
                  title: string;
                  price: string;
                  oldPrice?: string;
                  features: string[];
                  popular?: boolean;
                }, idx: number) => (
                  <div
                    key={idx}
                    className={`card-dark${pkg.popular ? ' border-2 border-brand-pink relative' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-pink text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-brand-pink mb-4">{pkg.title}</h3>
                    <div className="text-4xl font-bold text-white mb-2">{pkg.price}</div>
                    {pkg.oldPrice && (
                      <div className="text-gray-400 line-through mb-4">{pkg.oldPrice}</div>
                    )}
                    <ul className="space-y-2 text-gray-300 mb-6">
                      {pkg.features.map((feature, fidx) => (
                        <li key={fidx}>• {feature}</li>
                      ))}
                    </ul>
                    <button onClick={handleWhatsAppClick} className="w-full btn-primary">
                      Agendar Avaliação
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Parcelamos em até 12x sem juros no cartão de crédito</p>
              <p className="text-gray-400 mb-4">Parcelamos em até 24x no boleto bancario</p>
              <p className="text-gray-400">Aceitamos PIX, dinheiro e todos os cartões</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}

      <Contact />
      <Footer />
    </>
  )
}
