"use client"

import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
 import Image from "next/image"
 import Header from "@/components/Header"
 import Footer from "@/components/Footer"
 import Contact from "@/components/Contact"
 import { ArrowRight, CheckCircle, Clock, Users, Star, Shield, Award, Heart } from "lucide-react"

interface ProcedureClientPageProps {
  params?: { slug: string }
}

const procedures: { [key: string]: any } = {
  "toxina-botulinica": {
    title: "Toxina Botulínica",
    subtitle: "Redução de Rugas e Linhas de Expressão",
    description: "Suaviza rugas e linhas de expressão, proporcionando uma aparência rejuvenescida e relaxada.",
    heroImage: '/images/procedimentos/botox/gerais/botox-2.png',
    category: "Facial",
    duration: "20-30 minutos",
    sessions: "1 sessão",
    results: "8-12 meses",
    price: "A partir de R$ 349",

    whatIs: {
      title: "O que é a Toxina Botulínica?",
      content:
        "A toxina botulínica, popularmente conhecida como Botox, é uma substância utilizada para suavizar rugas e linhas de expressão. Ela age relaxando os músculos faciais, proporcionando uma aparência mais jovem e descansada.",
      technology: "Utilizamos toxina botulínica de alta qualidade, garantindo segurança e eficácia no tratamento.",
      objective:
        "Reduzir rugas e linhas de expressão, prevenir o envelhecimento precoce e proporcionar uma aparência mais jovem e relaxada.",
    },

    forWho: {
      ideal: [
        "Pessoas com rugas e linhas de expressão",
        "Quem busca uma aparência mais jovem e descansada",
        "Pacientes com bruxismo",
        "Pessoas com sudorese excessiva",
        "Quem deseja prevenir o envelhecimento precoce",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças neuromusculares",
        "Alergia à toxina botulínica",
        "Uso de antibióticos aminoglicosídeos",
      ],
    },

    benefits: [
      "Redução de rugas e linhas de expressão",
      "Prevenção do envelhecimento precoce",
      "Aparência mais jovem e descansada",
      "Tratamento rápido e eficaz",
      "Resultados visíveis em poucos dias",
      "Melhora da autoestima",
      "Alívio do bruxismo",
      "Redução da sudorese excessiva",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da face e identificação das áreas a serem tratadas.",
        },
        {
          title: "Preparação",
          description: "Limpeza da pele e aplicação de anestésico tópico para maior conforto.",
        },
        {
          title: "Aplicação",
          description: "Injeção precisa da toxina botulínica nos pontos estratégicos da face.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar massagear a área tratada por 24h",
        "Não fazer exercícios intensos por 24h",
        "Evitar exposição solar por 48h",
        "Não deitar por 4h após a aplicação",
        "Retorno em 15 dias para avaliação",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 35,
        text: "A toxina botulínica transformou meu rosto! As rugas sumiram e me sinto muito mais jovem.",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 40,
        text: "O tratamento com toxina botulínica foi rápido e eficaz. Recomendo a todos!",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "A toxina botulínica aliviou meu bruxismo e ainda me deixou com uma aparência mais jovem.",
        rating: 5,
      },
    ],
  },
  "harmonizacao-facial": {
    title: "Harmonização Facial",
    subtitle: "Realce sua Beleza Natural",
    description:
      "Conjunto de procedimentos estéticos que visam equilibrar e realçar os traços do rosto, proporcionando uma aparência mais harmoniosa e atraente.",
    heroImage: "/collagen-biostimulator-facial-treatment.png",
    category: "Facial",
    duration: "60-90 minutos",
    sessions: "Variável",
    results: "6-18 meses",
    price: "A partir de R$ 1.500",

    whatIs: {
      title: "O que é a Harmonização Facial?",
      content:
        "A harmonização facial é um conjunto de procedimentos estéticos que visam equilibrar e realçar os traços do rosto, proporcionando uma aparência mais harmoniosa e atraente. Ela pode incluir preenchimento com ácido hialurônico, toxina botulínica, bioestimuladores de colágeno, entre outros.",
      technology:
        "Utilizamos técnicas avançadas e produtos de alta qualidade para garantir resultados naturais e duradouros.",
      objective:
        "Equilibrar e realçar os traços do rosto, proporcionar uma aparência mais harmoniosa e atraente, e aumentar a autoestima do paciente.",
    },

    forWho: {
      ideal: [
        "Pessoas que desejam realçar sua beleza natural",
        "Quem busca um rosto mais harmonioso e equilibrado",
        "Pacientes com assimetrias faciais",
        "Pessoas que desejam aumentar a autoestima",
        "Quem busca resultados naturais e duradouros",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia aos componentes",
        "Uso de anticoagulantes",
      ],
    },

    benefits: [
      "Realce da beleza natural",
      "Rosto mais harmonioso e equilibrado",
      "Correção de assimetrias faciais",
      "Aumento da autoestima",
      "Resultados naturais e duradouros",
      "Procedimentos minimamente invasivos",
      "Recuperação rápida",
      "Melhora da qualidade da pele",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da face e definição do plano de tratamento personalizado.",
        },
        {
          title: "Planejamento",
          description: "Escolha dos procedimentos e produtos a serem utilizados.",
        },
        {
          title: "Aplicação",
          description: "Realização dos procedimentos com técnicas precisas e seguras.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar exposição solar por 48h",
        "Não fazer exercícios intensos por 24h",
        "Aplicar protetor solar diariamente",
        "Manter a pele hidratada",
        "Retorno em 15 dias para avaliação",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 42,
        text: "A harmonização facial transformou meu rosto! Me sinto muito mais confiante e feliz.",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 38,
        text: "O resultado da harmonização facial foi incrível! Recomendo a todos que desejam realçar sua beleza.",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "A harmonização facial me proporcionou um rosto mais harmonioso e equilibrado. Minha autoestima aumentou muito!",
        rating: 5,
      },
    ],
  },
  "bioestimulador-de-colageno": {
    title: "Bioestimulador de Colágeno",
    subtitle: "Rejuvenescimento Natural e Duradouro",
    description: "Estimula a produção natural de colágeno, rejuvenescendo a pele de forma gradual e natural.",
    heroImage: "/collagen-biostimulator-facial-treatment.png",
    category: "Facial",
    duration: "45-60 minutos",
    sessions: "2-3 sessões",
    results: "3-6 meses",
    price: "A partir de R$ 800",

    whatIs: {
      title: "O que é o Bioestimulador de Colágeno?",
      content:
        "O bioestimulador de colágeno é um tratamento revolucionário que utiliza substâncias biocompatíveis para estimular a produção natural de colágeno na pele. Diferente dos preenchimentos tradicionais, este procedimento promove o rejuvenescimento de dentro para fora, oferecendo resultados naturais e duradouros.",
      technology:
        "Utilizamos tecnologia de ponta com ácido poli-L-lático e hidroxiapatita de cálcio, substâncias totalmente absorvíveis pelo organismo.",
      objective:
        "Restaurar a firmeza, elasticidade e volume natural da pele, combatendo os sinais do envelhecimento de forma gradual e harmoniosa.",
    },

    forWho: {
      ideal: [
        "Pessoas a partir dos 30 anos com sinais de envelhecimento",
        "Quem busca resultados naturais e duradouros",
        "Pacientes com perda de volume facial",
        "Pessoas com flacidez leve a moderada",
        "Quem deseja prevenir o envelhecimento precoce",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia aos componentes",
        "Uso de anticoagulantes",
      ],
    },

    benefits: [
      "Estimulação natural do colágeno",
      "Resultados graduais e naturais",
      "Melhora da textura da pele",
      "Redução de rugas e linhas de expressão",
      "Restauração do volume facial",
      "Efeito lifting natural",
      "Durabilidade de até 2 anos",
      "Procedimento minimamente invasivo",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da pele e definição do plano de tratamento personalizado.",
        },
        {
          title: "Preparação",
          description: "Limpeza da pele e aplicação de anestésico tópico para maior conforto.",
        },
        {
          title: "Aplicação",
          description: "Injeção precisa do bioestimulador nos pontos estratégicos do rosto.",
        },
        {
          title: "Massagem",
          description: "Massagem suave para distribuição uniforme do produto.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar massagear a área tratada por 24h",
        "Não fazer exercícios intensos por 24h",
        "Evitar exposição solar por 48h",
        "Aplicar protetor solar diariamente",
        "Manter a pele hidratada",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 42,
        text: "Resultado incrível! Minha pele ficou mais firme e com aspecto muito natural. Recomendo!",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 38,
        text: "O bioestimulador superou minhas expectativas. Processo tranquilo e resultado duradouro.",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "Profissionais excelentes e resultado natural. Minha autoestima aumentou muito!",
        rating: 5,
      },
    ],
  },
  "preenchimento-facial": {
    title: "Preenchimento Facial",
    subtitle: "Restaure o Volume e a Definição do seu Rosto",
    description: "Suaviza rugas, repõe o volume perdido e redefine os contornos faciais com ácido hialurônico.",
    heroImage: "/collagen-biostimulator-facial-treatment.png",
    category: "Facial",
    duration: "30-45 minutos",
    sessions: "1 sessão",
    results: "6-12 meses",
    price: "A partir de R$ 700",

    whatIs: {
      title: "O que é o Preenchimento Facial?",
      content:
        "O preenchimento facial é um procedimento estético que utiliza ácido hialurônico para suavizar rugas, repor o volume perdido e redefinir os contornos faciais. É uma técnica segura e eficaz para rejuvenescer a aparência.",
      technology: "Utilizamos ácido hialurônico de alta qualidade, biocompatível e reabsorvível pelo organismo.",
      objective:
        "Suavizar rugas, repor o volume perdido, redefinir os contornos faciais e proporcionar uma aparência mais jovem e harmoniosa.",
    },

    forWho: {
      ideal: [
        "Pessoas com rugas e sulcos profundos",
        "Quem busca restaurar o volume facial perdido",
        "Pacientes com olheiras profundas",
        "Pessoas que desejam aumentar os lábios",
        "Quem busca uma aparência mais jovem e harmoniosa",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia ao ácido hialurônico",
        "Uso de anticoagulantes",
      ],
    },

    benefits: [
      "Suavização de rugas e sulcos",
      "Restauração do volume facial",
      "Redefinição dos contornos faciais",
      "Aparência mais jovem e harmoniosa",
      "Resultados imediatos",
      "Procedimento minimamente invasivo",
      "Recuperação rápida",
      "Melhora da autoestima",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da face e identificação das áreas a serem tratadas.",
        },
        {
          title: "Preparação",
          description: "Limpeza da pele e aplicação de anestésico tópico para maior conforto.",
        },
        {
          title: "Aplicação",
          description: "Injeção precisa do ácido hialurônico nos pontos estratégicos da face.",
        },
        {
          title: "Massagem",
          description: "Massagem suave para distribuição uniforme do produto.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar massagear a área tratada por 24h",
        "Não fazer exercícios intensos por 24h",
        "Evitar exposição solar por 48h",
        "Aplicar compressas frias para reduzir o inchaço",
        "Retorno em 7 dias para avaliação",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 42,
        text: "O preenchimento facial transformou meu rosto! As rugas sumiram e me sinto muito mais jovem.",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 38,
        text: "O resultado do preenchimento facial foi incrível! Recomendo a todos que desejam rejuvenescer a aparência.",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "O preenchimento facial me proporcionou um rosto mais jovem e harmonioso. Minha autoestima aumentou muito!",
        rating: 5,
      },
    ],
  },
  "fios-de-sustentacao": {
    title: "Fios de Sustentação",
    subtitle: "Efeito Lifting sem Cirurgia",
    description: "Reposiciona os tecidos faciais, combatendo a flacidez e proporcionando um efeito lifting natural.",
    heroImage: "/collagen-biostimulator-facial-treatment.png",
    category: "Facial",
    duration: "45-60 minutos",
    sessions: "1 sessão",
    results: "12-18 meses",
    price: "A partir de R$ 1.200",

    whatIs: {
      title: "O que são os Fios de Sustentação?",
      content:
        "Os fios de sustentação são filamentos absorvíveis que, quando inseridos na pele, reposicionam os tecidos faciais, combatendo a flacidez e proporcionando um efeito lifting natural sem a necessidade de cirurgia.",
      technology: "Utilizamos fios de PDO (polidioxanona), um material biocompatível e reabsorvível pelo organismo.",
      objective:
        "Combater a flacidez facial, reposicionar os tecidos, estimular a produção de colágeno e proporcionar um efeito lifting natural.",
    },

    forWho: {
      ideal: [
        "Pessoas com flacidez leve a moderada",
        "Quem busca um efeito lifting sem cirurgia",
        "Pacientes com perda de definição da mandíbula",
        "Pessoas que desejam melhorar o contorno facial",
        "Quem busca resultados naturais e duradouros",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Distúrbios de coagulação",
        "Pele muito fina ou danificada",
      ],
    },

    benefits: [
      "Efeito lifting sem cirurgia",
      "Combate à flacidez facial",
      "Reposicionamento dos tecidos",
      "Estímulo à produção de colágeno",
      "Melhora do contorno facial",
      "Resultados naturais e duradouros",
      "Procedimento minimamente invasivo",
      "Recuperação rápida",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da face e identificação das áreas a serem tratadas.",
        },
        {
          title: "Preparação",
          description: "Limpeza da pele e aplicação de anestésico tópico para maior conforto.",
        },
        {
          title: "Inserção dos Fios",
          description: "Inserção dos fios de sustentação através de pequenas incisões na pele.",
        },
        {
          title: "Reposicionamento dos Tecidos",
          description: "Tração dos fios para reposicionar os tecidos faciais.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar massagear a área tratada por 1 semana",
        "Não fazer exercícios intensos por 1 semana",
        "Evitar exposição solar por 2 semanas",
        "Aplicar compressas frias para reduzir o inchaço",
        "Dormir de barriga para cima por 1 semana",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 42,
        text: "Os fios de sustentação transformaram meu rosto! A flacidez diminuiu e me sinto muito mais jovem.",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 38,
        text: "O resultado dos fios de sustentação foi incrível! Recomendo a todos que desejam um efeito lifting sem cirurgia.",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "Os fios de sustentação me proporcionaram um rosto mais jovem e definido. Minha autoestima aumentou muito!",
        rating: 5,
      },
    ],
  },
    "peim": {
    title: "Peim",
    subtitle: "Secagem de Vasinhos",
    description: "Tratamento eficaz para eliminar vasinhos e pequenas varizes, melhorando a aparência das pernas.",
    heroImage: "/images/procedimentos/peim/gerais/peim-1.png",
    category: "Corporal",
    duration: "45-60 minutos",
    sessions: "5-10 sessão",
    results: "Imediatos",
    price: "A partir de R$ 199",

    whatIs: {
      title: "O que é secagem de vasinhos?",
      content:
        "A secagem de vasinhos, também conhecida como PEIM, é um procedimento estético que utiliza uma solução esclerosante para eliminar vasinhos e pequenas varizes, melhorando a aparência das pernas.",
      technology: "Utilizamos uma solução esclerosante de alta qualidade, garantindo segurança e eficácia no tratamento.",
      objective:
        "Eliminar vasinhos e pequenas varizes para recuperar a confiança e segurança das nossas pacientes.",
    },

    forWho: {
      ideal: [
        "Pessoas com flacidez leve a moderada",
        "Quem busca um efeito lifting sem cirurgia",
        "Pacientes com perda de definição da mandíbula",
        "Pessoas que desejam melhorar o contorno facial",
        "Quem busca resultados naturais e duradouros",
      ],
      contraindications: [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Distúrbios de coagulação",
        "Pele muito fina ou danificada",
      ],
    },

    benefits: [
      "Efeito lifting sem cirurgia",
      "Combate à flacidez facial",
      "Reposicionamento dos tecidos",
      "Estímulo à produção de colágeno",
      "Melhora do contorno facial",
      "Resultados naturais e duradouros",
      "Procedimento minimamente invasivo",
      "Recuperação rápida",
    ],

    howWorks: {
      steps: [
        {
          title: "Consulta e Avaliação",
          description: "Análise detalhada da face e identificação das áreas a serem tratadas.",
        },
        {
          title: "Preparação",
          description: "Limpeza da pele e aplicação de anestésico tópico para maior conforto.",
        },
        {
          title: "Inserção dos Fios",
          description: "Inserção dos fios de sustentação através de pequenas incisões na pele.",
        },
        {
          title: "Reposicionamento dos Tecidos",
          description: "Tração dos fios para reposicionar os tecidos faciais.",
        },
        {
          title: "Orientações",
          description: "Instruções detalhadas para cuidados pós-procedimento.",
        },
      ],
      aftercare: [
        "Evitar massagear a área tratada por 1 semana",
        "Não fazer exercícios intensos por 1 semana",
        "Evitar exposição solar por 2 semanas",
        "Aplicar compressas frias para reduzir o inchaço",
        "Dormir de barriga para cima por 1 semana",
      ],
    },

    testimonials: [
      {
        name: "Maria Silva",
        age: 42,
        text: "Os fios de sustentação transformaram meu rosto! A flacidez diminuiu e me sinto muito mais jovem.",
        rating: 5,
      },
      {
        name: "Ana Costa",
        age: 38,
        text: "O resultado dos fios de sustentação foi incrível! Recomendo a todos que desejam um efeito lifting sem cirurgia.",
        rating: 5,
      },
      {
        name: "Carla Santos",
        age: 45,
        text: "Os fios de sustentação me proporcionaram um rosto mais jovem e definido. Minha autoestima aumentou muito!",
        rating: 5,
      },
    ],
  },
}

