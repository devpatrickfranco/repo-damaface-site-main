"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function RecentActivaitesDashboard() {
  const activities = [
    {
      id: 1,
      title: "Ticket #1234 criado",
      description: "Problema com agendamento",
      time: "Há 2 horas",
      status: "pending",
      icon: Clock,
    },
    {
      id: 2,
      title: "Curso 'Básico de Estética' concluído",
      description: "Certificado disponível",
      time: "Há 5 horas",
      status: "completed",
      icon: CheckCircle2,
    },
    {
      id: 3,
      title: "Aviso lido: Atualização de políticas",
      description: "Novas diretrizes da franquia",
      time: "Há 1 dia",
      status: "completed",
      icon: CheckCircle2,
    },
    {
      id: 4,
      title: "Ticket #1230 respondido",
      description: "Aguardando retorno do cliente",
      time: "Há 2 dias",
      status: "warning",
      icon: AlertCircle,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "warning":
        return "text-orange-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Concluído</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>
      case "warning":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Atenção</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="relative">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border" />
            )}

            {/* Activity item */}
            <div className="flex gap-4">
              <div
                className={`relative z-10 p-2 rounded-full bg-dark-base border-2 border-border ${getStatusColor(activity.status)}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-xs text-gray-400">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
