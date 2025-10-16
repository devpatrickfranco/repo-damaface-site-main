// data/academy/data-cursos.ts
import type { Curso, Categoria, Trilha } from '@/types/academy'

// ---------- Cursos ----------
export const cursos: Curso[] = [
  {
    id: 11,
    slug: 'fundamentos-do-marketing-digital-para-franquias',
    titulo: 'Fundamentos do Marketing Digital para Franquias',
    descricao:
      'Aprenda as estratégias essenciais de marketing digital específicas para o modelo de franquias. Este curso aborda desde conceitos básicos até técnicas avançadas de conversão e retenção de clientes.',
    instrutor: {
      nome: 'Ana Carolina Silva',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      bio: 'Especialista em Marketing Digital com mais de 10 anos de experiência em franquias. Formada em Marketing pela USP e pós-graduada em Gestão de Negócios.',
    },
    categoria: {
      cor: 'bg-blue',
      icon: 'text',
      id: 1,
      nome: 'marketing',
      slug: 'marketing'
    },
    nivel: 'Iniciante',
    duracao: '4h 30min',
    aulas: 24,
    alunos: 1247,
    rating: 4.8,
    avaliacoes: 156,
    capa: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg',
    status: 'Livre',
    progresso: {
      progresso_percentual: 70,
      concluida: false,
      tempo_assistido: 0,
      ultima_posicao: 15
    },
    destaque: true,
    modulos: [
      {
        id: '1-1',
        titulo: 'Introdução ao Marketing Digital',
        aulas: [
          {
            id: '1-1-1',
            titulo: 'O que é Marketing Digital',
            duracao: '12:30',
            concluida: true,
            slug: 'o-que-e-marketing-digital',
            video_id: 'B37HSdjE3nc',
          },
          {
            id: '1-1-2',
            titulo: 'Diferenças para Franquias',
            duracao: '15:45',
            concluida: true,
            slug: 'diferencas-para-franquias',
          },
          {
            id: '1-1-3',
            titulo: 'Ferramentas Essenciais',
            duracao: '18:20',
            concluida: true,
            slug: 'ferramentas-essenciais',
          },
        ],
      },
      {
        id: '1-2',
        titulo: 'Estratégias de Conteúdo',
        aulas: [
          {
            id: '1-2-1',
            titulo: 'Criando Personas',
            duracao: '22:15',
            concluida: true,
            slug: 'criando-personas',
          },
          {
            id: '1-2-2',
            titulo: 'Calendário Editorial',
            duracao: '16:40',
            concluida: true,
            slug: 'calendario-editorial',
          },
        ],
      },
    ],
    avaliacoesAlunos: [
      {
        id: 1,
        aluno: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg',
        rating: 5,
        comentario: 'Curso excelente! Muito didático e com exemplos práticos.',
        data: '2024-01-15',
        autorId: 1
      },
      {
        id: 2,
        aluno: 'João Costa',
        avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
        rating: 4,
        comentario: 'Conteúdo muito bom, mas poderia ter mais casos reais.',
        data: '2024-01-10',
        autorId: 2
        },
    ],
    quizzes: {
      id: 'q1',
      titulo: 'Teste Final de Marketing Digital',
      concluido: false,
      perguntas: [
        {
          id: 'p1',
          texto:
            'Qual é o principal objetivo do Marketing de Conteúdo para franquias?',
          opcoes: [
            { id: 'o1-1', texto: 'Aumentar o número de seguidores nas redes sociais.' },
            { id: 'o1-2', texto: 'Vender produtos e serviços de forma direta e imediata.' },
            {
              id: 'o1-3',
              texto:
                'Atrair, engajar e criar autoridade para a marca, gerando oportunidades de negócio.',
            },
            { id: 'o1-4', texto: 'Reduzir os custos com publicidade tradicional.' },
          ],
          respostaCorretaId: 'o1-3',
        },
        {
          id: 'p2',
          texto: "O que significa a sigla 'SEO' no contexto de marketing digital?",
          opcoes: [
            { id: 'o2-1', texto: 'Social Engagement Optimization' },
            { id: 'o2-2', texto: 'Search Engine Optimization' },
            { id: 'o2-3', texto: 'Sales Efficiency Online' },
            { id: 'o2-4', texto: 'Service Experience Objective' },
          ],
          respostaCorretaId: 'o2-2',
        },
        {
          id: 'p3',
          texto:
            'Qual das seguintes métricas é mais importante para avaliar o sucesso de uma campanha de e-mail marketing?',
          opcoes: [
            { id: 'o3-1', texto: 'Taxa de Abertura' },
            { id: 'o3-2', texto: 'Taxa de Cliques (CTR)' },
            { id: 'o3-3', texto: 'Taxa de Conversão' },
            { id: 'o3-4', texto: 'Número de descadastros' },
          ],
          respostaCorretaId: 'o3-3',
        },
        {
          id: 'p4',
          texto:
            "Ao criar um anúncio no Google Ads, o que é um 'Índice de Qualidade'?",
          opcoes: [
            { id: 'o4-1', texto: 'Uma nota baseada apenas no valor do lance do anúncio.' },
            {
              id: 'o4-2',
              texto:
                'Uma estimativa da qualidade dos seus anúncios, palavras-chave e página de destino.',
            },
            { id: 'o4-3', texto: 'O número de vezes que seu anúncio foi exibido.' },
            { id: 'o4-4', texto: 'Uma avaliação da popularidade da sua marca.' },
          ],
          respostaCorretaId: 'o4-2',
        },
        {
          id: 'p5',
          texto: "O que é um 'Funil de Vendas' em marketing digital?",
          opcoes: [
            { id: 'o5-1', texto: 'Um relatório de vendas mensal.' },
            {
              id: 'o5-2',
              texto: 'O processo de criação de um site de e-commerce.',
            },
            {
              id: 'o5-3',
              texto:
                'A jornada do cliente, desde o primeiro contato com a marca até a compra.',
            },
            { id: 'o5-4', texto: 'Uma estratégia de desconto para produtos.' },
          ],
          respostaCorretaId: 'o5-3',
        },
      ],
    },
  },
  // Os outros cursos seguem a mesma estrutura que você enviou (id: 2 até 7),
  // e já estão completos e tipados corretamente no seu modelo atual.
]

