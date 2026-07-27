import type { Procedimento } from "@/types/local-seo"

const faqPadrao = (nome: string) => [
  { pergunta: `O procedimento de ${nome} é indicado para mim?`, resposta: "A indicação é definida em uma avaliação individual, considerando seus objetivos, histórico e características." },
  { pergunta: "Como agendar uma avaliação?", resposta: "Fale com a unidade pelo WhatsApp para consultar os horários disponíveis." },
]

export const procedimentosMock: Procedimento[] = [
  {
    slug: "botox", nome: "Botox", imagem: "/images/procedimentos/botox/gerais/botox-2.png",
    resumo: "Suavize linhas de expressão com um plano personalizado.",
    descricao: "A toxina botulínica é utilizada para suavizar linhas de expressão e pode ajudar na prevenção do seu aprofundamento, sempre após avaliação profissional.",
    beneficios: ["Suavização de linhas de expressão", "Procedimento rápido", "Plano individualizado"],
    indicacoes: ["Linhas na testa", "Rugas ao redor dos olhos", "Linhas entre as sobrancelhas"],
    contraindicacoes: ["Gestantes e lactantes", "Infecção na área de aplicação", "Condições avaliadas pelo profissional"],
    comoFunciona: ["Avaliação facial", "Planejamento dos pontos", "Aplicação e orientações pós-procedimento"],
    faqs: faqPadrao("Botox"),
  },
  {
    slug: "preenchimento-facial", nome: "Preenchimento Facial", imagem: "/images/procedimentos/preenchimento/facial-2.png",
    resumo: "Realce contornos e proporções com naturalidade.",
    descricao: "O preenchimento facial é planejado para valorizar pontos específicos do rosto e buscar equilíbrio entre contornos, volumes e a sua identidade.",
    beneficios: ["Valorização de contornos", "Planejamento personalizado", "Resultados naturais"],
    indicacoes: ["Lábios", "Olheiras", "Contorno facial"],
    contraindicacoes: ["Gestantes e lactantes", "Infecção ativa", "Avaliação clínica necessária"],
    comoFunciona: ["Avaliação", "Definição do plano", "Aplicação e acompanhamento"],
    faqs: faqPadrao("Preenchimento Facial"),
  },
  {
    slug: "bioestimulador", nome: "Bioestimulador de Colágeno", imagem: "/images/procedimentos/bioestimulador/gerais/bioestimulador-1.jpeg",
    resumo: "Estimule a produção de colágeno de forma gradual.",
    descricao: "Bioestimuladores são tratamentos injetáveis que podem estimular a produção de colágeno e melhorar a qualidade da pele gradualmente.",
    beneficios: ["Estímulo gradual de colágeno", "Melhora da qualidade da pele", "Plano por região"],
    indicacoes: ["Flacidez facial", "Perda de firmeza", "Qualidade da pele"],
    contraindicacoes: ["Gestantes e lactantes", "Infecções ativas", "Avaliação clínica necessária"],
    comoFunciona: ["Consulta", "Definição de regiões", "Aplicação e acompanhamento"],
    faqs: faqPadrao("Bioestimulador de Colágeno"),
  },
]
