"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiBackend } from "@/lib/api-backend"
import { useMetricas } from "@/hooks/useApi"

import type { KpiData } from "@/types/dashboard"
import type { ChartDataPoint, ChartData } from "@/types/dashboard"
import type { RankingEntry } from "@/types/dashboard"
import type { Comunicado, Activity } from "@/types/dashboard"

import PerformanceHeader from "./components/PerformanceHeader"
import KpiCards from "./components/KpiCards"
import EvolutionChart from "./components/EvolutionChart"
import PodiumRanking from "./components/PodiumRanking"
import CardDashboard from "./components/CardDashboard"
import CommuniqueDashboard from "./components/CommuniqueDashboard"
import ChartDashboard from "./components/ChartDashboard"
import RecentActivitiesDashboard from "./components/RecentActivitiesDashboard"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Trophy, BarChart3, Clock, Loader2 } from "lucide-react"

// ========= MOCK DATA (Remanescentes que não possuem API clara ainda) =========

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

// ========= HELPERS =========

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 19) return "Boa tarde"
  return "Boa noite"
}

// ========= PAGE =========

export default function Dashboard() {
  const { user } = useAuth()

  // Estados para dados da API
  const [chamadosAbertos, setChamadosAbertos] = useState(0)
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [activityData, setActivityData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [cursosAndamentoState, setCursosAndamento] = useState(0)
  const [comunicadosNaoLidosState, setComunicadosNaoLidos] = useState(0)


  // Hook existente para métricas (Academy) - mantendo para dados específicos se necessário, 
  // mas priorizando o stats se disponível
  const { data: metricas } = useMetricas()

  // Buscar dados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const response = await apiBackend.get<any>("/dashboard/stats/")
      // O backend pode retornar os dados diretamente ou dentro de 'data' dependendo da estrutura
      const data = response.data || response

      // 1. Atualizar contadores
      setChamadosAbertos(data.chamados_abertos || 0)
      setCursosAndamento(data.cursos_andamento || 0)
      setComunicadosNaoLidos(data.comunicados_nao_lidos || 0)

      // 2. Gráfico de atividades
      if (Array.isArray(data.grafico_uso)) {
        setActivityData(data.grafico_uso)
      }

      // 3. Atividades Recentes
      if (Array.isArray(data.atividades_recentes)) {
        setRecentActivities(data.atividades_recentes)
      }

      // 4. Comunicados Recentes (para o componente CommuniqueDashboard)
      if (Array.isArray(data.comunicados_recentes)) {
        setComunicados(data.comunicados_recentes)
      } else if (Array.isArray(data.comunicados)) {
        setComunicados(data.comunicados) // Fallback se o nome do campo for diferente
      }

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Valores Computados (prioriza do backend consolidado, fallback para hook ou 0)
  const cursosAndamento = cursosAndamentoState || (metricas ? parseInt(metricas.cursos_iniciados) : 0)
  const comunicadosNaoLidos = comunicadosNaoLidosState || comunicados.length

  const totalItensAtencao = chamadosAbertos + comunicadosNaoLidos



  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-pink animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 space-y-8">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/20 rounded-xl p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {user.nome?.split(" ")[0]}!
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
              chamadosAbertos={chamadosAbertos}
              cursosAndamento={cursosAndamento}
              comunicadosNaoLidos={comunicadosNaoLidos}
            />
          </CardContent>
        </Card>

        {/* Comunicados - right after Visao Rapida */}
        <CommuniqueDashboard
          comunicados={comunicados}
        />

        {/* ======= PERFORMANCE SECTION (Oculto temporariamente) ======= */}
        {/*
        <PerformanceHeader />
        <KpiCards data={mockKpi} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
        */}

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
              <ChartDashboard data={activityData} />
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
                activities={recentActivities}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}