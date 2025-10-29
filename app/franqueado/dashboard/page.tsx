"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import Sidebar from "../components/Sidebar"
import HeaderDashboard from "../components/HeaderFranqueado"
import CardDashboard from "./components/CardDashboard"
import CommuniqueDashboard from "./components/CommuniqueDashboard"
import AlertsDashboard from "./components/AlertsDashboard"
import ChartDashboard from "./components/ChartDashboard"
import RecentActivaitesDashboard from "./components/RecentActivaitesDashboard"

export default function Dashboard() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não está carregando e não está autenticado, manda para o login
    if (!loading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, loading, router])

  // Mostra um loader enquanto o estado de autenticação está sendo verificado
  if (loading) {
    return <p>Carregando...</p>
  }

  // Se chegou aqui e não está autenticado, o useEffect já vai redirecionar,
  // mas retornamos null para não "piscar" a página errada.
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

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <HeaderDashboard />

        {/* Sidebar */}
        <Sidebar active="dashboard" />

        {/* Main Content */}
        <main className="lg:ml-64 pt-16 min-h-screen">
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/20 rounded-lg p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {getGreeting()}, {user?.nome.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Você tem <span className="font-bold text-brand-pink">5 itens</span> que precisam de atenção
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📊 Visão Rápida</h2>
              <CardDashboard />
            </div>

            <div className="bg-card border border-destructive/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">⚠️ Precisa de Atenção</h2>
              <AlertsDashboard />
            </div>

            <CommuniqueDashboard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Atividade (7 dias) */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📈 Sua Atividade (7 dias)</h2>
                <ChartDashboard />
              </div>

              {/* Últimas Atividades - Timeline */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">🕐 Últimas Atividades</h2>
                <RecentActivaitesDashboard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
