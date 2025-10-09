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
    "price": "R$ 899,00",
    "oldPrice": "R$ 1.350,00",
    "features": [
      "Avaliação e acompanhamento",
      "Aplicação da toxina em três regiões",
      "Garantia de resultados",
      "Retorno incluso"
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
  
  "lipo-de-papada": {
    "title": "Lipo de Papada (Enzimática)",
    "subtitle": "Redefina o Contorno do seu Rosto",
    "description": "Procedimento minimamente invasivo que utiliza enzimas para eliminar a gordura localizada da papada, melhorando a definição do contorno facial.",
    "heroImage": "/images/procedimentos/lipo-de-papada/gerais/lipo-de-papada-1.png",
    "category": "Facial",
    "duration": "30-45 minutos",
    "sessions": "3 a 6 sessões",
    "results": "Resultados permanentes",
    "price": "A partir de R$ 450,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/lipo-de-papada/antes-x-depois/lipo-de-papada-1.jpg", "alt": "Lipo de Papada Antes e Depois" },
      { "src": "/images/procedimentos/lipo-de-papada/antes-x-depois/lipo-de-papada-2.jpg", "alt": "Resultado Lipo de Papada" },
      { "src": "/images/procedimentos/lipo-de-papada/antes-x-depois/lipo-de-papada-3.png", "alt": "Antes e Depois Redução de Papada" }
    ],
    "pricingPackages": [
      {
        "title": "Sessão Individual",
        "price": "R$ 450,00",
        "features": [
          "Avaliação profissional da área",
          "1 sessão de aplicação de enzimas",
          "Acompanhamento inicial",
          "Orientações de cuidados"
        ]
      },
      {
        "title": "Protocolo de Definição (4 Sessões)",
        "price": "R$ 1.600,00",
        "oldPrice": "R$ 1.800,00",
        "features": [
          "4 sessões de aplicação de enzimas",
          "Plano de tratamento personalizado",
          "Acompanhamento da evolução dos resultados",
          "Desconto especial no pacote",
          "Resultados otimizados e mais visíveis"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é a Lipo de Papada Enzimática?",
      "content": "A Lipo de Papada Enzimática é um tratamento não cirúrgico para a redução da gordura submentoniana (o popular 'queixo duplo'). O procedimento consiste na aplicação de microinjeções de uma enzima, o ácido deoxicólico, que age quebrando as membranas das células de gordura. Uma vez destruídas, essas células são eliminadas naturalmente pelo sistema linfático do corpo.",
      "technology": "Utilizamos o ácido deoxicólico, uma enzima biocompatível e segura, que age diretamente na quebra das células de gordura (adipócitos), sem danificar outras estruturas da pele.",
      "objective": "Eliminar a gordura localizada da papada, melhorar a definição do ângulo da mandíbula e proporcionar um contorno facial mais fino e harmonioso."
    },
    "treatedAreas": [
      { "name": "Região Submentoniana (Papada)", "description": "Área localizada abaixo do queixo onde a gordura se acumula, causando a aparência de 'queixo duplo' e prejudicando o contorno facial." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com acúmulo de gordura leve a moderado na região da papada",
        "Quem busca uma alternativa não cirúrgica para reduzir o queixo duplo",
        "Pacientes com bom tônus de pele, sem flacidez excessiva na região",
        "Quem deseja um contorno facial mais definido e elegante"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Flacidez excessiva na região (requer avaliação para tratamentos combinados)",
        "Infecções ou inflamações ativas no local da aplicação",
        "Distúrbios da tireoide não controlados",
        "Dificuldade de deglutição (disfagia)"
      ]
    },
    "benefits": [
      "Redução significativa da gordura da papada",
      "Melhora notável do contorno facial e da linha da mandíbula",
      "Resultados permanentes nas células de gordura tratadas",
      "Procedimento sem cortes, sem cirurgia e sem necessidade de internação",
      "Recuperação rápida, permitindo o retorno às atividades normais",
      "Aumento da autoestima e da confiança com a aparência"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Marcação", "description": "Avaliação detalhada da papada para determinar a quantidade de gordura e planejar os pontos de aplicação da enzima." },
        { "title": "Preparação da Pele", "description": "Assepsia completa da região. Um anestésico tópico pode ser aplicado para maior conforto." },
        { "title": "Aplicação da Enzima", "description": "Realização de múltiplas microinjeções da enzima diretamente no tecido adiposo da papada." },
        { "title": "Orientações Pós-procedimento", "description": "Instruções detalhadas sobre os cuidados em casa para garantir a segurança e otimizar os resultados." }
      ],
      "aftercare": [
        "É comum e esperado um inchaço significativo na área tratada, que pode durar alguns dias",
        "Aplicar compressas frias nas primeiras 24 a 48 horas para amenizar o inchaço",
        "Evitar exercícios físicos intensos por 3 a 5 dias",
        "Não massagear a área e evitar o uso de anti-inflamatórios (a inflamação faz parte do processo)",
        "Pode haver sensibilidade, dormência ou pequenos hematomas temporários na região"
      ]
    },
    "testimonials": [
      {
        "name": "Ricardo Mendes",
        "age": 38,
        "text": "Sempre me incomodei com o queixo duplo nas fotos. A lipo de papada foi a solução perfeita! O resultado foi gradual e muito natural. Recomendo demais.",
        "rating": 5
      },
      {
        "name": "Beatriz Costa",
        "age": 29,
        "text": "Eu não queria fazer cirurgia e encontrei esse tratamento. O inchaço inicial assusta um pouco, mas depois o resultado é incrível! Meu rosto parece muito mais fino.",
        "rating": 5
      },
      {
        "name": "Vanessa Oliveira",
        "age": 44,
        "text": "Estou na terceira sessão e já vejo uma diferença enorme. Meu contorno está muito mais definido. Profissionais excelentes e tratamento eficaz.",
        "rating": 5
      }
    ]
  },

  // Peeling Químico: OK
  "peeling-quimico": {
    "title": "Peeling Químico",
    "subtitle": "Renovação Celular e Pele Radiante",
    "description": "Promove a renovação intensa da pele através da aplicação de ácidos, tratando manchas, acne, rugas finas e melhorando a textura geral.",
    "heroImage": "/images/procedimentos/peeling-quimico/gerais/peeling-quimico-1.png",
    "category": "Facial",
    "duration": "30-45 minutos",
    "sessions": "1 sessão",
    "results": "Visíveis após a descamação",
    "price": "A partir de R$ 350,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/peeling-quimico/antes-x-depois/peeling-quimico-1.png", "alt": "Peeling Químico Antes e Depois" },
      { "src": "/images/procedimentos/peeling-quimico/antes-x-depois/peeling-quimico-2.jpg", "alt": "Resultado Peeling para Manchas" },
      { "src": "/images/procedimentos/peeling-quimico/antes-x-depois/peeling-quimico-3.png", "alt": "Pele Renovada com Peeling Químico" },
      { "src": "/images/procedimentos/peeling-quimico/antes-x-depois/peeling-quimico-4.png", "alt": "Paciente Feliz após Peeling Químico" }

    ],
    "pricingPackages": [
      {
        "title": "Peeling Suave (Renovação Iluminadora)",
        "price": "R$ 389,00",
        "features": [
          "Avaliação detalhada da pele",
          "1 sessão de peeling superficial (ex: Ácido Mandélico)",
          "Ideal para iniciantes ou peles sensíveis",
          "Máscara calmante pós-procedimento"
        ]
      },
      {
        "title": "Protocolo Clareador (3 Sessões)",
        "price": "R$ 950,00",
        "oldPrice": "R$ 1.050,00",
        "features": [
          "3 sessões de peelings combinados",
          "Foco no tratamento de manchas e melasma",
          "Acompanhamento profissional da evolução",
          "Resultados visivelmente mais claros e uniformes"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Peeling Químico?",
      "content": "O Peeling Químico é um tratamento que utiliza soluções ácidas aplicadas sobre a pele para remover as camadas danificadas e promover a regeneração celular. Ao acelerar a esfoliação natural, ele dá lugar a uma pele nova, mais lisa, uniforme e saudável. Existem diferentes profundidades de peeling (superficial, médio e profundo), e a escolha depende da necessidade de cada paciente.",
      "technology": "Trabalhamos com uma variedade de ácidos consagrados e seguros, como Ácido Glicólico, Salicílico, Mandélico, Jessner e Retinoico. A seleção e a concentração do peeling são personalizadas de acordo com o tipo de pele, a condição a ser tratada e os objetivos do paciente, garantindo um tratamento eficaz e seguro.",
      "objective": "Acelerar a renovação celular, clarear manchas (como melasma e hiperpigmentação pós-inflamatória), controlar a oleosidade e a acne, suavizar linhas finas e cicatrizes, e devolver o viço e a luminosidade à pele."
    },
    "treatedAreas": [
      { "name": "Rosto", "description": "Tratamento completo para manchas, acne, rejuvenescimento e melhora da textura." },
      { "name": "Colo e Pescoço", "description": "Para tratar danos solares, manchas e melhorar a qualidade da pele." },
      { "name": "Costas e Ombros", "description": "Eficaz para tratar acne, foliculite e manchas nessas regiões." },
      { "name": "Mãos", "description": "Para clarear manchas senis e rejuvenescer a pele do dorso das mãos." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com manchas, melasma e sardas",
        "Pacientes com acne, cravos e oleosidade excessiva",
        "Quem possui cicatrizes de acne superficiais",
        "Peles com sinais de envelhecimento, como linhas finas",
        "Quem busca melhorar a textura irregular e o viço da pele"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas (como herpes) ou feridas abertas na área",
        "Uso recente de isotretinoína (Roacutan)",
        "Doenças de pele como psoríase ou eczema ativo na área a ser tratada",
        "Hipersensibilidade conhecida aos componentes da fórmula"
      ]
    },
    "benefits": [
      "Clareamento de manchas e uniformização do tom da pele",
      "Controle eficaz da acne e da oleosidade",
      "Redução da aparência dos poros dilatados",
      "Suavização de rugas finas e cicatrizes superficiais",
      "Pele mais lisa, macia e com textura aveludada",
      "Aumento da luminosidade e do viço natural da pele",
      "Estimula a produção de colágeno, melhorando a firmeza"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Preparo", "description": "Análise da pele para escolher o ácido ideal. A pele é completamente higienizada e preparada para receber o tratamento." },
        { "title": "Proteção de Áreas Sensíveis", "description": "Aplicação de produtos para proteger áreas delicadas como os cantos dos olhos, nariz e boca." },
        { "title": "Aplicação do Ácido", "description": "O profissional aplica o ácido escolhido em camadas sobre a pele, monitorando de perto o tempo de ação e a reação da pele." },
        { "title": "Neutralização e Remoção", "description": "Dependendo do ácido, ele é neutralizado e/ou removido cuidadosamente com água fria." },
        { "title": "Finalização e Proteção", "description": "Aplicação de uma máscara calmante e hidratante, seguida por um protetor solar de alta proteção, essencial para a segurança da pele." }
      ],
      "aftercare": [
        "A pele pode apresentar vermelhidão e sensibilidade nas primeiras horas ou dias.",
        "A descamação é esperada e pode variar de fina a intensa, iniciando em 2-3 dias e durando até uma semana.",
        "É PROIBIDO puxar as peles que estão se soltando para evitar manchas e cicatrizes.",
        "EVITAR EXPOSIÇÃO SOLAR e usar protetor solar FPS 50+ rigorosamente, reaplicando a cada 2-3 horas, mesmo em ambientes internos.",
        "Utilizar sabonetes neutros e hidratantes reparadores recomendados pelo profissional.",
        "Suspender o uso de outros ácidos e produtos abrasivos até a completa recuperação da pele."
      ]
    },
    "testimonials": [
      {
        "name": "Larissa Bastos",
        "age": 31,
        "text": "Eu tinha muitas manchas de acne e o peeling químico foi a melhor coisa que fiz. Minha pele está com o tom muito mais uniforme. A descamação valeu a pena!",
        "rating": 5
      },
      {
        "name": "Fernando Dias",
        "age": 27,
        "text": "Minha pele era extremamente oleosa e com acne. O peeling ajudou a controlar muito a oleosidade e diminuiu as espinhas. O resultado é ótimo.",
        "rating": 5
      },
      {
        "name": "Sandra Nogueira",
        "age": 46,
        "text": "Fiz para melhorar as linhas finas e dar um 'up' na pele. O resultado foi uma pele muito mais lisa, macia e com um brilho de saúde. Adorei e vou fazer de novo.",
        "rating": 5
      }
    ]
  },
  // Bioestimulador Corporal: OK
  "bioestimulador-corporal": {
    "title": "Bioestimulador de Colágeno Corporal",
    "subtitle": "Firmeza e Combate à Flacidez do Corpo",
    "description": "Tratamento que estimula a produção natural de colágeno em áreas como glúteos, abdômen e braços, combatendo a flacidez e melhorando a celulite.",
    "heroImage": "/images/procedimentos/.corporal/bioestimulador-coporal/gerais/bioestimulador-coporal-1.jpg",
    "category": "Corporal",
    "duration": "60 minutos",
    "sessions": "2 a 4 sessões",
    "results": "Até 24 meses",
    "price": "A partir de R$ 2.500,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.corporal/bioestimulador-coporal/antes-x-depois/bio-coporal-1.png", "alt": "Bioestimulador nos Glúteos Antes e Depois" },
      { "src": "/images/procedimentos/.corporal/bioestimulador-coporal/antes-x-depois/bio-corporal-2.png", "alt": "Resultado Bioestimulador Corporal" },
    ],
    "pricingPackages": [
      {
        "title": "Uma Região Corporal (1 Sessão)",
        "price": "R$ 2.500,00",
        "features": [
          "Avaliação da flacidez e celulite",
          "1 sessão de bioestimulador para uma área (ex: abdômen)",
          "Plano de tratamento personalizado",
          "Orientações de massagem pós-procedimento"
        ]
      },
      {
        "title": "Protocolo corpo durinho (3 Sessões)",
        "price": "R$ 4.900,00",
        "oldPrice": "R$ 5.400,00",
        "features": [
          "3 sessões focadas nos glúteos",
          "Tratamento para firmeza, lifting e celulite",
          "Acompanhamento profissional dos resultados",
          "Melhora do contorno e projeção dos glúteos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Bioestimulador de Colágeno Corporal?",
      "content": "Assim como na face, o bioestimulador de colágeno corporal utiliza substâncias injetáveis para provocar uma reação inflamatória controlada na derme, incentivando as células a produzirem novas fibras de colágeno. No corpo, o tratamento é focado em áreas maiores para combater a flacidez, melhorar a estrutura da pele e suavizar a aparência da celulite.",
      "technology": "Utilizamos os mais potentes bioestimuladores do mercado, como o Ácido Poli-L-Lático (Sculptra®) e a Hidroxiapatita de Cálcio (Radiesse®). Essas substâncias são biocompatíveis e reabsorvíveis, e promovem uma reestruturação da pele de dentro para fora, com resultados naturais e duradouros.",
      "objective": "Restaurar a firmeza da pele, tratar a flacidez em áreas como glúteos, abdômen, coxas e braços, suavizar a aparência da celulite e melhorar a qualidade, a textura e a espessura da pele corporal."
    },
    "treatedAreas": [
      { "name": "Glúteos (Bumbum)", "description": "Para um efeito 'lifting', melhora da firmeza, projeção e tratamento dos 'furinhos' da celulite." },
      { "name": "Abdômen", "description": "Ideal para tratar a flacidez pós-parto ou pós-emagrecimento e a aparência de 'umbigo triste'." },
      { "name": "Braços ('Tchauzinho')", "description": "Combate a flacidez na parte interna dos braços, deixando a pele visivelmente mais firme." },
      { "name": "Coxas (Parte Interna)", "description": "Melhora a firmeza, a sustentação e a textura da pele na face interna das coxas." },
      { "name": "Joelhos", "description": "Trata a pele enrugada e flácida que se acumula acima dos joelhos com o envelhecimento." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas com flacidez corporal de grau leve a moderado",
        "Quem deseja melhorar a aparência da celulite",
        "Mulheres no pós-parto que buscam tratar a flacidez abdominal",
        "Pacientes que passaram por processo de emagrecimento",
        "Quem busca um bumbum mais firme e empinado sem cirurgia"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Doenças autoimunes em atividade",
        "Infecções ou inflamações ativas no local da aplicação",
        "Alergia conhecida aos componentes da fórmula",
        "Tendência à formação de queloides ou cicatrizes hipertróficas"
      ]
    },
    "benefits": [
      "Aumento da firmeza e da sustentação da pele corporal",
      "Redução visível da flacidez e do aspecto 'craquelado'",
      "Suavização significativa da celulite e das irregularidades da pele",
      "Efeito 'lifting' e melhora do contorno dos glúteos",
      "Pele corporal com aparência mais jovem, espessa e tonificada",
      "Resultados naturais, graduais e de longa duração",
      "Estímulo da produção do seu próprio colágeno"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Mapeamento Corporal", "description": "Avaliação do grau de flacidez e celulite, definição das áreas e mapeamento dos pontos de aplicação." },
        { "title": "Preparação do Produto", "description": "O bioestimulador é diluído e preparado momentos antes da aplicação para garantir sua máxima eficácia e segurança." },
        { "title": "Aplicação Estratégica", "description": "O produto é injetado na camada profunda da pele com o uso de microcânulas, que minimizam o desconforto, os hematomas e distribuem o produto de forma eficaz." },
        { "title": "Massagem Pós-Aplicação", "description": "Imediatamente após a aplicação, o profissional realiza uma massagem vigorosa na área para garantir a distribuição uniforme do produto." },
        { "title": "Orientações de Cuidados", "description": "Instruções detalhadas são fornecidas, com ênfase na importância da massagem em casa para otimizar os resultados." }
      ],
      "aftercare": [
        "Massagear a área tratada vigorosamente por 5 minutos, 5 vezes ao dia, durante 5 dias (Regra dos 5x5).",
        "Evitar exercícios físicos de alto impacto por 48 horas.",
        "Não se expor ao sol se houver hematomas para evitar manchas na pele.",
        "É normal sentir a área sensível e notar um leve inchaço ou vermelhidão nos primeiros dias.",
        "Manter uma boa hidratação, bebendo bastante água."
      ]
    },
    "testimonials": [
      {
        "name": "Fernanda Lima",
        "age": 38,
        "text": "Fiz o protocolo Bumbum Up e foi a melhor decisão! A pele está muito mais firme e a celulite diminuiu uns 80%. O resultado é incrível e super natural.",
        "rating": 5
      },
      {
        "name": "Daniela Ribeiro",
        "age": 42,
        "text": "Depois da minha segunda gravidez, a flacidez na barriga me incomodava muito. O bioestimulador devolveu a firmeza que eu achei que tinha perdido para sempre.",
        "rating": 5
      },
      {
        "name": "Sofia Almeida",
        "age": 51,
        "text": "Sempre tive vergonha do 'tchauzinho' nos braços. O tratamento com bioestimulador melhorou muito a flacidez. Agora me sinto muito mais confiante para usar regatas.",
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
  // Preenchimento de Glúteos: OK
  "preenchimento-de-gluteo": {
    "title": "Preenchimento de Glúteos",
    "subtitle": "Volume, Contorno e Projeção Imediatos",
    "description": "Técnica minimamente invasiva que utiliza ácido hialurônico de alta densidade para aumentar o volume, definir o contorno e corrigir imperfeições nos glúteos.",
    "heroImage": "/images/procedimentos/.corporal/preenchimento-de-gluteo/gerais/preenchimento-de-gluteo-1.png",
    "category": "Corporal",
    "duration": "60-90 minutos",
    "sessions": "1 sessão (retoques podem ser necessários)",
    "results": "18-24 meses",
    "price": "Sob Consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.corporal/preenchimento-de-gluteo/antes-x-depois/gluteos-1.jpeg", "alt": "Preenchimento de Glúteos Antes e Depois" },
      { "src": "/images/procedimentos/.corporal/preenchimento-de-gluteo/antes-x-depois/gluteos-2.jpeg", "alt": "Correção de Hip Dips com Preenchimento" },
    ],
    "pricingPackages": [
      {
        "title": "Contorno e Correção de 'Hip Dips'",
        "price": "Sob Consulta",
        "features": [
          "Avaliação 3D da estrutura corporal",
          "Foco em suavizar a depressão trocantérica",
          "Planejamento com volume personalizado",
          "Criação de uma silhueta mais curvilínea"
        ]
      },
      {
        "title": "Volume, Projeção e Efeito 'Lifting'",
        "price": "Sob Consulta",
        "features": [
          "Planejamento para aumento de volume significativo",
          "Uso de ácido hialurônico de alta densidade",
          "Resultado de bumbum mais empinado e arredondado",
          "Acompanhamento premium pós-procedimento"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Preenchimento de Glúteos?",
      "content": "O preenchimento de glúteos é um procedimento não cirúrgico que visa remodelar e aumentar o volume da região utilizando preenchedores corporais. Diferente dos bioestimuladores que tratam a flacidez, o preenchimento tem como principal objetivo a volumização imediata, a correção de assimetrias e a melhora do contorno corporal de forma minimamente invasiva.",
      "technology": "Utilizamos exclusivamente Ácido Hialurônico de alta densidade e reticulação (cross-link), desenvolvido especificamente para contorno corporal. É um material seguro, biocompatível e 100% absorvível pelo organismo, garantindo um resultado natural ao toque e movimento, minimizando riscos associados a preenchedores permanentes.",
      "objective": "Aumentar o volume, melhorar a projeção, corrigir assimetrias e depressões (como as 'hip dips'), e proporcionar um formato de glúteo mais arredondado e empinado, de forma imediata e sem cirurgia."
    },
    "treatedAreas": [
      { "name": "Volume Principal do Glúteo", "description": "Aplicação na região central para aumentar a projeção e o volume geral, criando um efeito 'push-up'." },
      { "name": "Depressão Trocantérica ('Hip Dips')", "description": "Preenchimento das depressões laterais dos quadris para criar uma silhueta mais curvilínea e suave." },
      { "name": "Contorno Superior (Efeito Lifting)", "description": "Aplicação estratégica na parte superior para dar um formato mais arredondado e uma aparência mais empinada." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas que desejam aumentar o volume dos glúteos sem cirurgia plástica",
        "Quem busca corrigir as 'hip dips' e ter um contorno mais arredondado",
        "Pacientes com glúteos achatados, com pouco volume ou assimetrias",
        "Quem deseja resultados rápidos e com uma recuperação mais simples que a cirúrgica"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Doenças autoimunes ou inflamatórias em atividade",
        "Grande flacidez de pele na região (pode necessitar de tratamentos combinados)",
        "Pacientes com implantes de silicone ou PMMA na região",
        "Infecção ativa no local da aplicação"
      ]
    },
    "benefits": [
      "Aumento de volume e projeção imediatos",
      "Melhora do contorno e da forma dos glúteos",
      "Correção da depressão trocantérica ('hip dips')",
      "Procedimento minimamente invasivo, sem cortes ou cicatrizes",
      "Resultados naturais ao toque e ao movimento",
      "Recuperação mais rápida em comparação com a cirurgia de prótese",
      "Realizado em consultório com anestesia local"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Planejamento 3D", "description": "Avaliação detalhada da anatomia, simulação de resultados e planejamento preciso da quantidade e dos pontos de aplicação." },
        { "title": "Assepsia e Anestesia", "description": "Limpeza rigorosa da área e aplicação de anestesia local injetável para garantir um procedimento totalmente confortável e indolor." },
        { "title": "Aplicação com Microcânula", "description": "O ácido hialurônico é injetado de forma segura nas camadas de gordura através de uma microcânula, que não corta os tecidos, minimizando traumas e hematomas." },
        { "title": "Modelagem e Simetria", "description": "O profissional modela o produto manualmente após a aplicação para garantir um contorno suave, natural e perfeitamente simétrico." },
        { "title": "Orientações de Cuidado", "description": "Instruções detalhadas sobre o que fazer e evitar nos dias seguintes para garantir a melhor cicatrização e resultado." }
      ],
      "aftercare": [
        "Evitar sentar diretamente sobre a área tratada por 48 a 72 horas.",
        "Não realizar exercícios físicos, especialmente para pernas e glúteos, por 7 a 14 dias.",
        "Dormir de bruços ou de lado nas primeiras noites para evitar pressão na área.",
        "Pode haver inchaço, dor moderada e hematomas na região, que regridem gradualmente.",
        "Evitar massagens vigorosas ou outros procedimentos estéticos na área por pelo menos 30 dias.",
        "Usar roupas confortáveis e não compressivas nos primeiros dias."
      ]
    },
    "testimonials": [
      {
        "name": "Isabela Martins",
        "age": 32,
        "text": "Sempre fui magra e minhas 'hip dips' me incomodavam muito. O preenchimento resolveu isso em uma sessão! Meu corpo ficou com um contorno muito mais bonito. Estou radiante!",
        "rating": 5
      },
      {
        "name": "Juliana Paiva",
        "age": 28,
        "text": "Eu queria mais volume no bumbum, mas tinha pavor de cirurgia. O preenchimento foi a solução perfeita. O resultado ficou super natural, ninguém diz que não é meu.",
        "rating": 5
      },
      {
        "name": "Carolina Ferraz",
        "age": 39,
        "text": "O procedimento foi muito mais tranquilo do que eu imaginava. O resultado de volume e projeção foi imediato. Minha autoestima mudou completamente. Valeu cada centavo.",
        "rating": 5
      }
    ]
  },
  // Enzimas para gordura localizada: OK
  "enzimas-para-gordura-localizada": {
    "title": "Enzimas para Gordura Localizada",
    "subtitle": "Redução de Medidas sem Cirurgia",
    "description": "Aplicação de enzimas lipolíticas para quebrar as células de gordura em áreas como abdômen, flancos e culotes, ajudando a reduzir medidas e a modelar o corpo.",
    "heroImage": "/images/procedimentos/.corporal/gordura-localizada/gerais/gordura-localizada-1.jpg",
    "category": "Corporal",
    "duration": "30-40 minutos",
    "sessions": "5 a 10 sessões",
    "results": "Progressivos ao longo das sessões",
    "price": "A partir de R$ 389,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-1.png", "alt": "Redução de Gordura Localizada no Abdômen - Antes e Depois 1" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-2.png", "alt": "Resultados Visíveis de Gordura no Abdômen - Antes e Depois 2" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-3.jpeg", "alt": "Transformação na Gordura Abdominal com Enzimas - Antes e Depois 3" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-4.png", "alt": "Gordura Localizada Diminuída no Abdômen - Antes e Depois 4" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-5.png", "alt": "Melhora Visível na Região Abdominal - Antes e Depois 5" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-6.png", "alt": "Resultados de Enzimas para Gordura no Abdômen - Antes e Depois 6" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-7.png", "alt": "Redução Abdominal Natural - Antes e Depois 7" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-8.png", "alt": "Transformação Visível da Gordura Localizada - Antes e Depois 8" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-9.png", "alt": "Resultados Reais de Gordura no Abdômen - Antes e Depois 9" },
      { "src": "/images/procedimentos/.corporal/gordura-localizada/antes-x-depois/gordura-localizada-10.png", "alt": "Melhora na Gordura Localizada Abdominal - Antes e Depois 10" }

    ],
    "pricingPackages": [
      {
        "title": "Sessão Individual (Uma Área)",
        "price": "R$ 389,00",
        "features": [
          "Avaliação corporal e de medidas",
          "1 sessão de aplicação de enzimas",
          "Foco em uma área específica (ex: abdômen)",
          "Orientações de cuidado pós-procedimento"
        ]
      },
      {
        "title": "Protocolo Redux (5 Sessões)",
        "price": "R$ 1.750,00",
        "oldPrice": "R$ 1.945,00",
        "features": [
          "5 sessões de aplicação de enzimas",
          "Tratamento para até duas áreas por visita",
          "Acompanhamento profissional da redução de medidas",
          "Potencialização dos resultados"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que são as Enzimas para Gordura Localizada?",
      "content": "Também conhecida como Mesoterapia ou Lipo Enzimática, é uma técnica que consiste na aplicação de injeções com uma mescla de enzimas e ativos lipolíticos diretamente na camada de gordura. Essas substâncias aceleram o metabolismo local, promovem a quebra das moléculas de gordura (lipólise) e facilitam sua eliminação pelo sistema linfático do corpo.",
      "technology": "Utilizamos mesclas de ativos e enzimas de alta performance, com substâncias como Fosfatidilcolina, L-Carnitina, Cafeína e Silício Orgânico, que agem sinergicamente para otimizar a quebra da gordura e melhorar a qualidade da pele na região tratada. Cada mescla é selecionada de acordo com a avaliação individual do paciente.",
      "objective": "Reduzir a gordura localizada em pequenas áreas, diminuir medidas, melhorar o contorno corporal e tratar aquelas gordurinhas persistentes que não saem facilmente com dieta e exercícios."
    },
    "treatedAreas": [
      { "name": "Abdômen Inferior ('Pochete')", "description": "Para reduzir o volume de gordura abaixo do umbigo, uma das queixas mais comuns." },
      { "name": "Flancos ('Pneuzinhos')", "description": "Modela a cintura, reduzindo a gordura nas laterais do tronco." },
      { "name": "Culotes", "description": "Trata o acúmulo de gordura na lateral externa das coxas, abaixo dos glúteos." },
      { "name": "Gordura do Sutiã ('Bra Fat')", "description": "Reduz a gordura localizada nas costas, próxima às axilas, que marca na roupa." },
      { "name": "Parte Interna das Coxas", "description": "Diminui a gordura e o atrito entre as coxas." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas próximas ao seu peso ideal, mas com acúmulos de gordura localizada",
        "Quem busca uma alternativa não cirúrgica para a lipoaspiração",
        "Pacientes que desejam reduzir medidas em áreas específicas e difíceis de eliminar",
        "Pessoas com um estilo de vida saudável que buscam otimizar seus resultados"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Alergia a qualquer um dos componentes da mescla (ex: frutos do mar)",
        "Obesidade (o tratamento é para gordura localizada, não para emagrecimento geral)",
        "Doenças hepáticas ou renais graves",
        "Doenças de pele ativas na área a ser tratada"
      ]
    },
    "benefits": [
      "Redução de medidas e da gordura localizada",
      "Melhora do contorno corporal",
      "Procedimento minimamente invasivo, sem cortes e sem cirurgia",
      "Não requer tempo de recuperação prolongado, permitindo retorno rápido às atividades",
      "Resultados visíveis e progressivos ao longo do tratamento",
      "Pode ser associado a outros tratamentos estéticos para potencializar os resultados"
    ],
    "howWorks": {
      "steps": [
        { "title": "Consulta e Medidas", "description": "Avaliação corporal detalhada, medição da prega de gordura e marcação dos pontos de aplicação." },
        { "title": "Assepsia da Pele", "description": "Limpeza rigorosa e higienização da área a ser tratada para garantir a segurança." },
        { "title": "Aplicação da Mescla", "description": "Com uma agulha muito fina, o profissional realiza múltiplas injeções superficiais do coquetel de enzimas diretamente no tecido adiposo." },
        { "title": "Massagem Leve", "description": "Uma massagem suave pode ser realizada pelo profissional para ajudar a dispersar o produto na área." },
        { "title": "Orientações Pós-procedimento", "description": "Recomendações de cuidados para os dias seguintes, visando otimizar a ação das enzimas." }
      ],
      "aftercare": [
        "É comum o aparecimento de hematomas (roxos), inchaço e sensibilidade na área tratada.",
        "Evitar exposição solar na área enquanto houver hematomas para prevenir manchas na pele.",
        "Não praticar exercícios físicos intensos por 24 a 48 horas após a aplicação.",
        "Manter uma dieta equilibrada e beber bastante água para auxiliar o corpo a eliminar a gordura metabolizada.",
        "Sessões de drenagem linfática podem ser recomendadas para acelerar a eliminação de líquidos e os resultados."
      ]
    },
    "testimonials": [
      {
        "name": "Mariana Campos",
        "age": 34,
        "text": "A gordurinha da minha barriga (pochete) não saía por nada! Com as sessões de enzimas, eu vi uma redução muito boa. Minhas calças estão servindo bem melhor!",
        "rating": 5
      },
      {
        "name": "Carlos Eduardo",
        "age": 40,
        "text": "Fiz para os flancos e o resultado foi ótimo. Diminuiu bastante aquela gordura lateral que marcava na camisa. O procedimento é rápido e valeu a pena.",
        "rating": 5
      },
      {
        "name": "Beatriz Lima",
        "age": 29,
        "text": "Eu estava incomodada com a gordurinha do sutiã. As aplicações de enzimas foram a solução perfeita, sem precisar de nada invasivo. Estou muito mais feliz com meu corpo.",
        "rating": 5
      }
    ]
  },

  // Massagem Relaxante: OK
  "massagem-relaxante": {
    "title": "Massagem Relaxante",
    "subtitle": "Alívio para o Corpo e a Mente",
    "description": "Uma experiência de bem-estar que utiliza movimentos suaves e rítmicos para aliviar a tensão muscular, reduzir o estresse e promover um profundo estado de relaxamento.",
    "heroImage": "/images/procedimentos/.corporal/massagem-relaxante/gerais/massagem-relaxante-1.png",
    "category": "Corporal",
    "duration": "A partir de 60 minutos",
    "sessions": "Sessão única ou pacotes",
    "results": "Bem-estar e alívio imediatos",
    "price": "A partir de R$ 199,90",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.corporal/massagem-relaxante/antes-x-depois/massagem-relaxante-1.jpg", "alt": "Ambiente de Massagem Relaxante" },
      { "src": "/images/procedimentos/.corporal/massagem-relaxante/antes-x-depois/massagem-relaxante-2.jpg", "alt": "Técnica de Massagem nas Costas" },
      { "src": "/images/procedimentos/.corporal/massagem-relaxante/antes-x-depois/massagem-relaxante-3.jpg", "alt": "Cliente em estado de relaxamento pós-massagem" }
    ],
    "pricingPackages": [
      {
        "title": "Massagem Relaxante (60 Minutos)",
        "price": "R$ 199,90",
        "features": [
          "Foco em corpo inteiro",
          "Alívio de tensões gerais do dia a dia",
          "Uso de óleos essenciais aromáticos",
          "Ideal para uma pausa revigorante"
        ]
      },
      {
        "title": "Experiência Premium (90 Minutos)",
        "price": "R$ 279,90",
        "features": [
          "Massagem corporal completa e prolongada",
          "Foco extra em áreas de maior tensão (costas, pescoço)",
          "Inclui escalda-pés de boas-vindas",
          "Promove um estado de relaxamento profundo"
        ],
        "popular": true
      },
      {
        "title": "Pacote Bem-Estar (4 Sessões de 60 Min)",
        "price": "R$ 720,00",
        "oldPrice": "R$ 799,60",
        "features": [
          "Ideal para manutenção contínua do bem-estar",
          "Desconto especial no pacote",
          "Agendamento flexível das sessões",
          "Combate ao estresse crônico"
        ]
      }
    ],
    "whatIs": {
      "title": "O que é a Massagem Relaxante?",
      "content": "A massagem relaxante é uma terapia manual focada em proporcionar bem-estar físico e mental. Através de manobras terapêuticas como deslizamento, amassamento e fricções suaves a moderadas, ela age diretamente sobre a musculatura, aliviando tensões, melhorando a circulação e promovendo uma profunda sensação de calma e tranquilidade.",
      "technology": "Nossos terapeutas utilizam uma combinação de técnicas clássicas da massoterapia, enriquecidas com os princípios da aromaterapia. Empregamos óleos vegetais puros e óleos essenciais selecionados para suas propriedades terapêuticas, em um ambiente climatizado com música suave para um relaxamento completo dos sentidos.",
      "objective": "Proporcionar alívio imediato do estresse e da tensão muscular, melhorar a qualidade do sono, reequilibrar as energias do corpo e da mente, e promover uma sensação profunda e duradoura de paz e bem-estar."
    },
    "treatedAreas": [
      { "name": "Costas, Pescoço e Ombros", "description": "Foco principal nas áreas que mais acumulam tensão devido à postura e ao estresse diário." },
      { "name": "Pernas e Pés", "description": "Alivia o cansaço, melhora a circulação de retorno e promove uma deliciosa sensação de leveza." },
      { "name": "Braços e Mãos", "description": "Relaxa a musculatura frequentemente tensionada por movimentos repetitivos e uso de eletrônicos." },
      { "name": "Corpo Inteiro", "description": "Uma abordagem holística que integra todo o corpo para um relaxamento completo e profundo." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas que sofrem com estresse, ansiedade e fadiga mental",
        "Quem possui dores e tensões musculares causadas por má postura ou esforço",
        "Indivíduos com dificuldade para dormir ou insônia",
        "Quem busca um momento de autocuidado, para relaxar e se reconectar",
        "Pessoas que passam longas horas sentadas ou em posições repetitivas"
      ],
      "contraindications": [
        "Febre, gripes ou infecções ativas",
        "Fraturas, lesões agudas ou inflamações locais",
        "Trombose venosa profunda (TVP)",
        "Certas condições de pele (feridas abertas, dermatites) na área a ser massageada",
        "Gravidez nos primeiros 3 meses (requer técnica e autorização específicas)"
      ]
    },
    "benefits": [
      "Redução drástica do estresse e da ansiedade",
      "Alívio eficaz de dores e tensões musculares",
      "Melhora da circulação sanguínea e linfática",
      "Aumento da flexibilidade e da mobilidade corporal",
      "Melhora significativa da qualidade do sono",
      "Liberação de endorfinas, os hormônios do bem-estar",
      "Sensação de tranquilidade, clareza mental e reequilíbrio energético"
    ],
    "howWorks": {
      "steps": [
        { "title": "Recepção e Anamnese", "description": "Uma breve e confidencial conversa para entender suas necessidades, áreas de maior tensão e possíveis contraindicações." },
        { "title": "Preparação do Ambiente", "description": "Você é conduzido a uma sala privativa, climatizada, com iluminação suave, música relaxante e aromaterapia personalizada." },
        { "title": "Início da Experiência", "description": "O terapeuta inicia com movimentos suaves para aquecer a musculatura, utilizando óleos ou cremes aquecidos para maior conforto." },
        { "title": "Técnicas de Relaxamento", "description": "Aplicação de manobras de deslizamento, amassamento e pressão nos pontos de tensão, trabalhando todo o corpo de forma fluida e harmoniosa." },
        { "title": "Finalização e Despertar", "description": "Os movimentos se tornam mais leves, e você terá um momento para despertar tranquilamente, desfrutando da sensação de leveza e paz." }
      ],
      "aftercare": [
        "Beba bastante água nas horas seguintes para ajudar a eliminar as toxinas liberadas durante a massagem.",
        "Tente manter um estado de relaxamento, evitando atividades estressantes ou exercícios intensos logo após a sessão.",
        "Um banho morno antes de dormir pode prolongar a sensação de bem-estar.",
        "É normal sentir-se muito relaxado ou até um pouco sonolento; permita-se descansar.",
        "Preste atenção à sua postura nos dias seguintes para manter os benefícios."
      ]
    },
    "testimonials": [
      {
        "name": "Ana Carolina",
        "age": 35,
        "text": "A melhor massagem que já fiz! Saí de lá flutuando. O ambiente é perfeito e a terapeuta conseguiu aliviar toda a tensão do meu pescoço. Essencial para quem trabalha no computador.",
        "rating": 5
      },
      {
        "name": "Ricardo Alves",
        "age": 42,
        "text": "Eu estava com muitas dores nas costas por causa do estresse. A massagem foi um santo remédio. Aliviou a dor e me ajudou a dormir muito melhor naquela noite. Recomendo!",
        "rating": 5
      },
      {
        "name": "Mariana Lopes",
        "age": 29,
        "text": "Eu me dei de presente a 'Experiência Premium' e foi incrível. O escalda-pés no início já te deixa relaxada. É um cuidado completo, saí de lá renovada. Vale cada centavo.",
        "rating": 5
      }
    ]
  },
  // Massagem Modeladora: OK
    "massagem-modeladora": {
    "title": "Massagem Modeladora",
    "subtitle": "Contorno Corporal e Redução de Medidas",
    "description": "Técnica de massagem vigorosa e profunda, focada em remodelar o contorno corporal, reduzir medidas e amenizar a aparência da celulite.",
    "heroImage": "/images/procedimentos/massagem-modeladora/gerais/modeladora-1.png",
    "category": "Corporal",
    "duration": "50-60 minutos",
    "sessions": "Protocolo de 10 sessões",
    "results": "Visíveis após a 3ª ou 4ª sessão",
    "price": "A partir de R$ 220,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/massagem-modeladora/antes-x-depois/modeladora-abdomen-1.png", "alt": "Massagem Modeladora no Abdômen Antes e Depois" },
      { "src": "/images/procedimentos/massagem-modeladora/antes-x-depois/modeladora-coxas-1.png", "alt": "Resultado da Modeladora para Celulite" },
      { "src": "/images/procedimentos/massagem-modeladora/antes-x-depois/modeladora-flancos-1.png", "alt": "Antes e Depois Massagem Modeladora nos Flancos" }
    ],
    "pricingPackages": [
      {
        "title": "Sessão Avulsa",
        "price": "R$ 199,00",
        "features": [
          "Foco em uma ou duas áreas do corpo",
          "Ideal para experimentar os benefícios",
          "Uso de cremes com ativos redutores",
          "Avaliação corporal inicial"
        ]
      },
      {
        "title": "Protocolo Redux (10 Sessões)",
        "price": "R$ 1.700,00",
        "oldPrice": "R$ 1.990,00",
        "features": [
          "Tratamento corporal completo e contínuo",
          "Foco em redução de medidas e celulite",
          "Acompanhamento de resultados com fotos/medidas",
          "Potencializa a definição do contorno corporal",
          "Desconto especial no pacote"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é a Massagem Modeladora?",
      "content": "A Massagem Modeladora é uma técnica que utiliza manobras manuais rápidas, firmes e repetitivas, aplicadas com pressão sobre o corpo. O objetivo principal é atuar sobre a gordura localizada, a celulite e a retenção de líquidos, auxiliando na remodelagem da silhueta. Diferente da massagem relaxante, seu foco é totalmente estético e os resultados são progressivos.",
      "technology": "Nossos terapeutas são especializados em manobras de amassamento, pinçamento e deslizamento profundo. O tratamento é potencializado com o uso de dermocosméticos de alta performance, ricos em ativos lipolíticos e termogênicos (como cafeína, centella asiatica e pimenta negra), que estimulam o metabolismo local e a quebra das células de gordura.",
      "objective": "Reduzir medidas, modelar o contorno do corpo, amenizar a aparência da celulite (casca de laranja), melhorar a circulação sanguínea local e auxiliar na eliminação de toxinas e líquidos retidos."
    },
    "treatedAreas": [
      { "name": "Abdômen e Cintura", "description": "Para afinar a cintura, reduzir a gordura abdominal e melhorar a definição." },
      { "name": "Glúteos e Coxas", "description": "Trata a celulite, modela o culote e ajuda a firmar a região." },
      { "name": "Flancos e Costas", "description": "Para reduzir os 'pneuzinhos' e a gordura localizada abaixo da linha do sutiã." },
      { "name": "Braços", "description": "Auxilia na redução de medidas e na melhora do contorno dos braços, combatendo a gordura localizada." }
    ],
    "forWho": {
      "ideal": [
        "Pessoas que desejam reduzir medidas e gordura localizada",
        "Quem busca melhorar o contorno corporal e afinar a silhueta",
        "Indivíduos com celulite de graus I, II e III",
        "Quem tem retenção de líquidos associada à gordura localizada",
        "Pessoas que buscam potencializar os resultados de dietas e atividades físicas"
      ],
      "contraindications": [
        "Gravidez",
        "Hipertensão e cardiopatias descompensadas",
        "Febre ou processos infecciosos/inflamatórios",
        "Trombose, varizes de grande calibre e fragilidade capilar excessiva",
        "Lesões ou dermatites na pele da área a ser tratada"
      ]
    },
    "benefits": [
      "Redução de medidas e da gordura localizada",
      "Melhora visível da aparência da celulite",
      "Corpo mais modelado e com contornos definidos",
      "Aumento da circulação sanguínea e da oxigenação local",
      "Pele com aparência mais lisa e tonificada",
      "Auxilia na eliminação de toxinas e líquidos retidos",
      "Melhora da função intestinal (quando aplicada no abdômen)"
    ],
    "howWorks": {
      "steps": [
        { "title": "Avaliação Corporal", "description": "Análise das áreas a serem tratadas, medição, fotos e definição dos objetivos do protocolo." },
        { "title": "Aplicação do Creme Ativo", "description": "A pele é preparada com um creme dermocosmético com princípios ativos que facilitam o deslizamento e potencializam a quebra da gordura." },
        { "title": "Início das Manobras", "description": "O terapeuta inicia com movimentos de aquecimento para preparar a musculatura e ativar a circulação na área." },
        { "title": "Massagem Vigorosa e Profunda", "description": "Aplicação das manobras características (amassamento, pinçamento) com ritmo e pressão intensos, focando nas áreas de maior acúmulo de gordura e celulite." },
        { "title": "Finalização", "description": "Os movimentos podem ser finalizados com manobras de deslizamento longas para auxiliar na drenagem dos líquidos e toxinas mobilizados." }
      ],
      "aftercare": [
        "Beber bastante água para ajudar o corpo a eliminar as toxinas e a gordura metabolizada.",
        "É normal a pele ficar avermelhada e quente (hiperemia) após a sessão, o que indica a ativação da circulação.",
        "Pequenos hematomas podem surgir, especialmente nas primeiras sessões, devido à intensidade das manobras.",
        "Manter uma alimentação equilibrada e praticar atividade física é fundamental para manter e potencializar os resultados.",
        "Evitar o consumo de alimentos ricos em açúcar, sódio e gordura logo após a sessão."
      ]
    },
    "testimonials": [
      {
        "name": "Beatriz Santos",
        "age": 31,
        "text": "Fiz o pacote de 10 sessões para o abdômen e flancos e o resultado foi surpreendente! Perdi centímetros na cintura e meu corpo ficou muito mais modelado. Super recomendo!",
        "rating": 5
      },
      {
        "name": "Daniela Costa",
        "age": 38,
        "text": "A massagem modeladora melhorou muito a celulite que eu tinha nas coxas e no bumbum. A pele está visivelmente mais lisa. É um tratamento intenso, mas que realmente funciona.",
        "rating": 5
      },
      {
        "name": "Renata Almeida",
        "age": 29,
        "text": "Malho e me alimento bem, mas tinha uma gordurinha na barriga que não saía. A modeladora foi o que faltava para dar o toque final e definir o contorno. Adorei o resultado!",
        "rating": 5
      }
    ]
  },
    // Ultraformer: OK
    "ultraformer": {
    "title": "Ultraformer",
    "subtitle": "Lifting Facial e Corporal sem Cirurgia",
    "description": "Tecnologia de ultrassom micro e macrofocado que promove efeito lifting, estímulo de colágeno e redução de gordura localizada, sem cortes ou tempo de recuperação.",
    "heroImage": "/images/categorias/não-invasivo-1.png",
    "category": "Facial e Corporal",
    "duration": "30-60 minutos",
    "sessions": "Variável ",
    "results": "Progressivos de 8-12 meses",
    "price": "Sob consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.nao-invasivo/ultraformer/ultraformer-1.jpeg", "alt": "Ultraformer Resultado Pescoço" },
      { "src": "/images/procedimentos//.nao-invasivo/ultraformer/ultraformer-2.jpeg", "alt": "Ultraformer Antes e Depois Rosto" },
    ],
    "pricingPackages": [
      {
        "title": "Ultraformer",
        "price": "Sob consulta",
        "features": [
          "Full Face, Pescoço, abdômen, braços, flancos, culote e coxas",
          "Redução de gordura localizada e flacidez",
          "Protocolo personalizado conforme objetivo",
          "Sessões sob demanda"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Ultraformer?",
      "content": "O Ultraformer é um equipamento de ultrassom micro e macrofocado que atua nas camadas mais profundas da pele e do tecido adiposo, promovendo lifting sem cortes, estímulo intenso de colágeno e melhora da firmeza da pele.",
      "technology": "Tecnologia avançada de ultrassom microfocado (HIFU) para rejuvenescimento facial e macrofocado para redução de gordura localizada.",
      "objective": "Promover efeito lifting imediato e progressivo, melhorar a firmeza da pele e reduzir gordura localizada de forma não invasiva."
    },
    "forWho": {
      "ideal": [
        "Pessoas com flacidez facial ou corporal",
        "Quem busca efeito lifting sem cirurgia",
        "Pacientes com papada ou contorno facial indefinido",
        "Quem deseja reduzir gordura localizada em regiões específicas",
        "Homens e mulheres a partir dos 30 anos"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área tratada",
        "Uso de marcapasso ou próteses metálicas na região",
        "Doenças de pele não controladas",
        "Pacientes com implantes de colágeno recentes"
      ]
    },
    "benefits": [
      "Efeito lifting imediato e progressivo",
      "Estimula a produção natural de colágeno",
      "Reduz flacidez da pele facial e corporal",
      "Define o contorno facial",
      "Melhora a papada e a linha da mandíbula",
      "Reduz gordura localizada em regiões específicas",
      "Procedimento não invasivo, sem cortes",
      "Não exige tempo de recuperação"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Consulta e Avaliação",
          "description": "Análise detalhada da região a ser tratada e definição do protocolo personalizado."
        },
        {
          "title": "Preparação",
          "description": "Higienização da pele e marcação das áreas estratégicas para aplicação."
        },
        {
          "title": "Aplicação",
          "description": "O ultrassom micro e macrofocado é aplicado nas camadas profundas da pele, estimulando colágeno e reduzindo gordura."
        },
        {
          "title": "Finalização",
          "description": "Cuidados pós-procedimento e liberação imediata para retorno às atividades normais."
        }
      ],
      "aftercare": [
        "Pode haver leve vermelhidão ou sensibilidade temporária",
        "Evitar exposição solar intensa por 48h",
        "Usar protetor solar diariamente",
        "Manter hidratação adequada da pele",
        "Seguir o protocolo recomendado pelo especialista"
      ]
    },
    "testimonials": [
      {
        "name": "Fernanda Oliveira",
        "age": 42,
        "text": "Fiz Ultraformer no rosto e pescoço e os resultados foram surpreendentes. Minha pele está muito mais firme e jovem.",
        "rating": 5
      },
      {
        "name": "Ricardo Almeida",
        "age": 38,
        "text": "O Ultraformer ajudou a reduzir minha papada sem precisar de cirurgia. Estou muito satisfeito com o resultado.",
        "rating": 5
      },
      {
        "name": "Juliana Pereira",
        "age": 47,
        "text": "Fiz Ultraformer no abdômen e realmente senti diferença na firmeza da pele. Valeu cada sessão!",
        "rating": 5
      }
    ]
  }, 

    // Laser Lavieen: OK
    "lavieen": {
    "title": "Laser Lavieen",
    "subtitle": "Laser de Thulium para Rejuvenescimento e Uniformização da Pele",
    "description": "Tratamento a laser de última geração que promove melhora da textura, clareamento de manchas, redução de poros e estímulo de colágeno, com mínima recuperação.",
    "heroImage": "/images/procedimentos/.nao-invasivo/lavieen/gerais/laser-lavieen-1.png",
    "category": "Facial",
    "duration": "20-40 minutos",
    "sessions": "Variável",
    "results": "8-12 meses",
    "price": "Sob consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.nao-invasivo/lavieen/antes-x-depois/lavieen-1.jpg", "alt": "Lavieen Antes e Depois - Rejuvenescimento" },
      { "src": "/images/procedimentos/.nao-invasivo/lavieen/antes-x-depois/lavieen-2.jpg", "alt": "Lavieen Antes e Depois - Clareamento" },
    ],
    "pricingPackages": [
      {
        "title": "Laser Lavieen",
        "price": "Sob consulta",
        "features": [
          "Tratamento facial completo",
          "Pescoço e colo",
          "Aplicação em áreas específicas (mãos, braços, estrias)",
          "Clareamento e rejuvenescimento localizado",
          "Protocolo personalizado",
          "Resultados progressivos"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Lavieen?",
      "content": "O Lavieen é um laser de Thulium fracionado que atua na renovação da pele de forma segura e eficaz, proporcionando clareamento de manchas, rejuvenescimento, estímulo de colágeno e melhora da textura cutânea.",
      "technology": "Tecnologia avançada de Laser Thulium fracionado, que age de forma precisa, controlada e segura, com mínima recuperação.",
      "objective": "Tratar melasma, manchas, poros dilatados, cicatrizes, linhas finas e proporcionar rejuvenescimento global da pele."
    },
    "forWho": {
      "ideal": [
        "Pessoas com melasma ou manchas de sol",
        "Quem apresenta poros dilatados e textura irregular da pele",
        "Pacientes com sinais de envelhecimento (linhas finas e rugas superficiais)",
        "Quem busca estímulo de colágeno e pele mais firme",
        "Pessoas que desejam rejuvenescimento facial sem downtime prolongado"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ou lesões ativas na pele",
        "Uso de isotretinoína recente",
        "Doenças autoimunes não controladas",
        "Peles muito bronzeadas no momento da aplicação"
      ]
    },
    "benefits": [
      "Clareamento de manchas e melasma",
      "Melhora da textura e uniformidade da pele",
      "Redução de poros dilatados",
      "Estímulo de colágeno e firmeza cutânea",
      "Suavização de linhas finas",
      "Rejuvenescimento global da pele",
      "Recuperação rápida em comparação a lasers tradicionais",
      "Resultados naturais e progressivos"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Consulta e Avaliação",
          "description": "Análise detalhada da pele e indicação do protocolo adequado para cada necessidade."
        },
        {
          "title": "Preparação",
          "description": "Limpeza da pele e aplicação de anestésico tópico para maior conforto."
        },
        {
          "title": "Aplicação",
          "description": "O laser de Thulium fracionado é aplicado de forma precisa, atingindo camadas superficiais e profundas da pele."
        },
        {
          "title": "Finalização",
          "description": "Aplicação de produtos calmantes e orientações para cuidados pós-procedimento."
        }
      ],
      "aftercare": [
        "Vermelhidão e leve descamação podem ocorrer nos primeiros dias",
        "Evitar exposição solar direta até recuperação total",
        "Usar protetor solar de alto fator diariamente",
        "Manter hidratação intensa da pele",
        "Não utilizar ácidos ou ativos irritantes até liberação médica"
      ]
    },
    "testimonials": [
      {
        "name": "Mariana Souza",
        "age": 36,
        "text": "O Lavieen clareou meu melasma e deixou minha pele muito mais uniforme e iluminada. Estou apaixonada!",
        "rating": 5
      },
      {
        "name": "Paulo Henrique",
        "age": 44,
        "text": "Fiz Lavieen para poros e textura, e os resultados foram incríveis. Minha pele parece mais jovem e saudável.",
        "rating": 5
      },
      {
        "name": "Cláudia Ramos",
        "age": 52,
        "text": "Além de clarear manchas, senti minha pele mais firme e rejuvenescida. Procedimento rápido e eficaz.",
        "rating": 5
      }
    ]
  },
    // Criolipólise: OK
    "criolipolise": {
    "title": "Criolipólise de Placas",
    "subtitle": "Redução de Gordura Localizada sem Cirurgia",
    "description": "Tecnologia avançada que elimina até 25% da gordura localizada por sessão, utilizando placas de resfriamento controlado, sem sucção e com muito mais conforto.",
    "heroImage": "/images/procedimentos/.nao-invasivo/criolipolise/gerais/criolipolis-1.png",
    "category": "Corporal",
    "duration": "40-60 minutos",
    "sessions": "Variável",
    "results": "12 meses",
    "price": "Sob consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/criolipolise/antes-depois/CRIO-PLACAS-1.png", "alt": "Criolipólise Placas Antes e Depois Abdômen" },
      { "src": "/images/procedimentos/criolipolise/antes-depois/CRIO-PLACAS-2.png", "alt": "Criolipólise Placas Antes e Depois Flancos" },
      { "src": "/images/procedimentos/criolipolise/antes-depois/CRIO-PLACAS-3.png", "alt": "Criolipólise Placas Antes e Depois Coxas" }
    ],
    "pricingPackages": [
    {
      "title": "Protocolo de Remodelação Corporal Completa",
      "price": "Sob Consulta",
      "features": [
        "Planejamento 360° com Mapeamento Corporal Detalhado",
        "Tratamento personalizado para múltiplas áreas à sua escolha:",
        "Abdômen (superior e   inferior)",
        "Flancos ('pneuzinhos')",
        "Culote",
        "Parte interna das coxas",
        "Gordura das costas ('sutiã')",
        "Braços e Papada"

      ],
      "popular": true
    }
    ],
    "whatIs": {
      "title": "O que é a Criolipólise de Placas?",
      "content": "A criolipólise de placas é um tratamento não invasivo que utiliza resfriamento controlado para eliminar células de gordura. Diferente da criolipólise tradicional, não utiliza sucção, garantindo mais conforto e permitindo tratar áreas maiores de forma homogênea.",
      "technology": "Tecnologia de resfriamento por placas planas, com controle preciso de temperatura, eliminando adipócitos de forma seletiva e segura.",
      "objective": "Reduzir gordura localizada em diferentes regiões do corpo, melhorar o contorno corporal e proporcionar resultados visíveis e naturais sem cirurgia."
    },
    "forWho": {
      "ideal": [
        "Pessoas com gordura localizada resistente a dieta e exercícios",
        "Quem busca redução de medidas sem cirurgia",
        "Pacientes com flancos, abdômen, coxas ou braços com excesso de gordura",
        "Homens e mulheres que desejam remodelar o corpo de forma não invasiva"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Doenças relacionadas ao frio (crioglobulinemia, urticária ao frio, etc.)",
        "Hérnias na região de aplicação",
        "Infecções ativas ou feridas na área tratada",
        "Obesidade mórbida (não é tratamento de emagrecimento)"
      ]
    },
    "benefits": [
      "Redução de até 25% da gordura por sessão",
      "Procedimento não invasivo e sem cortes",
      "Maior conforto em comparação à criolipólise tradicional",
      "Possibilidade de tratar áreas maiores e mais homogêneas",
      "Sem necessidade de anestesia ou tempo de recuperação",
      "Resultados progressivos e naturais",
      "Melhora do contorno corporal e da autoestima"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Avaliação Corporal",
          "description": "Identificação das regiões a serem tratadas e definição do protocolo mais adequado."
        },
        {
          "title": "Preparação",
          "description": "Higienização da pele e marcação das áreas de aplicação."
        },
        {
          "title": "Aplicação",
          "description": "As placas de resfriamento são posicionadas sobre a pele, resfriando as células de gordura até sua eliminação natural."
        },
        {
          "title": "Finalização",
          "description": "Remoção das placas e orientações pós-tratamento. O paciente pode retomar suas atividades imediatamente."
        }
      ],
      "aftercare": [
        "Manter hidratação adequada do corpo",
        "Evitar exposição solar intensa na região por 7 dias",
        "Praticar atividade física regularmente",
        "Seguir recomendações nutricionais para potencializar os resultados",
        "Os resultados finais aparecem entre 60 e 90 dias"
      ]
    },
    "testimonials": [
      {
        "name": "Tatiane Lopes",
        "age": 34,
        "text": "Fiz criolipólise de placas no abdômen e amei! Muito confortável e já percebo diferença nas medidas.",
        "rating": 5
      },
      {
        "name": "Eduardo Martins",
        "age": 41,
        "text": "O tratamento foi super tranquilo e reduziu bastante a gordura dos flancos. Recomendo demais.",
        "rating": 5
      },
      {
        "name": "Patrícia Andrade",
        "age": 37,
        "text": "Achei incrível a criolipólise de placas! Sem dor, sem sucção e com resultado visível já no segundo mês.",
        "rating": 5
      }
    ]
  },
    "laser-co2": {
    "title": "Laser CO₂ Fracionado",
    "subtitle": "Renovação Profunda da Pele e Rejuvenescimento",
    "description": "Tratamento a laser que promove renovação celular intensa, melhora rugas, cicatrizes, manchas e flacidez, estimulando colágeno e rejuvenescendo a pele de forma duradoura.",
    "heroImage": "/images/procedimentos/.nao-invasivo/laser-co2/gerais/laser-co2-1.png",
    "category": "Facial",
    "duration": "30-60 minutos",
    "sessions": "Variável",
    "results": "12-24 meses",
    "price": "Sob consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.nao-invasivo/laser-co2/gerais/Screenshot_1.png", "alt": "Laser CO₂ Equipamento" },
    ],
    "pricingPackages": [
      {
        "title": "Rejuvenescimento Avançado com Laser CO2",
        "price": "Sob Consulta",
        "features": [
          "Tratamento Personalizado e Multifuncional para: Rugas profundas, Cicatrizes de acne, Flacidez da pele, Poros dilatados, Manchas e Danos solares.",
          "Aplicação em áreas completas como Rosto, Pescoço e Colo, ou em cicatrizes específicas.",
          "Protocolo Completo para o Rejuvenescimento Intenso e a Renovação Total da Textura da Pele."
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Laser CO₂ Fracionado?",
      "content": "O Laser de CO₂ fracionado é uma das tecnologias mais avançadas para renovação da pele. Ele cria microcolunas de calor controlado na derme e epiderme, estimulando colágeno, promovendo cicatrização e renovação celular.",
      "technology": "Laser ablativo fracionado, que trata profundamente a pele com precisão e segurança, oferecendo resultados significativos em rejuvenescimento.",
      "objective": "Tratar rugas, cicatrizes, manchas, flacidez e melhorar a textura da pele, proporcionando rejuvenescimento profundo e duradouro."
    },
    "forWho": {
      "ideal": [
        "Pessoas com rugas e linhas profundas",
        "Pacientes com cicatrizes de acne",
        "Quem sofre com manchas e melasma resistentes",
        "Indivíduos com flacidez leve a moderada",
        "Quem busca rejuvenescimento profundo da pele"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na pele",
        "Uso recente de isotretinoína",
        "Pele bronzeada no momento da aplicação",
        "Doenças autoimunes não controladas"
      ]
    },
    "benefits": [
      "Redução de rugas e linhas de expressão",
      "Clareamento de manchas e melasma",
      "Melhora significativa em cicatrizes de acne",
      "Estímulo intenso de colágeno",
      "Pele mais firme, uniforme e rejuvenescida",
      "Resultados progressivos e de longa duração",
      "Procedimento seguro e eficaz",
      "Indicado para face e corpo"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Consulta e Avaliação",
          "description": "Análise personalizada da pele para definir intensidade e protocolo do laser."
        },
        {
          "title": "Preparação",
          "description": "Higienização da pele e aplicação de anestésico tópico para maior conforto."
        },
        {
          "title": "Aplicação",
          "description": "O laser CO₂ fracionado é disparado em microcolunas, promovendo renovação da pele em profundidade."
        },
        {
          "title": "Finalização",
          "description": "Aplicação de máscara calmante e recomendações pós-procedimento."
        }
      ],
      "aftercare": [
        "Vermelhidão e descamação nos primeiros dias são esperadas",
        "Evitar sol e sempre usar protetor solar FPS alto",
        "Hidratar a pele constantemente",
        "Evitar maquiagem nos primeiros 2-3 dias",
        "Seguir orientações médicas para acelerar a recuperação"
      ]
    },
    "testimonials": [
      {
        "name": "Luciana Mendes",
        "age": 45,
        "text": "O CO₂ transformou minha pele! Rugas profundas suavizaram e minha pele ganhou vida nova.",
        "rating": 5
      },
      {
        "name": "Roberto Silva",
        "age": 50,
        "text": "Tinha cicatrizes de acne antigas e o CO₂ melhorou muito a textura da minha pele. Valeu o investimento.",
        "rating": 5
      },
      {
        "name": "Fernanda Rocha",
        "age": 39,
        "text": "Já na primeira sessão percebi grande melhora nas manchas e linhas finas. Procedimento incrível!",
        "rating": 5
      }
    ]
  },
    // Depilação a Laser: OK
    "depilacao-a-laser": {
    "title": "Depilação a Laser",
    "subtitle": "Eliminação Duradoura dos Pelos Indesejados",
    "description": "A depilação a laser utiliza tecnologia avançada para destruir o folículo piloso de forma segura e eficaz, proporcionando redução definitiva dos pelos e pele mais lisa.",
    "heroImage": "/images/procedimentos/.nao-invasivo/depilacao-laser/gerais/depilacao-laser-1.png",
    "category": "Corporal e Facial",
    "duration": "10-20 minutos por área",
    "sessions": "Sob consulta",
    "results": "Imediato",
    "price": "Sob consulta",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.nao-invasivo/depilacao-laser/depilacao-laser-2.png", "alt": "Depilação a Laser Antes e Depois Axilas" },
      { "src": "/images/procedimentos/.nao-invasivo/depilacao-laser/depilacao-laser-3.png", "alt": "Depilação a Laser Antes e Depois Pernas" },
      { "src": "/images/procedimentos/.nao-invasivo/depilacao-laser/depilacao-laser-4.png", "alt": "Depilação a Laser Antes e Depois Rosto" }
    ],
    "pricingPackages": [
      {
        "title": "Protocolo Personalizado por Sessão",
        "price": "Sob Consulta",
        "features": [
          "Combinação de Múltiplas Áreas na Mesma Sessão, como:",
          "Virilha completa",
          "Axilas",
          "Meia perna",
          "Buço",
          "Faixa de barba",
          "Peitoral",
          "Costas",  
        ],
      },
      {
        "title": "Protocolo Personalizado por 12 messes",
        "price": "Sob Consulta",
        "features": [
          "Combinação de Múltiplas Áreas na Mesma Sessão, como:",
          "Virilha completa",
          "Axilas",
          "Meia perna",
          "Buço",
          "Faixa de barba",
          "Peitoral",
          "Costas",  
        ],
        "popular": true
      },
    ],
    "whatIs": {
      "title": "O que é a Depilação a Laser?",
      "content": "A depilação a laser é um tratamento estético que utiliza a energia da luz para atingir e eliminar o folículo piloso, reduzindo o crescimento dos pelos de forma progressiva e definitiva.",
      "technology": "Equipamentos de laser de última geração, seguros e eficazes para todos os tipos de pele e diferentes áreas do corpo.",
      "objective": "Eliminar os pelos indesejados, reduzir foliculite e proporcionar uma pele mais lisa e uniforme."
    },
    "forWho": {
      "ideal": [
        "Homens e mulheres que desejam eliminar pelos indesejados",
        "Quem sofre com irritações causadas por cera ou lâmina",
        "Pessoas com pelos encravados ou foliculite",
        "Quem busca praticidade e economia a longo prazo"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Pele bronzeada ou em processo de descamação",
        "Doenças de pele ativas na região",
        "Uso recente de isotretinoína",
        "Fotossensibilidade causada por medicamentos"
      ]
    },
    "benefits": [
      "Redução definitiva de até 90% dos pelos",
      "Adeus pelos encravados e foliculite",
      "Pele mais lisa e uniforme",
      "Tratamento rápido, seguro e eficaz",
      "Economia de tempo e dinheiro a longo prazo",
      "Mais conforto e praticidade no dia a dia"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Avaliação Inicial",
          "description": "Análise da pele e dos pelos para definição do protocolo adequado."
        },
        {
          "title": "Preparação",
          "description": "Higienização da área e ajuste do equipamento de acordo com o fototipo do paciente."
        },
        {
          "title": "Aplicação",
          "description": "O laser é disparado sobre a pele, atingindo os folículos pilosos de forma seletiva."
        },
        {
          "title": "Finalização",
          "description": "Aplicação de loção calmante e orientações de cuidados pós-sessão."
        }
      ],
      "aftercare": [
        "Evitar exposição solar por pelo menos 7 dias",
        "Usar protetor solar diariamente na área tratada",
        "Não arrancar os pelos (somente raspar entre as sessões)",
        "Hidratar bem a pele tratada",
        "Seguir o intervalo recomendado entre as sessões (4 a 8 semanas)"
      ]
    },
    "testimonials": [
      {
        "name": "Juliana Alves",
        "age": 29,
        "text": "Sempre sofri com pelos encravados nas pernas, e a depilação a laser mudou minha vida! Pele lisinha e sem irritações.",
        "rating": 5
      },
      {
        "name": "Carolina Ribeiro",
        "age": 34,
        "text": "Fiz nas axilas e nunca mais precisei me preocupar com lâmina ou cera. Recomendo demais!",
        "rating": 5
      },
      {
        "name": "Rafael Torres",
        "age": 38,
        "text": "Resolvi fazer no peito e costas e o resultado foi incrível. Muito mais prático no dia a dia.",
        "rating": 5
      } 
    ]
  },
  // Limpeza de Pele: OK
  "limpeza-de-pele": {
    "title": "Limpeza de Pele",
    "subtitle": "Higienização Profunda e Renovação Facial",
    "description": "Procedimento estético essencial para remover impurezas, cravos e excesso de oleosidade, promovendo pele limpa, saudável e preparada para outros tratamentos.",
    "heroImage": "/images/procedimentos/.nao-invasivo/limpeza-de-pele/gerais/limpeza-de-pele-1.png",
    "category": "Facial",
    "duration": "30-50 minutos",
    "sessions": "1 sessão (manutenção mensal recomendada)",
    "results": "Imediato",
    "price": "A partir de R$ 199,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/.nao-invasivo/limpeza-de-pele/limpeza-de-pele-2.jpg", "alt": "Limpeza de Pele Antes e Depois 1" },
      { "src": "/images/procedimentos/.nao-invasivo/limpeza-de-pele/limpeza-de-pele-1.png", "alt": "Limpeza de Pele Antes e Depois 2" },
      { "src": "/images/procedimentos/.nao-invasivo/limpeza-de-pele/limpeza-de-pele-3.jpg", "alt": "Limpeza de Pele Antes e Depois 3" }
    ],
    "pricingPackages": [
      {
        "title": "Limpeza de Pele",
        "price": "R$ 199,90",
        "oldPrice": "R$ 279,90",
        "features": [
          "Limpeza profunda com extração de cravos",
          "Máscara calmante e nutritiva",
          "Orientações personalizadas para cuidados diários"
        ]
      },
      {
        "title": "Plano Anual",
        "price": "R$ 1.699,00",
        "oldPrice": "R$ 2.399,00",
        "features": [
          "12 sessões de Limpeza de Pele ao longo do ano",
          "Desconto especial em todos os procedimentos",
          "Acompanhamento personalizado",
          "Brinde exclusivo para clientes do plano"
        ],
        "popular": true
      },
    ],
    "whatIs": {
      "title": "O que é a Limpeza de Pele?",
      "content": "A limpeza de pele é um procedimento estético que remove impurezas, células mortas e excesso de oleosidade da pele, prevenindo acne e proporcionando textura suave e uniforme.",
      "technology": "Utilizamos produtos profissionais específicos para cada tipo de pele, garantindo higienização eficaz e segura.",
      "objective": "Manter a pele limpa, prevenir acne, reduzir oleosidade e preparar a pele para tratamentos complementares."
    },
    "forWho": {
      "ideal": [
        "Pessoas com acne leve a moderada",
        "Quem deseja remover cravos e impurezas",
        "Pele oleosa ou mista que precisa de controle da oleosidade",
        "Indivíduos que desejam revitalizar e hidratar a pele"
      ],
      "contraindications": [
        "Infecções ou feridas abertas na face",
        "Doenças de pele não controladas",
        "Alergia a produtos utilizados no procedimento",
        "Pele muito sensível ou com queimaduras recentes"
      ]
    },
    "benefits": [
      "Remoção de cravos e impurezas",
      "Controle da oleosidade",
      "Prevenção da acne",
      "Melhora da textura e aparência da pele",
      "Hidratação e nutrição facial",
      "Pele mais saudável e uniforme",
      "Preparação da pele para outros tratamentos estéticos"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Avaliação da Pele",
          "description": "Análise do tipo de pele e das necessidades específicas do paciente."
        },
        {
          "title": "Limpeza Inicial",
          "description": "Remoção de maquiagem, sujeira e oleosidade da superfície da pele."
        },
        {
          "title": "Esfoliação e Extração",
          "description": "Peeling leve e extração de cravos e impurezas de forma segura e higienizada."
        },
        {
          "title": "Hidratação e Finalização",
          "description": "Aplicação de máscara nutritiva e hidratante, seguida de protetor solar e orientações pós-procedimento."
        }
      ],
      "aftercare": [
        "Evitar exposição solar intensa nas primeiras 24h",
        "Hidratar a pele regularmente",
        "Evitar maquiagem pesada nas primeiras horas",
        "Seguir orientações de cuidados domiciliares passadas pelo profissional",
        "Manter manutenção mensal ou conforme indicação"
      ]
    },
    "testimonials": [
      {
        "name": "Bruna Martins",
        "age": 26,
        "text": "A limpeza de pele deixou minha pele incrível! Livre de cravos e muito mais suave.",
        "rating": 5
      },
      {
        "name": "Larissa Souza",
        "age": 32,
        "text": "Senti minha pele revigorada e limpa após a sessão. Recomendo para todos que querem pele saudável.",
        "rating": 5
      },
      {
        "name": "Camila Rocha",
        "age": 29,
        "text": "A limpeza de pele profissional fez toda a diferença na minha rotina de skincare. Minha pele está perfeita!",
        "rating": 5
      }
    ]
  },
    // Microagulhamento: OK
    "microagulhamento": {
    "title": "Microagulhamento",
    "subtitle": "Rejuvenescimento e Renovação Profunda da Pele",
    "description": "Procedimento que utiliza microagulhas para estimular a produção natural de colágeno e elastina, melhorando textura, firmeza, cicatrizes de acne, linhas finas e poros dilatados.",
    "heroImage": "/images/procedimentos/microagulhamento/gerais/microagulhamento-1.png",
    "category": "Facial",
    "duration": "30-60 minutos",
    "sessions": "1 sessão",
    "results": "Imediato",
    "price": "A partir de R$ 489,00",
    "beforeAfterImages": [
      { "src": "/images/procedimentos/microagulhamento/antes-x-depois/microagulhamento-1.png", "alt": "Microagulhamento Antes e Depois Rugas" },
    ],
    "pricingPackages": [
      {
        "title": "Sessão Individual",
        "price": "R$ 489,00",
        "features": [
          "Microagulhamento em área selecionada",
          "Estimulação de colágeno e elastina",
          "Melhora da textura da pele",
          "Avaliação individualizada"
        ]
      },
      {
        "title": "Pacote 3 Sessões",
        "price": "R$ 1.245",
        "oldPrice": "R$ 1.467,00",
        "features": [
          "Três sessões em intervalo de 4 a 6 semanas",
          "Resultados mais consistentes e duradouros",
          "Acompanhamento completo do tratamento",
          "Orientações de cuidados domiciliares"
        ],
        "popular": true
      }
    ],
    "whatIs": {
      "title": "O que é o Microagulhamento?",
      "content": "O microagulhamento é um procedimento estético que utiliza pequenas agulhas para criar microperfurações na pele, estimulando a produção natural de colágeno e elastina e promovendo rejuvenescimento e renovação da pele.",
      "technology": "Equipamentos de microagulhamento com profundidade ajustável e precisão, garantindo segurança e eficácia no tratamento.",
      "objective": "Melhorar textura, firmeza e aparência da pele, reduzir cicatrizes, poros dilatados, linhas finas e proporcionar rejuvenescimento global."
    },
    "forWho": {
      "ideal": [
        "Pessoas com cicatrizes de acne",
        "Indivíduos com linhas finas e rugas leves",
        "Quem deseja uniformizar textura e reduzir poros dilatados",
        "Pacientes que buscam rejuvenescimento facial não invasivo"
      ],
      "contraindications": [
        "Gravidez e amamentação",
        "Infecções ativas na área tratada",
        "Doenças de pele não controladas",
        "Uso recente de isotretinoína",
        "Lesões abertas ou queimaduras na pele"
      ]
    },
    "benefits": [
      "Melhora da firmeza e elasticidade da pele",
      "Redução de linhas finas e rugas leves",
      "Uniformização da textura da pele",
      "Diminuição de cicatrizes de acne",
      "Redução de poros dilatados",
      "Estimulação natural de colágeno e elastina",
      "Procedimento seguro e minimamente invasivo",
      "Resultados progressivos e duradouros"
    ],
    "howWorks": {
      "steps": [
        {
          "title": "Avaliação Inicial",
          "description": "Análise detalhada da pele para definir profundidade e intensidade do microagulhamento."
        },
        {
          "title": "Preparação",
          "description": "Limpeza da pele e aplicação de anestésico tópico para conforto do paciente."
        },
        {
          "title": "Aplicação",
          "description": "Microagulhamento realizado na área escolhida, criando microperfurações que estimulam colágeno e elastina."
        },
        {
          "title": "Finalização",
          "description": "Aplicação de máscara calmante e orientações de cuidados pós-procedimento."
        }
      ],
      "aftercare": [
        "Evitar exposição solar intensa por 7 dias",
        "Hidratar a pele regularmente",
        "Não aplicar maquiagem pesada nas primeiras 24h",
        "Seguir recomendações de cuidados domiciliares",
        "Manter intervalo entre sessões conforme protocolo"
      ]
    },
    "testimonials": [
      {
        "name": "Renata Lima",
        "age": 33,
        "text": "O microagulhamento transformou minha pele! Cicatrizes de acne melhoraram e a textura está incrível.",
        "rating": 5
      },
      {
        "name": "Fernanda Alves",
        "age": 40,
        "text": "Senti minha pele mais firme e rejuvenescida após a primeira sessão. Recomendo o tratamento!",
        "rating": 5
      },
      {
        "name": "Juliana Costa",
        "age": 28,
        "text": "Melhorou muito os poros dilatados e linhas finas. Resultado visível e natural.",
        "rating": 5
      }
    ]
  }
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
