import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Contact from "@/components/Contact"
import { ArrowRight, Star, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CorporalPage() {
const corporalProcedures = [ 
    {
      id: "bioestimulador-de-colageno-corporal",
      name: "Bioestimulador de Colágeno Corporal",
      description: "Estimula a produção natural de colágeno, promovendo firmeza e melhora da qualidade da pele corporal",
      price: "A partir de R$ 900",
      image: "/images/procedimentos/.corporal/bioestimulador-coporal/gerais/bioestimulador-coporal-1.jpg",
      rating: 4.8,
      duration: "45-60 min",
      sessions: "2-3 sessões",
    },
    {
      id: "fios-de-sustentacao-corporal",
      name: "Fios de Sustentação Corporal",
      description: "Promove efeito lifting em regiões do corpo com flacidez sem necessidade de cirurgia",
      price: "A partir de R$ 1.500",
      image: "/images/procedimentos/.corporal/fios-corporal/gerais/fios-corporal-1.png",
      rating: 4.7,
      duration: "60-90 min",
      sessions: "1 sessão",
    },
    {
      id: "peim",
      name: "PEIM",
      description: "Tratamento injetável para eliminar vasinhos e microvarizes corporais",
      price: "A partir de R$ 199,00",
      image: "/images/procedimentos/peim/gerais/peim-1.png",
      rating: 4.6,
      duration: "30-45 min",
      sessions: "1-3 sessões",
    },
    {
      id: "preenchimento-de-gluteo",
      name: "Preenchimento de Glúteo",
      description: "Proporciona maior volume, contorno e firmeza aos glúteos com ácido hialurônico ou bioestimuladores",
      price: "A partir de R$ 2.500",
      image: "/images/procedimentos/.corporal/preenchimento-de-gluteo/gerais/preenchimento-de-gluteo-1.png",
      rating: 4.9,
      duration: "60-90 min",
      sessions: "1 sessão",
    },
    {
      id: "enzimas-para-gordura-localizada",
      name: "Enzimas para Gordura Localizada",
      description: "Aplicação de enzimas que auxiliam na quebra da gordura localizada em regiões específicas",
      price: "A partir de R$ 500",
      image: "/images/procedimentos/.corporal/gordura-localizada/gerais/gordura-localizada-1.jpg",
      rating: 4.7,
      duration: "30-45 min",
      sessions: "4-8 sessões",
    },
    {
      id: "intradermoterapia",
      name: "Intradermoterapia",
      description: "Técnica de injeções intradérmicas para tratamento de gordura localizada, celulite e flacidez",
      price: "A partir de R$ 450",
      image: "/images/procedimentos/.corporal/intradermoterapia/gerais/intradermaterapia-1.jpg",
      rating: 4.7,
      duration: "30-45 min",
      sessions: "4-6 sessões",
    },
    {
      id: "massagem-relaxante",
      name: "Massagem Relaxante",
      description: "Alivia tensões musculares, promove bem-estar e relaxamento físico e mental",
      price: "A partir de R$ 200",
      image: "/images/procedimentos/.corporal/massagem-relaxante/gerais/massagem-relaxante-1.png",
      rating: 4.9,
      duration: "60 min",
      sessions: "Sessões avulsas",
    },
    {
      id: "massagem-modeladora",
      name: "Massagem Modeladora",
      description: "Modela o corpo, reduz medidas e melhora o contorno corporal",
      price: "A partir de R$ 350",
      image: "/images/procedimentos/.corporal/massagem-modeladora/gerais/massagem-modeladora-1.png",
      rating: 4.7,
      duration: "60-75 min",
      sessions: "8-10 sessões",
    },
    {
      id: "pump-up",
      name: "Pump Up",
      description: "Técnica não invasiva para levantar e modelar os glúteos através de sucção a vácuo",
      price: "A partir de R$ 600",
      image: "/images/procedimentos/.corporal/pump-up/gerais/pump-up-1.png",
      rating: 4.6,
      duration: "40-60 min",
      sessions: "6-10 sessões",
    },
  ];


  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="images/categorias/corporal-1.png"
            alt="Tratamentos Corporais"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20"></div>
        </div>

        <div className="relative z-10 container text-center">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-up">
              <span className="inline-block bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Especialidade
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Tratamentos</span>
                <br />
                <span className="text-brand-pink">Corporais</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Modelagem corporal, redução de medidas e tratamentos especializados para o corpo com tecnologia avançada
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#procedimentos" className="btn-primary group">
                  <span>Ver Procedimentos</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma avaliação para tratamentos corporais."
                  target="_blank"
                  className="btn-secondary"
                  rel="noreferrer"
                >
                  Agendar Avaliação
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section id="procedimentos" className="section-padding bg-gray-900/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Nossos</span>{" "}
              <span className="text-brand-pink">Procedimentos Corporais</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Descubra nossa gama completa de tratamentos corporais para modelagem, redução de medidas e bem-estar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corporalProcedures.map((procedure, index) => (
            <Link
                key={procedure.id}
                href={`/procedimentos/${procedure.id}`}
                className="card-dark group cursor-pointer animate-on-scroll block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={procedure.image || "/placeholder.svg"}
                    alt={procedure.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors">
                      {procedure.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-brand-pink">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{procedure.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">{procedure.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{procedure.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{procedure.sessions}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-lg font-semibold text-brand-pink">{procedure.price}</span>
                    <span className="flex items-center space-x-1 text-white/80 group-hover:text-brand-pink transition-colors">
                      <span className="text-sm font-medium">Saiba mais</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link> 
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Contact />

      <Footer />
    </>
  )
}
