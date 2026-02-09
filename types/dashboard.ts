import type { LucideIcon } from "lucide-react"

// --- CardDashboard ---
export interface CardDashboardProps {
    chamadosAbertos: number
    cursosAndamento: number
    comunicadosNaoLidos: number
}

// --- ChartDashboard ---
export interface ChartData {
    day: string
    atividades: number
    data: string
}

export interface ChartDashboardProps {
    data: ChartData[]
}

// --- CommuniqueDashboard ---
export interface Comunicado {
    id: number
    titulo: string
    conteudo: string
    tipo: string
    tipo_display: string
    data_publicacao: string
    urgente: boolean
}

export interface CommuniqueDashboardProps {
    comunicados: Comunicado[]
}

// --- EvolutionChart ---
export interface ChartDataPoint {
    semana: string
    valor: number
}

export interface EvolutionChartProps {
    data: ChartDataPoint[]
}

// --- KpiCards ---
export interface KpiData {
    agendamentos: number
    agendamentosVariacao: number
    agendamentosMeta: number
    vendas: number
    vendasVariacao: number
    vendasMeta: number
    faturamento: number
    faturamentoVariacao: number
    faturamentoMeta: number
    ticketMedio: number
    ticketMedioVariacao: number
    ticketMedioMeta: number
    conversao: number
    conversaoVariacao: number
    conversaoMeta: number
    receitaPotencial: number
}

export interface KpiCardProps {
    title: string
    value: string
    rawValue: number
    variation: number
    meta: number
    metaLabel: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
    isCurrency?: boolean
    isPercent?: boolean
    /** "projection" = show monthly projection, "fixed" = meta only, "orcamento" = conversion insight, "receita" = value only */
    cardMode?: "projection" | "fixed" | "orcamento" | "receita"
    diaAtual: number
    skipProjection?: boolean
}

// --- PodiumRanking ---
export interface RankingEntry {
    nome: string
    posicao: number
}

export interface PodiumRankingProps {
    ranking: RankingEntry[]
    suaUnidadePosicao: number
    suaUnidadeNome: string
    totalUnidades: number
}

// --- RecentActivitiesDashboard ---
export interface Activity {
    id: string
    tipo: string
    titulo: string
    descricao: string
    tempo: string
    status: string
    icon: string
}

export interface RecentActivitiesDashboardProps {
    activities: Activity[]
}