export default function ProcedureClientPage({ params }: ProcedureClientPageProps = {}) {
  const nextParams = useParams()
  const slug = params?.slug || (nextParams.slug as string)
  const [procedure, setProcedure] = useState<any>(null)

  useEffect(() => {
    if (slug) {
      const foundProcedure = procedures[slug]
      if (!foundProcedure) {
        notFound()
      }
      setProcedure(foundProcedure)
    }
  }, [slug])

  if (!procedure) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-pink"></div>
      </div>
    )
  }
  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/5511999999999?text=Olá! Gostaria de agendar uma avaliação para ${procedure.title}.`,
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
                <span className="text-white">Transforme sua pele com</span>
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
              {[1, 2, 3].map((item) => (
                <div key={item} className="card-dark">
                  <div className="relative mb-4">
                    <Image
                      src="/bioestimulador-colageno-antes-depois.png"
                      alt={`Resultado ${item}`}
                      width={400}
                      height={300}
                      className="rounded-lg w-full"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Antes/Depois
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm text-center">
                    Resultado após {item === 1 ? "1 mês" : item === 2 ? "3 meses" : "6 meses"} do tratamento
                  </p>
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
              <div className="card-dark">
                <h3 className="text-2xl font-bold text-brand-pink mb-4">Sessão Avulsa</h3>
                <div className="text-4xl font-bold text-white mb-4">R$ 800</div>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li>• Avaliação completa</li>
                  <li>• 1 sessão de bioestimulador</li>
                  <li>• Acompanhamento pós-procedimento</li>
                  <li>• Orientações personalizadas</li>
                </ul>
                <button onClick={handleWhatsAppClick} className="w-full btn-primary">
                  Agendar Avaliação
                </button>
              </div>

              <div className="card-dark border-2 border-brand-pink relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-pink text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
                <h3 className="text-2xl font-bold text-brand-pink mb-4">Pacote Completo</h3>
                <div className="text-4xl font-bold text-white mb-2">R$ 2.100</div>
                <div className="text-gray-400 line-through mb-4">R$ 2.400</div>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li>• 3 sessões de bioestimulador</li>
                  <li>• Avaliação e acompanhamento</li>
                  <li>• Desconto de 12,5%</li>
                  <li>• Garantia de resultados</li>
                  <li>• Retornos inclusos</li>
                </ul>
                <button onClick={handleWhatsAppClick} className="w-full btn-primary">
                  Agendar Avaliação
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Parcelamos em até 12x sem juros no cartão de crédito</p>
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
