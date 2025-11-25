import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Contact from "@/components/Contact"
import { ArrowRight, Star, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FacialPage() {
const facialProcedures = [
  {
    id: "toxina-botulinica",
    name: "Toxina Botulínica",
    description: "Suaviza rugas de expressão com resultados naturais e duradouros",
    price: "A partir de R$ 349,00",
    image: "/images/procedimentos/botox/gerais/botox-1.png",
    rating: 4.9,
    duration: "20-30 min",
    sessions: "1 sessão",
  },
  {
    id: "harmonizacao-facial",
    name: "Harmonização Facial",
    description: "Redefine os contornos do rosto, promovendo equilíbrio e rejuvenescimento natural",
    price: "Sob consulta",
    image: "/images/procedimentos/full-face/gerais/full-face-1.png",
    rating: 5,
    duration: "60-90 min",
    sessions: "Variável",
  },
  {
    id: "bioestimulador-de-colageno",
    name: "Bioestimulador de Colágeno",
    description: "Estimula a produção natural de colágeno, rejuvenescendo a pele",
    price: "A partir de R$ 1.799,00",
    image: "/images/procedimentos/bioestimulador/gerais/bioestimulador-1.jpeg",
    rating: 5,
    duration: "45-60 min",
    sessions: "Variável",
  },
  {
    id: "preenchimento-facial",
    name: "Preenchimento Facial",
    description: "Restaura volume e define contornos com ácido hialurônico",
    price: "A partir de R$ 990,00",
    image: "/images/procedimentos/preenchimento/facial-2.png",
    rating: 4.9,
    duration: "30-45 min",
    sessions: "1 sessão",
  },
  {
    id: "fios-de-sustentacao",
    name: "Fios de Sustentação",
    description: "Lifting facial sem cirurgia com efeito lifting imediato",
    price: "A partir de R$ 349,00",
    image: "/lifting-facial-threads.png",
    rating: 4.9,
    duration: "45-60 min",
    sessions: "1 sessão",
  },
  {
    id: "skinbooster",
    name: "Skinbooster",
    description: "Hidratação profunda e melhora da qualidade da pele",
    price: "A partir de R$ 990,00",
    image: "/images/procedimentos/skinbooster/gerais/skinbooster-1.png",
    rating: 4.8,
    duration: "30-45 min",
    sessions: "1 sessão",
  },
  {
    id: "lipo-de-papada",
    name: "Lipo de Papada",
    description: "Reduz a gordura localizada abaixo do queixo, afinando o contorno facial",
    price: "A partir de R$ 489,00",
    image: "/images/procedimentos/lipo-de-papada/gerais/lipo-de-papada-1.png",
    rating: 4.7,
    duration: "40-60 min",
    sessions: "1 sessão",
  },
  {
    id: "peeling-quimico",
    name: "Peeling Químico",
    description: "Promove a renovação da pele, clareando manchas e suavizando linhas finas",
    price: "A partir de R$ 389,00",
    image: "images/procedimentos/peeling-quimico/gerais/peeling-quimico-1.png",
    rating: 4.7,
    duration: "30-45 min",
    sessions: "1 sessão",
  },
];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/categorias/facial-1.png"
            alt="Tratamentos Faciais"
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
                <span className="text-brand-pink">Faciais</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Rejuvenescimento, harmonização e cuidados especializados para o rosto com tecnologia de ponta e
                resultados naturais
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#procedimentos" className="btn-primary group">
                  <span>Ver Procedimentos</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://typebot.damaface.com.br/agendar"
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
              <span className="text-white">Nossos</span> <span className="text-brand-pink">Procedimentos Faciais</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Descubra nossa gama completa de tratamentos faciais, desenvolvidos para realçar sua beleza natural
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facialProcedures.map((procedure, index) => (
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
                      <span className="text-sm font-medium">{procedure.rating}/5</span>
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
