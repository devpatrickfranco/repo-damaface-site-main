export interface Endereco {
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  latitude?: number
  longitude?: number
}

export interface HorarioFuncionamento {
  dias: string
  aberto: boolean
  abre: string
  fecha: string
}

export interface Faq {
  pergunta: string
  resposta: string
}

export interface Avaliacao {
  autor: string
  nota: number
  texto: string
  data: string
}

export interface Equipe {
  nome: string
  cargo: string
  descricao: string
  foto?: string
}

export interface Procedimento {
  slug: string
  nome: string
  resumo: string
  descricao: string
  imagem: string
  beneficios: string[]
  indicacoes: string[]
  contraindicacoes: string[]
  comoFunciona: string[]
  faqs: Faq[]
}

export interface Unidade {
  slug: string
  nome: string
  cidade: string
  estado: string
  descricao?: string
  endereco: Endereco
  whatsapp: string
  instagram?: string
  imagemHero: string
  galeria: string[]
  horarios: HorarioFuncionamento[]
  equipe: Equipe[]
  procedimentos: string[]
  faqs: Faq[]
  avaliacoes: Avaliacao[]
  indexavel: boolean
}
