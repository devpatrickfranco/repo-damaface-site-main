import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Contact from "@/components/Contact"
import { ArrowRight, Star, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NaoInvasivosPage() {
const nonInvasiveProcedures = [
    {
      id: "ultraformer",
      name: "Ultraformer",
      description: "Tecnologia de ultrassom micro e macrofocado para efeito lifting e tratamento da flacidez facial e corporal",
      price: "A partir de R$ 1.200",
      image: "/images/categorias/não-invasivo-1.png",
      rating: 4.8,
      duration: "30-60 min",
      sessions: "1-2 sessões",
    },
    {
      id: "lavieen",
      name: "Lavieen",
      description: "Laser que promove rejuvenescimento, melhora textura da pele, manchas e poros dilatados",
      price: "A partir de R$ 1.000",
      image: "/images/procedimentos/.nao-invasivo/lavieen/gerais/laser-lavieen-1.png",
      rating: 4.7,
      duration: "30-45 min",
      sessions: "2-4 sessões",
    },
    {
      id: "criolipolise",
      name: "Criolipólise",
      description: "Redução de gordura localizada através do congelamento das células adiposas",
      price: "A partir de R$ 800",
      image: "/images/procedimentos/.nao-invasivo/criolipolise/gerais/criolipolis-1.png",
      rating: 4.8,
      duration: "60-90 min",
      sessions: "1-3 sessões",
    },
    {
      id: "laser-co2",
      name: "Laser CO2 Fracionado",
      description: "Rejuvenesce a pele, reduz rugas, cicatrizes e melhora a textura",
      price: "A partir de R$ 800",
      image: "/images/procedimentos/.nao-invasivo/laser-co2/gerais/laser-co2-1.png",
      rating: 4.7,
      duration: "30-45 min",
      sessions: "3-5 sessões",
    },
    {
      id: "depilacao-a-laser",
      name: "Depilação a Laser",
      description: "Elimina os pelos de forma progressiva e duradoura, deixando a pele lisa e macia",
      price: "A partir de R$ 150",
      image: "/images/procedimentos/.nao-invasivo/depilacao-laser/gerais/depilacao-laser-1.png",
      rating: 4.9,
      duration: "20-40 min",
      sessions: "6-10 sessões",
    },
    {
      id: "limpeza-de-pele",
      name: "Limpeza de Pele Profunda",
      description: "Remove impurezas, cravos e células mortas, deixando a pele renovada",
      price: "A partir de R$ 200",
      image: "/images/procedimentos/.nao-invasivo/limpeza-de-pele/gerais/limpeza-de-pele-1.png",
      rating: 4.9,
      duration: "60-90 min",
      sessions: "Mensal",
    },
  ];


  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/categorias/não-invasivo-1.png"
            alt="Tratamentos Não Invasivos"
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
                <span className="text-brand-pink">Não Invasivos</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tratamentos suaves e eficazes sem necessidade de procedimentos invasivos, com resultados naturais e
                recuperação rápida
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#procedimentos" className="btn-primary group">
                  <span>Ver Procedimentos</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma avaliação para tratamentos não invasivos."
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
              <span className="text-brand-pink">Procedimentos Não Invasivos</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Descubra nossa gama completa de tratamentos não invasivos para cuidados da pele e bem-estar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nonInvasiveProcedures.map((procedure, index) => (
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
