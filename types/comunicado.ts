export interface ComunicadoType {
  id: number
  titulo: string
  conteudo: string
  prioridade: "BAIXA" | "MEDIA" | "ALTA"
  status: "APROVADO" | "PENDENTE_APROVACAO" | "REJEITADO" | "RASCUNHO"
  tipo?: "COMUNICADO" | "ALERTA" | "TREINAMENTO" | "NOVIDADE"
  urgente?: boolean
  data_publicacao: string
  data_expiracao?: string
  destinatarios: {
    tipo: "USUARIO" | "GRUPO"
    id: string
    nome: string
  }[]
  autor?: {
    id: number
    nome: string
    email?: string
  }
  lido_pelo_usuario_atual: boolean
  anexos?: {
    id: string
    nome?: string
    nome_original?: string
    url?: string
    arquivo?: string
    tamanho?: number
    tipo: string
  }[]
}

export interface DestinatarioOption {
  id: string
  nome: string
  tipo: "USUARIO" | "GRUPO"
  email?: string
}

export interface ComunicadoFormData {
  titulo: string
  conteudo: string
  prioridade: "BAIXA" | "MEDIA" | "ALTA"
  tipo: "COMUNICADO" | "ALERTA" | "TREINAMENTO" | "NOVIDADE"
  destinatarios: DestinatarioOption[]
  data_expiracao?: string
  anexos: File[]
  tipoDestino: "TODAS_FRANQUIAS" | "FRANQUIAS_ESPECIFICAS" | "FRANQUEADORA";
  apenasFranqueados: boolean;
}
