"use client"

import { notFound, useParams } from "next/navigation"
import { useRouter } from "next/navigation"
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
  // Botox: OK
"toxina-botulinica": {
  "title": "Toxina Botulínica",
  "subtitle": "Redução de Rugas e Linhas de Expressão",
  "description": "Suaviza rugas e linhas de expressão, proporcionando uma aparência rejuvenescida e relaxada.",
  "heroImage": "/images/procedimentos/botox/gerais/botox-2.png",
  "category": "Facial",
  "duration": "20-30 minutos",
  "sessions": "1 sessão",
  "results": "3-6 meses",
  "price": "A partir de R$ 349,00",
  "beforeAfterImages": [
   { "src": "/images/procedimentos/botox/antes-x-depois/BOTOX-1.png", "alt": "Botox Antes e Depois" },
   { "src": "/images/procedimentos/botox/antes-x-depois/BOTOX-2.jpeg", "alt": "Botox Resultado 2" },
   { "src": "/images/procedimentos/botox/antes-x-depois/BOTOX-3.png", "alt": "Botox Antes e Depois" }
  ],
  "pricingPackages": [
   {
    "title": "Uma Região",
    "price": "R$ 349,00",
    "features": [
     "Avaliação completa",
     "Aplicação da toxina em uma região",
     "Acompanhamento pós-procedimento",
     "Orientações personalizadas"
    ]
   },
   {
    "title": "Três Regiões",
    "price": "R$ 1.349,00",
    "oldPrice": "R$ 1.890,00",
    "features": [
     "Aplicação da toxina em três regiões",
     "Avaliação e acompanhamento",
     "Desconto de 12,5%",
     "Garantia de resultados",
     "Retornos inclusos"
    ],
    "popular": true
   }
  ],
  "whatIs": {
   "title": "O que é a Toxina Botulínica?",
   "content": "A toxina botulínica, popularmente conhecida como Botox, é uma substância utilizada para suavizar rugas e linhas de expressão. Ela age relaxando os músculos faciais, proporcionando uma aparência mais jovem e descansada.",
   "technology": "Utilizamos toxina botulínica de alta qualidade, garantindo segurança e eficácia no tratamento.",
   "objective": "Reduzir rugas e linhas de expressão, prevenir o envelhecimento precoce e proporcionar uma aparência mais jovem e relaxada."
  },
  "forWho": {
   "ideal": [
    "Pessoas com rugas e linhas de expressão",
    "Quem busca uma aparência mais jovem e descansada",
    "Pacientes com bruxismo",
    "Pessoas com sudorese excessiva",
    "Quem deseja prevenir o envelhecimento precoce"
   ],
   "contraindications": [
    "Gravidez e amamentação",
    "Infecções ativas na área",
    "Doenças neuromusculares",
    "Alergia à toxina botulínica",
    "Uso de antibióticos aminoglicosídeos"
   ]
  },
  "benefits": [
   "Redução de rugas e linhas de expressão",
   "Prevenção do envelhecimento precoce",
   "Aparência mais jovem e descansada",
   "Tratamento rápido e eficaz",
   "Resultados visíveis em poucos dias",
   "Melhora da autoestima",
   "Alívio do bruxismo",
   "Redução da sudorese excessiva"
  ],
  "howWorks": {
   "steps": [
    {
     "title": "Consulta e Avaliação",
     "description": "Análise detalhada da face e identificação das áreas a serem tratadas."
    },
    {
     "title": "Preparação",
     "description": "Limpeza da pele e aplicação de anestésico tópico para maior conforto."
    },
    {
     "title": "Aplicação",
     "description": "Injeção precisa da toxina botulínica nos pontos estratégicos da face."
    },
    {
     "title": "Orientações",
     "description": "Instruções detalhadas para cuidados pós-procedimento."
    }
   ],
   "aftercare": [
    "Evitar massagear a área tratada por 24h",
    "Não fazer exercícios intensos por 24h",
    "Evitar exposição solar por 48h",
    "Não deitar por 4h após a aplicação",
    "Retorno em 15 dias para avaliação"
   ]
  },
  "testimonials": [
   {
    "name": "Maria Silva",
    "age": 35,
    "text": "A toxina botulínica transformou meu rosto! As rugas sumiram e me sinto muito mais jovem.",
    "rating": 5
   },
   {
    "name": "Ana Costa",
    "age": 40,
    "text": "O tratamento com toxina botulínica foi rápido e eficaz. Recomendo a todos!",
    "rating": 5
   },
   {
    "name": "Carla Santos",
    "age": 45,
    "text": "A toxina botulínica aliviou meu bruxismo e ainda me deixou com uma aparência mais jovem.",
    "rating": 5
   }
  ]
 },
  // Full-Face: OK
