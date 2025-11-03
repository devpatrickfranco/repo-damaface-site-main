"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { apiBackend } from "@/lib/api-backend"

import CardDashboard from "./components/CardDashboard"
import CommuniqueDashboard from "./components/CommuniqueDashboard"
import ChartDashboard from "./components/ChartDashboard"
import RecentActivaitesDashboard from "./components/RecentActivaitesDashboard"

// Tipos para tipagem dos dados da API
interface DashboardStats {
  chamados_abertos: number
  cursos_andamento: number
  comunicados_nao_lidos: number
  comunicados_recentes: Array<{
    id: number
    titulo: string
    conteudo: string
    tipo: string
    tipo_display: string
    data_publicacao: string
    urgente: boolean
  }>
  grafico_uso: Array<{
    day: string
    atividades: number
    data: string
  }>
  atividades_recentes: Array<{
    id: string
    tipo: string
    titulo: string
    descricao: string
    tempo: string
    status: string
    icon: string
  }>
}

export default function Dashboard() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()
  
  // Estados para dados da API
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, loading, router])

  // Busca dados do dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true)
      setError(null)
      
      const data = await apiBackend.get<DashboardStats>('/dashboard/stats/')
      setDashboardData(data)
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoadingData(false)
    }
  }

  // Mostra loader enquanto autentica
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    )
  }

  // Se não autenticado, retorna null (useEffect vai redirecionar)
  if (!isAuthenticated) {
    return null
  }

  const getGreeting = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 0 && hour < 12) {
      return "Bom dia"
    } else if (hour >= 12 && hour < 19) {
      return "Boa tarde"
    } else {
      return "Boa noite"
    }
  }

  // Calcula total de itens que precisam atenção
  const totalItensAtencao = dashboardData 
    ? dashboardData.chamados_abertos + dashboardData.comunicados_nao_lidos
    : 0

  return (
    <>
          <div className="p-6 space-y-6">
            {/* Banner de Boas-vindas */}
            <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/20 rounded-lg p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {getGreeting()}, {user?.nome.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                {loadingData ? (
                  'Carregando informações...'
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : totalItensAtencao > 0 ? (
                  <>
                    Você tem <span className="font-bold text-brand-pink">{totalItensAtencao} {totalItensAtencao === 1 ? 'item' : 'itens'}</span> que {totalItensAtencao === 1 ? 'precisa' : 'precisam'} de atenção
                  </>
                ) : (
                  'Tudo em dia! 🎉'
                )}
              </p>
            </div>

            {/* Cards de Visão Rápida */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📊 Visão Rápida
              </h2>
              {loadingData ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-gray-400">Carregando...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : dashboardData ? (
                <CardDashboard
                  chamadosAbertos={dashboardData.chamados_abertos}
                  cursosAndamento={dashboardData.cursos_andamento}
                  comunicadosNaoLidos={dashboardData.comunicados_nao_lidos}
                />
              ) : null}
            </div>

            {/* Comunicados */}
            {!loadingData && !error && dashboardData && (
              <CommuniqueDashboard 
                comunicados={dashboardData.comunicados_recentes}
              />
            )}

            {/* Gráfico e Atividades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Atividade */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📈 Sua Atividade (7 dias)
                </h2>
                {loadingData ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-400">Carregando...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : dashboardData ? (
                  <ChartDashboard data={dashboardData.grafico_uso} />
                ) : null}
              </div>

              {/* Últimas Atividades */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  🕐 Últimas Atividades
                </h2>
                {loadingData ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-gray-400">Carregando...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : dashboardData ? (
                  <RecentActivaitesDashboard activities={dashboardData.atividades_recentes} />
                ) : null}
              </div>
            </div>
          </div>
    </>
  )
}