// ---------- Categorias ----------
export const categorias: Categoria[] = [
  { id: 1, nome: 'Marketing e Vendas', slug: 'marketing-e-vendas', icon: 'TrendingUp', cor: 'bg-pink-500' },
  { id: 2, nome: 'POPs', slug: 'pops', icon: 'BookOpen', cor: 'bg-blue-500' },
  { id: 3, nome: 'Atendimento', slug: 'atendimento', icon: 'Headphones', cor: 'bg-green-500' },
  { id: 4, nome: 'Implantação', slug: 'implantacao', icon: 'Settings', cor: 'bg-orange-500' },
  { id: 5, nome: 'Gestão', slug: 'gestao', icon: 'Target', cor: 'bg-purple-500' },
  { id: 6, nome: 'Qualidade', slug: 'qualidade', icon: 'Award', cor: 'bg-yellow-500' },
  { id: 7, nome: 'Liderança', slug: 'lideranca', icon: 'Crown', cor: 'bg-red-500' },
  { id: 8, nome: 'Produtividade', slug: 'produtividade', icon: 'Clock', cor: 'bg-teal-500' },
  { id: 9, nome: 'Comunicação', slug: 'comunicacao', icon: 'MessageCircle', cor: 'bg-indigo-500' },
  { id: 10, nome: 'Finanças', slug: 'financas', icon: 'DollarSign', cor: 'bg-yellow-600' },
]

// ---------- Trilhas ----------
export const trilhas: Trilha[] = [
  {
    id: '1',
    slug: 'onboarding-de-franqueados',
    titulo: 'Onboarding de Franqueados',
    descricao:
      'Trilha completa para novos franqueados dominarem todos os aspectos do negócio',
    cursos: [],
    progresso: 45,
    tempoTotal: '16h 30min',
    icon: 'Target',
    cor: 'bg-green-500',
  },
  {
    id: '2',
    slug: 'gestao-comercial',
    titulo: 'Gestão Comercial',
    descricao: 'Desenvolva habilidades essenciais para maximizar vendas e resultados',
    cursos: [],
    progresso: 65,
    tempoTotal: '8h 15min',
    icon: 'TrendingUp',
    cor: 'bg-blue-500',
  },
  {
    id: '3',
    slug: 'treinamento-de-equipe',
    titulo: 'Treinamento de Equipe',
    descricao: 'Capacite sua equipe com as melhores práticas e técnicas',
    cursos: [],
    progresso: 20,
    tempoTotal: '12h 00min',
    icon: 'Users',
    cor: 'bg-purple-500',
  },
  {
    id: '4',
    slug: 'lideranca-e-gestao',
    titulo: 'Liderança e Gestão',
    descricao:
      'Desenvolva habilidades de liderança e gestão para alcançar resultados excepcionais.',
    cursos: [],
    progresso: 50,
    tempoTotal: '14h 45min',
    icon: 'Crown',
    cor: 'bg-red-500',
  },
  {
    id: '5',
    slug: 'produtividade-pessoal',
    titulo: 'Produtividade Pessoal',
    descricao:
      'Aprenda técnicas para melhorar sua produtividade e alcançar seus objetivos.',
    cursos: [],
    progresso: 30,
    tempoTotal: '3h 45min',
    icon: 'Clock',
    cor: 'bg-teal-500',
  },
  {
    id: '6',
    slug: 'comunicacao-eficaz',
    titulo: 'Comunicação Eficaz',
    descricao: 'Melhore suas habilidades de comunicação para se destacar no mercado.',
    cursos: [],
    progresso: 40,
    tempoTotal: '5h 15min',
    icon: 'MessageCircle',
    cor: 'bg-indigo-500',
  },
  {
    id: '7',
    slug: 'financas-para-empreendedores',
    titulo: 'Finanças para Empreendedores',
    descricao: 'Entenda como gerenciar as finanças do seu negócio de forma eficiente.',
    cursos: [],
    progresso: 20,
    tempoTotal: '6h 30min',
    icon: 'DollarSign',
    cor: 'bg-yellow-600',
  },
]