"harmonizacao-facial": {
    "title": "Harmonização Facial Full-Face",
    "subtitle": "Realce Sua Beleza de Forma Completa",
    "description": "Conjunto de procedimentos estéticos que visam equilibrar e realçar os traços do rosto, abordando múltiplas áreas para proporcionar uma aparência mais harmônica, rejuvenescida e atraente.",
    "heroImage": "/collagen-biostimulator-facial-treatment.png",
    "category": "Facial",
    "duration": "60-90 minutos",
    "sessions": "Variável",
    "results": "6-18 meses",
    "price": "A partir de R$ 4.450",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/harmonizacao/antes-x-depois/HARMONIZACAO-1.png", "alt": "Harmonização Facial Antes e Depois" },
      { "src": "/images/procedimentos/harmonizacao/antes-x-depois/HARMONIZACAO-2.png", "alt": "Harmonização Facial Resultado 2" },
      { "src": "/images/procedimentos/harmonizacao/antes-x-depois/HARMONIZACAO-3.png", "alt": "Harmonização Facial Antes e Depois 3" }
    ],
    "pricingPackages": [
      {
        "title": "Harmonização Full Face",
        "price": "Sob Consulta",
        "features": [
          "Avaliação facial completa",
          "Plano de tratamento personalizado",
          "Aplicação de preenchedores (Ácido Hialurônico)",
          "Toxina Botulínica em 3 áreas",
          "Bioestimuladores de colágeno (se indicado)",
          "Acompanhamento e retornos inclusos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é a Harmonização Facial?",
      "content": "A harmonização facial é um conjunto de procedimentos estéticos que visam equilibrar e realçar os traços do rosto, proporcionando uma aparência mais harmoniosa e atraente. Ela pode incluir preenchimento com ácido hialurônico, toxina botulínica, bioestimuladores de colágeno, entre outros.",
      "technology": "Utilizamos técnicas avançadas e produtos de alta qualidade para garantir resultados naturais e duradouros.",
      "objective": "Equilibrar e realçar os traços do rosto, proporcionar uma aparência mais harmoniosa e atraente, e aumentar a autoestima do paciente."
    },
    "treatedAreas": [
      { "name": "Têmpora", "description": "Preenchimento e definição para a região das têmporas, trazendo volume e suavidade." },
      { "name": "Malar", "description": "Realce das maçãs do rosto para um aspecto mais jovem e harmônico." },
      { "name": "Olheira", "description": "Tratamento para suavizar olheiras, melhorando o aspecto de cansaço." },
      { "name": "Rinomodelação", "description": "Modelagem do nariz sem cirurgia, corrigindo imperfeições e equilibrando o perfil." },
      { "name": "Bigode Chinês", "description": "Preenchimento das linhas ao redor da boca para suavizar marcas e rugas." },
      { "name": "Lábios", "description": "Preenchimento e contorno para lábios mais definidos e harmoniosos." },
      { "name": "Código de Barras", "description": "Correção das linhas finas acima dos lábios para um visual mais suave." },
      { "name": "Marionete", "description": "Suavização das linhas que descem dos cantos da boca para um aspecto mais leve." },
      { "name": "Mento", "description": "Contorno e definição do queixo para melhorar o equilíbrio facial." },
      { "name": "Pré-jowls", "description": "Atenuação das irregularidades na linha da mandíbula para um contorno mais limpo." },
      { "name": "Mandíbula", "description": "Definição e contorno para um perfil mais marcante e equilibrado." },
      { "name": "Rugas / Linhas de Expressão", "description": "Tratamento para reduzir rugas e linhas, devolvendo suavidade à pele." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas que desejam realçar sua beleza natural",
        "Quem busca um rosto mais harmonioso e equilibrado",
        "Pacientes com assimetrias faciais",
        "Pessoas que desejam aumentar a autoestima",
        "Quem busca resultados naturais e duradouros"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia aos componentes",
        "Uso de anticoagulantes"
      ]
    },
    "benefits": [
      "Realce da beleza natural",
      "Rosto mais harmonioso e equilibrado",
      "Correção de assimetrias faciais",
      "Aumento da autoestima",
      "Resultados naturais e duradouros",
      "Procedimentos minimamente invasivos",
      "Recuperação rápida",
      "Melhora da qualidade da pele"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Análise detalhada da face e definição do plano de tratamento personalizado." },
        { "title": "Planejamento", "description": "Escolha dos procedimentos e produtos a serem utilizados." },
        { "title": "Aplicação", "description": "Realização dos procedimentos com técnicas precisas e seguras." },
        { "title": "Orientações", "description": "Instruções detalhadas para cuidados pós-procedimento." }
      ],
      "aftercare": [
        "Evitar exposição solar por 48h",
        "Não fazer exercícios intensos por 24h",
        "Aplicar protetor solar diariamente",
        "Manter a pele hidratada",
        "Retorno em 15 dias para avaliação"
      ]
    },
    "testimonials": [
      {
        "name": "Maria Silva",
        "age": 42,
        "text": "A harmonização facial transformou meu rosto! Me sinto muito mais confiante e feliz.",
        "rating": 5
      },
      {
        "name": "Ana Costa",
        "age": 38,
        "text": "O resultado da harmonização facial foi incrível! Recomendo a todos que desejam realçar sua beleza.",
        "rating": 5
      },
      {
        "name": "Carla Santos",
        "age": 45,
        "text": "A harmonização facial me proporcionou um rosto mais harmonioso e equilibrado. Minha autoestima aumentou muito!",
        "rating": 5
      }
    ]
  },
  // Bio: OK
  "bioestimulador-de-colageno": {
    "title": "Bioestimulador de Colágeno",
    "subtitle": "Rejuvenescimento Natural e Duradouro",
    "description": "Estimula a produção natural de colágeno, rejuvenescendo a pele de forma gradual e natural.",
    "heroImage": "/collagen-biostimulator-facial-treatment.png",
    "category": "Facial",
    "duration": "45-60 minutos",
    "sessions": "2-3 sessões",
    "results": "18-24 meses",
    "price": "A partir de R$ 1.350,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/bioestimulador/antes-x-depois/bio-1.png", "alt": "Bioestimulador de Colágeno Antes e Depois" },
      { "src": "/images/procedimentos/bioestimulador/antes-x-depois/bio-2.png", "alt": "Resultado Bioestimulador de Colágeno" },
      { "src": "/images/procedimentos/bioestimulador/antes-x-depois/bio-4.jpeg", "alt": "Tratamento com Bioestimulador" },
      { "src": "/images/procedimentos/bioestimulador/antes-x-depois/Bio-masc.png", "alt": "Bioestimulador de Colágeno Masculino" }
    ],
    "pricingPackages": [
      {
        "title": "Uma Sessão Facial",
        "price": "R$ 1.350,00",
        "features": [
          "Avaliação completa",
          "1 sessão de bioestimulador",
          "Acompanhamento pós-procedimento",
          "Orientações personalizadas"
        ]
      },
      {
        "title": "Três Sessões (Face, colo e pescoço)",
        "price": "R$ 2.199,00",
        "oldPrice": "R$ 2.690,00",
        "features": [
          "3 sessões de bioestimulador",
          "Avaliação e acompanhamento",
          "Desconto de 12,5%",
          "Garantia de resultados",
          "Retornos inclusos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Bioestimulador de Colágeno?",
      "content": "O bioestimulador de colágeno é um tratamento revolucionário que utiliza substâncias biocompatíveis para estimular a produção natural de colágeno na pele. Diferente dos preenchimentos tradicionais, este procedimento promove o rejuvenescimento de dentro para fora, oferecendo resultados naturais e duradouros.",
      "technology": "Utilizamos tecnologia de ponta com ácido poli-L-lático e hidroxiapatita de cálcio, substâncias totalmente absorvíveis pelo organismo.",
      "objective": "Restaurar a firmeza, elasticidade e volume natural da pele, combatendo os sinais do envelhecimento de forma gradual e harmoniosa."
    },
    "forWho": {
      "ideal": [
        "Pessoas a partir dos 30 anos com sinais de envelhecimento",
        "Quem busca resultados naturais e duradouros",
        "Pacientes com perda de volume facial",
        "Pessoas com flacidez leve a moderada",
        "Quem deseja prevenir o envelhecimento precoce"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia aos componentes",
        "Uso de anticoagulantes"
      ]
    },
    "benefits": [
      "Estimulação natural do colágeno",
      "Resultados graduais e naturais",
      "Melhora da textura da pele",
      "Redução de rugas e linhas de expressão",
      "Restauração do volume facial",
      "Efeito lifting natural",
      "Durabilidade de até 2 anos",
      "Procedimento minimamente invasivo"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Análise detalhada da pele e definição do plano de tratamento personalizado." },
        { "title": "Preparação", "description": "Limpeza da pele e aplicação de anestésico tópico para maior conforto." },
        { "title": "Aplicação", "description": "Injeção precisa do bioestimulador nos pontos estratégicos do rosto." },
        { "title": "Massagem", "description": "Massagem suave para distribuição uniforme do produto." },
        { "title": "Orientações", "description": "Instruções detalhadas para cuidados pós-procedimento." }
      ],
      "aftercare": [
        "Massagear a área tratada conforme orientação profissional (geralmente 5 min, 5x ao dia, por 5 dias)",
        "Não fazer exercícios intensos por 48h",
        "Evitar exposição solar direta na primeira semana",
        "Aplicar protetor solar diariamente",
        "Manter a pele bem hidratada"
      ]
    },
    "testimonials": [
      {
        "name": "Maria Silva",
        "age": 42,
        "text": "Resultado incrível! Minha pele ficou mais firme e com aspecto muito natural. Recomendo!",
        "rating": 5
      },
      {
        "name": "Ana Costa",
        "age": 38,
        "text": "O bioestimulador superou minhas expectativas. Processo tranquilo e resultado duradouro.",
        "rating": 5
      },
      {
        "name": "Carla Santos",
        "age": 45,
        "text": "Profissionais excelentes e resultado natural. Minha autoestima aumentou muito!",
        "rating": 5
      }
    ]
  },

  // Preenchimento Facial: OK
  "preenchimento-facial": {
    "title": "Preenchimento Facial",
    "subtitle": "Restaure o Volume e a Definição do seu Rosto",
    "description": "Suaviza rugas, repõe o volume perdido e redefine os contornos faciais com ácido hialurônico.",
    "heroImage": "/images/procedimentos/preenchimento/facial-2.png",
    "category": "Facial",
    "duration": "30-45 minutos",
    "sessions": "1 sessão",
    "results": "8-12 meses",
    "price": "A partir de R$ 990,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/labial-1.jpg", "alt": "Preenchimento Labial Antes e Depois" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/labial-2.png", "alt": "Resultado Preenchimento Labial" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/labial-3.png", "alt": "Antes e Depois Lábios" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/bigode-chines-1.jpeg", "alt": "Preenchimento Bigode Chinês" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/bigode-chines-2.jpeg", "alt": "Resultado Sulco Nasogeniano" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/bigode-chines-3.jpeg", "alt": "Antes e Depois Bigode Chinês" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/rino-1.jpeg", "alt": "Rinomodelação Antes e Depois" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/rino-2.jpeg", "alt": "Resultado Rinomodelação" },
      { "src": "/images/procedimentos/preenchimento/antes-x-depois/rino-3.jpeg", "alt": "Antes e Depois Rinomodelação" }
    ],
    "pricingPackages": [
      {
        "title": "Um ml de Preenchimento",
        "price": "R$ 990,00",
        "features": [
          "Avaliação completa",
          "Aplicação de 1ml de ácido hialurônico",
          "Acompanhamento pós-procedimento",
          "Orientações personalizadas"
        ]
      },
      {
        "title": "Quatro mls de Preenchimento",
        "price": "R$ 2.900,00",
        "oldPrice": "R$ 3.960,00",
        "features": [
          "Aplicação de 4ml de ácido hialurônico",
          "Avaliação e acompanhamento",
          "Desconto especial no pacote",
          "Plano de tratamento para múltiplas áreas",
          "Retornos inclusos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Preenchimento Facial?",
      "content": "O preenchimento facial é um procedimento estético que utiliza ácido hialurônico para suavizar rugas, repor o volume perdido e redefinir os contornos faciais. É uma técnica segura e eficaz para rejuvenescer a aparência.",
      "technology": "Utilizamos ácido hialurônico de alta qualidade, biocompatível e reabsorvível pelo organismo.",
      "objective": "Suavizar rugas, repor o volume perdido, redefinir os contornos faciais e proporcionar uma aparência mais jovem e harmoniosa."
    },
     "treatedAreas": [
      { "name": "Lábios", "description": "Aumento de volume, contorno e hidratação para lábios mais definidos." },
      { "name": "Sulco Nasogeniano (Bigode Chinês)", "description": "Suavização das linhas que vão do nariz aos cantos da boca." },
      { "name": "Olheiras", "description": "Preenchimento da região abaixo dos olhos para reduzir o aspecto de cansaço." },
      { "name": "Malar (Maçãs do Rosto)", "description": "Devolve o volume e proporciona um efeito 'blush' natural." },
      { "name": "Mandíbula e Mento (Queixo)", "description": "Define e melhora o contorno do terço inferior da face." },
      { "name": "Rinomodelação", "description": "Correção de pequenas imperfeições e empinamento da ponta nasal sem cirurgia." },
      { "name": "Linhas de Marionete", "description": "Suavização das linhas que descem dos cantos da boca." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com rugas e sulcos profundos",
        "Quem busca restaurar o volume facial perdido",
        "Pacientes com olheiras profundas",
        "Pessoas que desejam aumentar ou contornar os lábios",
        "Quem busca uma aparência mais jovem e harmoniosa"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes",
        "Alergia ao ácido hialurônico",
        "Uso de anticoagulantes"
      ]
    },
    "benefits": [
      "Suavização de rugas e sulcos",
      "Restauração do volume facial",
      "Redefinição dos contornos faciais",
      "Aparência mais jovem e harmoniosa",
      "Resultados imediatos e naturais",
      "Procedimento minimamente invasivo",
      "Recuperação rápida",
      "Melhora da autoestima"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Análise detalhada da face e identificação das áreas a serem tratadas." },
        { "title": "Preparação", "description": "Limpeza da pele e aplicação de anestésico tópico para maior conforto." },
        { "title": "Aplicação", "description": "Injeção precisa do ácido hialurônico nos pontos estratégicos da face." },
        { "title": "Modelagem", "description": "Massagem suave pelo profissional para distribuição e modelagem uniforme do produto." },
        { "title": "Orientações", "description": "Instruções detalhadas para cuidados pós-procedimento." }
      ],
      "aftercare": [
        "Evitar tocar ou massagear a área tratada por 24h",
        "Não fazer exercícios intensos por 48h",
        "Evitar exposição solar intensa na primeira semana",
        "Aplicar compressas frias para reduzir o inchaço",
        "Retorno em 15 a 30 dias para avaliação"
      ]
    },
    "testimonials": [
      {
        "name": "Maria Silva",
        "age": 42,
        "text": "O preenchimento no bigode chinês transformou meu rosto! As marcas sumiram e me sinto muito mais jovem.",
        "rating": 5
      },
      {
        "name": "Ana Costa",
        "age": 38,
        "text": "Fiz o preenchimento labial e o resultado ficou incrível! Super natural, do jeito que eu queria. Recomendo.",
        "rating": 5
      },
      {
        "name": "Carla Santos",
        "age": 45,
        "text": "O preenchimento nas olheiras me deu uma aparência mais descansada. Minha autoestima aumentou muito!",
        "rating": 5
      }
    ]
  },
  // Fios de Sustentação: OK
  "fios-de-sustentacao": {
    "title": "Fios de Sustentação PDO",
    "subtitle": "Efeito Lifting sem Cirurgia",
    "description": "Reposiciona os tecidos faciais, combatendo a flacidez e proporcionando um efeito lifting natural e imediato.",
    "heroImage": "/images/procedimentos/fios/gerais/fios-1.png",
    "category": "Facial",
    "duration": "45-60 minutos",
    "sessions": "1 sessão",
    "results": "12-18 meses",
    "price": "A partir de R$ 990,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/fios/antes-x-depois/fios-1.jpeg", "alt": "Fios de Sustentação Antes e Depois" },
      { "src": "/images/procedimentos/fios/antes-x-depois/fios-2.png", "alt": "Resultado com Fios de Sustentação" },
      { "src": "/images/procedimentos/fios/antes-x-depois/fios-3.jpeg", "alt": "Lifting com Fios de PDO" }
    ],
    "pricingPackages": [
      {
        "title": "Fios Lisos (Estímulo de Colágeno)",
        "price": "R$ 990,00",
        "features": [
          "Avaliação completa",
          "Aplicação de 10 fios de PDO lisos",
          "Ideal para firmeza e qualidade da pele",
          "Orientações personalizadas"
        ]
      },
      {
        "title": "Fios de Garra (Tração e Lifting)",
        "price": "R$ 2.400,00",
        "oldPrice": "R$ 3.960,00",
        "features": [
          "Avaliação e planejamento de lifting",
          "Aplicação de 10 fios de PDO de garra",
          "Efeito lifting imediato",
          "Acompanhamento e retornos inclusos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que são os Fios de Sustentação?",
      "content": "Os fios de sustentação são filamentos absorvíveis que, quando inseridos na pele, reposicionam os tecidos faciais, combatendo a flacidez e proporcionando um efeito lifting natural. Além da tração, o material dos fios estimula a produção de colágeno na região.",
      "technology": "Utilizamos fios de PDO (polidioxanona), um material 100% biocompatível e reabsorvível pelo organismo, seguro e eficaz.",
      "objective": "Combater a flacidez facial, reposicionar os tecidos, estimular a produção de colágeno e proporcionar um efeito lifting natural."
    },
    "treatedAreas": [
        { "name": "Contorno da Mandíbula", "description": "Define a linha da mandíbula, tratando a flacidez e o 'buldogue'." },
        { "name": "Pescoço e Papada", "description": "Reduz a flacidez na região do pescoço, melhorando o contorno." },
        { "name": "Elevação das Sobrancelhas (Fox Eyes)", "description": "Promove a arqueação e elevação da cauda da sobrancelha para um olhar mais aberto." },
        { "name": "Terço Médio da Face", "description": "Reposiciona as maçãs do rosto, suavizando o 'bigode chinês'." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com flacidez facial leve a moderada",
        "Quem busca um efeito lifting sem cirurgia",
        "Pacientes com perda de definição da mandíbula",
        "Pessoas que desejam melhorar o contorno facial",
        "Quem busca resultados naturais e duradouros"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área",
        "Doenças autoimunes não controladas",
        "Distúrbios de coagulação",
        "Pele excessivamente flácida ou muito fina"
      ]
    },
    "benefits": [
      "Efeito lifting imediato e sem cirurgia",
      "Combate eficaz à flacidez facial",
      "Reposicionamento dos tecidos da face",
      "Estímulo à produção natural de colágeno",
      "Melhora do contorno e definição facial",
      "Resultados naturais e duradouros",
      "Procedimento minimamente invasivo",
      "Recuperação mais rápida que a cirúrgica"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Análise detalhada da face, marcação dos vetores de tração e planejamento do tratamento." },
        { "title": "Preparação e Anestesia", "description": "Limpeza da pele e aplicação de anestésico local nos pontos de entrada e saída dos fios." },
        { "title": "Inserção dos Fios", "description": "Introdução dos fios nas camadas profundas da pele através de uma cânula por um pequeno ponto de entrada." },
        { "title": "Tração e Ancoragem", "description": "Os fios são tracionados e ancorados para reposicionar os tecidos faciais, criando o efeito lifting." },
        { "title": "Finalização e Orientações", "description": "Corte das pontas dos fios e instruções detalhadas para os cuidados pós-procedimento." }
      ],
      "aftercare": [
        "Evitar massagear ou esfregar a área tratada por 1 semana",
        "Não fazer exercícios intensos ou de impacto por 1 semana",
        "Evitar tratamentos dentários e expressões faciais exageradas por 2 semanas",
        "Aplicar compressas frias nas primeiras 48h para reduzir o inchaço",
        "Dormir de barriga para cima, com a cabeça elevada, por 5 a 7 dias"
      ]
    },
    "testimonials": [
      {
        "name": "Sônia M.",
        "age": 52,
        "text": "Os fios de sustentação transformaram meu rosto! A flacidez no contorno da mandíbula diminuiu muito e me sinto bem mais jovem.",
        "rating": 5
      },
      {
        "name": "Roberto P.",
        "age": 48,
        "text": "O resultado dos fios foi incrível e muito natural. Recomendo a todos que desejam um efeito lifting sem passar por cirurgia.",
        "rating": 5
      },
      {
        "name": "Lúcia F.",
        "age": 45,
        "text": "Os fios de sustentação me deram um rosto mais descansado e definido. Minha autoestima aumentou muito!",
        "rating": 5
      }
    ]
  },
  // Skinbooster: OK
      "skinbooster": {
    "title": "Skinbooster",
    "subtitle": "Hidratação Profunda e Rejuvenescimento",
    "description": "Técnica que utiliza ácido hialurônico de baixa densidade para promover uma hidratação profunda e estimular a produção de colágeno, resultando em uma pele mais jovem, firme e luminosa.",
    "heroImage": "/images/procedimentos/skinbooster/gerais/skinbooster-1.png",
    "category": "Facial",
    "duration": "30-45 minutos",
    "sessions": "2-3 sessões",
    "results": "Até 12 meses",
    "price": "A partir de R$ 850,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/skinbooster/antes-x-depois/skinbooster-1.jpg", "alt": "Resultado Skinbooster" },
      { "src": "/images/procedimentos/skinbooster/antes-x-depois/skinbooster-2.jpg", "alt": "Skinbooster Antes e Depois" }
    ],
    "pricingPackages": [
      {
        "title": "Sessão Individual",
        "price": "R$ 850,00",
        "features": [
          "Avaliação completa da pele",
          "1 sessão de Skinbooster",
          "Aplicação em rosto completo",
          "Orientações pós-procedimento"
        ]
      },
      {
        "title": "Protocolo de Hidratação Intensa",
        "price": "R$ 2.100,00",
        "oldPrice": "R$ 2.550,00",
        "features": [
          "3 sessões de Skinbooster",
          "Avaliação e acompanhamento contínuo",
          "Resultados potencializados",
          "Ideal para peles maduras ou desidratadas",
          "Retornos inclusos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Skinbooster?",
      "content": "O Skinbooster é um procedimento estético minimamente invasivo que utiliza microinjeções de ácido hialurônico de baixa concentração para hidratar profundamente a pele. Diferente do preenchimento, seu objetivo não é dar volume, mas sim revitalizar a pele de dentro para fora, melhorando sua elasticidade, firmeza e brilho.",
      "technology": "Utilizamos ácidos hialurônicos específicos para hidratação profunda, que atraem e retêm água nas camadas da derme, estimulando também a produção de colágeno.",
      "objective": "Promover uma hidratação intensa, suavizar linhas finas e rugas, melhorar a textura e a luminosidade da pele e estimular a produção natural de colágeno."
    },
    "treatedAreas": [
        { "name": "Rosto Completo", "description": "Melhora a hidratação geral, o viço e suaviza linhas finas." },
        { "name": "Pescoço", "description": "Trata a flacidez e as linhas horizontais, rejuvenescendo a área." },
        { "name": "Colo", "description": "Ameniza as rugas do sono ('sleep lines') e melhora a textura da pele." },
        { "name": "Mãos", "description": "Devolve a hidratação e o volume perdidos com o tempo, rejuvenescendo a aparência." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com pele desidratada ou ressecada",
        "Quem busca melhorar a textura e o viço da pele",
        "Pacientes com linhas finas e rugas de expressão",
        "Pessoas que desejam tratar cicatrizes de acne",
        "Quem busca um rejuvenescimento natural sem volumização"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ou inflamações ativas na área a ser tratada",
        "Doenças autoimunes em atividade",
        "Alergia conhecida ao ácido hialurônico",
        "Uso de anticoagulantes (requer avaliação)"
      ]
    },
    "benefits": [
      "Hidratação profunda e duradoura",
      "Melhora da elasticidade e firmeza da pele",
      "Estímulo à produção de colágeno",
      "Suavização de linhas finas e rugas",
      "Pele mais luminosa e com mais viço",
      "Resultados naturais e progressivos",
      "Procedimento rápido e seguro",
      "Pode ser combinado com outros tratamentos"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Análise detalhada da pele para definir as áreas de aplicação e o número de sessões." },
        { "title": "Preparação da Pele", "description": "Higienização da área e aplicação de um creme anestésico para garantir o conforto durante o procedimento." },
        { "title": "Aplicação", "description": "Realização de microinjeções do ácido hialurônico em pontos estratégicos da área a ser tratada." },
        { "title": "Massagem Suave", "description": "Uma leve massagem pode ser feita para distribuir o produto de forma homogênea." },
        { "title": "Orientações Pós-procedimento", "description": "Instruções detalhadas sobre os cuidados necessários para otimizar os resultados." }
      ],
      "aftercare": [
        "Evitar exposição solar intensa nas primeiras 48 horas",
        "Não massagear a área tratada por 24 horas",
        "Evitar o uso de maquiagem por 12 horas",
        "Aplicar protetor solar diariamente",
        "Pode haver pequenos hematomas ou inchaço, que regridem em poucos dias"
      ]
    },
    "testimonials": [
      {
        "name": "Juliana Lima",
        "age": 35,
        "text": "Minha pele estava sempre opaca e sem vida. O Skinbooster devolveu o brilho e a hidratação que eu tanto queria. Amei o resultado!",
        "rating": 5
      },
      {
        "name": "Roberto Almeida",
        "age": 47,
        "text": "Fiz para tratar as linhas finas ao redor dos olhos e a textura da pele. O resultado foi muito natural e satisfatório. Recomendo.",
        "rating": 5
      },
      {
        "name": "Fernanda Souza",
        "age": 29,
        "text": "O Skinbooster foi incrível para as minhas cicatrizes de acne. A pele ficou muito mais lisa e uniforme. Estou muito feliz!",
        "rating": 5
      }
    ]
  },

    // PEIM: OK
    "peim": {
    "title": "Peim (Secagem de Vasinhos)",
    "subtitle": "Pernas Livres de Vasinhos",
    "description": "Tratamento eficaz para eliminar telangiectasias (vasinhos) e pequenas varizes, melhorando a aparência e o conforto das pernas.",
    "heroImage": "/images/procedimentos/peim/gerais/peim-1.png",
    "category": "Corporal",
    "duration": "30-45 minutos por sessão",
    "sessions": "5 a 10 sessões",
    "results": "Progressivos a cada sessão",
    "price": "A partir de R$ 199,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/peim/antes-x-depois/PEIM-1.png", "alt": "Resultado de PEIM Antes e Depois" },
      { "src": "/images/procedimentos/peim/antes-x-depois/PEIM-2.jpg", "alt": "Secagem de Vasinhos nas Pernas" },
      { "src": "/images/procedimentos/peim/antes-x-depois/PEIM-3.png", "alt": "Antes e Depois do Tratamento PEIM" }
    ],
    "pricingPackages": [
      {
        "title": "Sessão Individual",
        "price": "R$ 199,00",
        "features": [
          "Avaliação dos vasos",
          "1 sessão de escleroterapia (PEIM)",
          "Aplicação da solução esclerosante",
          "Orientações de cuidados"
        ]
      },
      {
        "title": "Pacote 10 Sessões",
        "price": "R$ 1.499,00",
        "oldPrice": "R$ 1.990,00",
        "features": [
          "Tratamento completo para múltiplas áreas",
          "Avaliação e acompanhamento da evolução",
          "Resultados estéticos otimizados",
          "Desconto especial no pacote",
          "Sessões de retorno para avaliação"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é a Secagem de Vasinhos (PEIM)?",
      "content": "A secagem de vasinhos, ou PEIM (Procedimento Estético Injetável para Microvasos), é um tratamento onde uma solução esclerosante é injetada diretamente nos pequenos vasos. Essa substância causa uma irritação na parede do vaso, fazendo com que ele se feche e seja reabsorvido pelo organismo, desaparecendo da superfície da pele.",
      "technology": "Utilizamos soluções esclerosantes seguras e eficazes, como a glicose, aplicadas por profissionais habilitados para garantir os melhores resultados.",
      "objective": "Eliminar os vasinhos e microvarizes visíveis, melhorando a aparência estética das pernas e devolvendo a confiança para nossas pacientes."
    },
    "forWho": {
      "ideal": [
        "Pessoas com telangiectasias (vasinhos vermelhos ou roxos)",
        "Quem se sente desconfortável com a aparência dos vasos nas pernas",
        "Pacientes que buscam um tratamento não cirúrgico e eficaz",
        "Homens e mulheres que desejam pernas com aparência mais uniforme e saudável"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Alergia à substância esclerosante",
        "Trombose venosa profunda ou insuficiência arterial",
        "Infecções ou feridas ativas na área a ser tratada",
        "Distúrbios de coagulação sanguínea"
      ]
    },
    "benefits": [
      "Eliminação visível dos vasinhos",
      "Melhora significativa da aparência das pernas",
      "Procedimento rápido, realizado em consultório",
      "Recuperação simples e sem necessidade de repouso",
      "Aumento da autoestima e confiança para usar saias, shorts e vestidos",
      "Alívio de sintomas como queimação e peso (em alguns casos)"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Avaliação", "description": "Inspeção detalhada das pernas para mapear os vasos a serem tratados e descartar contraindicações." },
        { "title": "Preparação", "description": "Assepsia (limpeza) da pele na região onde a aplicação será realizada." },
        { "title": "Aplicação da Solução", "description": "Com uma agulha muito fina, a solução esclerosante é injetada diretamente dentro de cada vasinho." },
        { "title": "Compressão", "description": "Após a aplicação, uma leve compressão é feita no local para auxiliar no fechamento do vaso." },
        { "title": "Orientações", "description": "Instruções detalhadas sobre os cuidados pós-procedimento, como o uso de meias de compressão." }
      ],
      "aftercare": [
        "Usar meias de compressão elástica conforme orientação profissional",
        "Evitar exposição solar direta na área tratada por 15 a 30 dias para prevenir manchas",
        "Não realizar exercícios físicos de alto impacto por 24 a 48 horas",
        "Caminhar normalmente para estimular a circulação sanguínea",
        "Pequenos hematomas e uma leve inflamação no local são normais e temporários"
      ]
    },
    "testimonials": [
      {
        "name": "Cláudia Ribeiro",
        "age": 45,
        "text": "Eu tinha muitos vasinhos que me incomodavam há anos. Com o PEIM, minhas pernas estão com uma aparência muito melhor! Voltei a usar vestidos sem vergonha.",
        "rating": 5
      },
      {
        "name": "Mariana Ferraz",
        "age": 36,
        "text": "O tratamento foi super tranquilo e os resultados apareceram rápido. Estou muito satisfeita com a melhora na aparência das minhas pernas.",
        "rating": 5
      },
      {
        "name": "Sílvia Andrade",
        "age": 52,
        "text": "Recomendo muito! O procedimento é rápido e eficaz. Finalmente me sinto à vontade para ir à praia e à piscina. Aumentou muito minha autoestima.",
        "rating": 5
      }
    ]
  },
}

export default function ProcedureClientPage({ params }: ProcedureClientPageProps = {}) {
  const router = useRouter()
  const nextParams = useParams()
  const slug = params?.slug || (nextParams.slug as string)
  const [procedure, setProcedure] = useState<any>(null)

  useEffect(() => {
    if (slug) {
      const foundProcedure = procedures[slug]
      if (!foundProcedure) {
        router.push("/not-found")
        return
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
    // Default pricing packages if not provided
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
