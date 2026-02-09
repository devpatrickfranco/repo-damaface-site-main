"use client"

import type { KpiData } from "@/types/dashboard"
import type { ChartDataPoint } from "@/types/dashboard"
import type { RankingEntry } from "@/types/dashboard"

import PerformanceHeader from "./components/PerformanceHeader"
import KpiCards from "./components/KpiCards"
import EvolutionChart from "./components/EvolutionChart"
import PodiumRanking from "./components/PodiumRanking"
import CardDashboard from "./components/CardDashboard"
import CommuniqueDashboard from "./components/CommuniqueDashboard"
import ChartDashboard from "./components/ChartDashboard"
import RecentActivitiesDashboard from "./components/RecentActivitiesDashboard"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Trophy, BarChart3, Clock } from "lucide-react"

// ========= MOCK DATA =========

const mockUser = { nome: "Carlos Silva" }

const mockKpi: KpiData = {
  agendamentos: 100,
  agendamentosVariacao: 12.5,
  agendamentosMeta: 120,
  vendas: 87,
  vendasVariacao: -3.2,
  vendasMeta: 59,
  faturamento: 145320.0,
  faturamentoVariacao: 8.7,
  faturamentoMeta: 70000,
  ticketMedio: 1670.34,
  ticketMedioVariacao: 5.1,
  ticketMedioMeta: 1200,
  conversao: 35.1,
  conversaoVariacao: 2.4,
  conversaoMeta: 50,
  receitaPotencial: 47850.0,
}

const mockChartPerformance: ChartDataPoint[] = [
  { semana: "Sem 1", valor: 28500 },
  { semana: "Sem 2", valor: 35200 },
  { semana: "Sem 3", valor: 41800 },
  { semana: "Sem 4", valor: 39820 },
]

const mockRanking: RankingEntry[] = [
  { nome: "Unidade Centro", posicao: 1 },
  { nome: "Unidade Zona Sul", posicao: 2 },
  { nome: "Unidade Norte", posicao: 3 },
]

const mockDashboardStats = {
  chamados_abertos: 3,
  cursos_andamento: 2,
  comunicados_nao_lidos: 5,
  comunicados_recentes: [
    {
      id: 1,
      titulo: "Nova politica de atendimento",
      conteudo:
        "A partir do proximo mes, todas as unidades deverao seguir o novo protocolo de atendimento ao cliente conforme manual atualizado.",
      tipo: "informativo",
      tipo_display: "Informativo",
      data_publicacao: new Date().toISOString(),
      urgente: false,
    },
    {
      id: 2,
      titulo: "Manutencao programada no sistema",
      conteudo:
        "O sistema ficara indisponivel no sabado, das 02h as 06h, para atualizacoes de seguranca e melhorias de desempenho.",
      tipo: "alerta",
      tipo_display: "Alerta",
      data_publicacao: new Date(Date.now() - 86400000).toISOString(),
      urgente: true,
    },
    {
      id: 3,
      titulo: "Treinamento obrigatorio - Vendas 2026",
      conteudo:
        "Todos os colaboradores devem completar o curso de tecnicas de venda ate o final do mes. Acesse pela plataforma de cursos.",
      tipo: "treinamento",
      tipo_display: "Treinamento",
      data_publicacao: new Date(Date.now() - 172800000).toISOString(),
      urgente: false,
    },
  ],
  grafico_uso: [
    { day: "Seg", atividades: 12, data: "2026-02-02" },
    { day: "Ter", atividades: 19, data: "2026-02-03" },
    { day: "Qua", atividades: 8, data: "2026-02-04" },
    { day: "Qui", atividades: 15, data: "2026-02-05" },
    { day: "Sex", atividades: 22, data: "2026-02-06" },
    { day: "Sab", atividades: 6, data: "2026-02-07" },
    { day: "Dom", atividades: 3, data: "2026-02-08" },
  ],
  atividades_recentes: [
    {
      id: "1",
      tipo: "ticket",
      titulo: "Ticket #1247 - Problema no caixa",
      descricao: "Erro ao processar pagamento com cartao de credito",
      tempo: "Ha 2h",
      status: "aberto",
      icon: "ticket",
    },
    {
      id: "2",
      tipo: "curso",
      titulo: "Curso de Atendimento Avancado",
      descricao: "Modulo 3 concluido com sucesso",
      tempo: "Ha 5h",
      status: "completed",
      icon: "graduation-cap",
    },
    {
      id: "3",
      tipo: "ticket",
      titulo: "Ticket #1243 - Atualizacao de cardapio",
      descricao: "Novos itens adicionados ao sistema",
      tempo: "Ontem",
      status: "resolvido",
      icon: "ticket",
    },
    {
      id: "4",
      tipo: "comunicado",
      titulo: "Comunicado lido - Ferias coletivas",
      descricao: "Periodo de recesso confirmado",
      tempo: "2 dias",
      status: "fechado",
      icon: "bell",
    },
  ],
}

// ========= HELPERS =========

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 19) return "Boa tarde"
  return "Boa noite"
}

// ========= PAGE =========

export default function Dashboard() {
  const user = mockUser
  const dashboardData = mockDashboardStats

  const totalItensAtencao =
    dashboardData.chamados_abertos + dashboardData.comunicados_nao_lidos

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 space-y-8">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/20 rounded-xl p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {user.nome.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {totalItensAtencao > 0 ? (
              <>
                {"Voce tem "}
                <span className="font-bold text-brand-pink">
                  {totalItensAtencao}{" "}
                  {totalItensAtencao === 1 ? "item" : "itens"}
                </span>
                {totalItensAtencao === 1
                  ? " que precisa"
                  : " que precisam"}{" "}
                {"de atencao"}
              </>
            ) : (
              "Tudo em dia!"
            )}
          </p>
        </div>

        {/* Quick Vision Cards */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-pink" />
              Visao Rapida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDashboard
              chamadosAbertos={dashboardData.chamados_abertos}
              cursosAndamento={dashboardData.cursos_andamento}
              comunicadosNaoLidos={dashboardData.comunicados_nao_lidos}
            />
          </CardContent>
        </Card>

        {/* Comunicados - right after Visao Rapida */}
        <CommuniqueDashboard
          comunicados={dashboardData.comunicados_recentes}
        />

        {/* ======= PERFORMANCE SECTION ======= */}
        <PerformanceHeader />
        <KpiCards data={mockKpi} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Evolution chart */}
          <Card className="lg:col-span-3 bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <TrendingUp className="w-5 h-5 text-brand-pink" />
                Evolucao no mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EvolutionChart data={mockChartPerformance} />
            </CardContent>
          </Card>

          {/* Podium + sua unidade */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <Trophy className="w-5 h-5 text-gold" />
                Top 3 da Rede
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-4">
              <PodiumRanking
                ranking={mockRanking}
                suaUnidadePosicao={7}
                suaUnidadeNome="Unidade Jardins"
                totalUnidades={24}
              />
            </CardContent>
          </Card>
        </div>

        {/* Activity chart + Recent activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-pink" />
                Sua Atividade (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartDashboard data={dashboardData.grafico_uso} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-pink" />
                Ultimas Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivitiesDashboard
                activities={dashboardData.atividades_recentes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}