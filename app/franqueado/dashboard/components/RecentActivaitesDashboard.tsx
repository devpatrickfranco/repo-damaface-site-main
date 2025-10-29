"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Ticket, GraduationCap, Bell, LucideIcon } from "lucide-react"

interface Activity {
  id: string
  tipo: string
  titulo: string
  descricao: string
  tempo: string
  status: string
  icon: string
}

interface RecentActivitiesDashboardProps {
  activities: Activity[]
}

export default function RecentActivaitesDashboard({ activities }: RecentActivitiesDashboardProps) {
  // Mapeia ícones baseado no tipo/icon vindo da API
  const getIcon = (iconName: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'ticket': Ticket,
      'graduation-cap': GraduationCap,
      'bell': Bell,
    }
    return iconMap[iconName] || Clock
  }

  // Mapeia status para ícone do status
  const getStatusIcon = (status: string): LucideIcon => {
    const statusMap: Record<string, LucideIcon> = {
      'completed': CheckCircle2,
      'aberto': Clock,
      'em_andamento': Clock,
      'reaberto': AlertCircle,
      'resolvido': CheckCircle2,
      'fechado': CheckCircle2,
    }
    return statusMap[status] || Clock
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "resolvido":
      case "fechado":
        return "text-green-500"
      case "aberto":
      case "em_andamento":
        return "text-yellow-500"
      case "reaberto":
        return "text-orange-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Concluído</Badge>
      case "aberto":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Aberto</Badge>
      case "em_andamento":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Em Andamento</Badge>
      case "reaberto":
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Reaberto</Badge>
      case "resolvido":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Resolvido</Badge>
      case "fechado":
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Fechado</Badge>
      default:
        return null
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Nenhuma atividade recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const StatusIcon = getStatusIcon(activity.status)
        
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
                <StatusIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">{activity.titulo}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-xs text-gray-400">{activity.descricao}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.tempo}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}