"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { RecentActivitiesDashboardProps } from "@/types/dashboard"

export default function RecentActivitiesDashboard({ activities }: RecentActivitiesDashboardProps) {
    const getStatusIcon = (status: string): LucideIcon => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                return "text-emerald-400"
            case "aberto":
            case "em_andamento":
                return "text-yellow-500"
            case "reaberto":
                return "text-orange-500"
            default:
                return "text-muted-foreground"
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Concluido</Badge>
            case "aberto":
                return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Aberto</Badge>
            case "em_andamento":
                return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Em Andamento</Badge>
            case "reaberto":
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Reaberto</Badge>
            case "resolvido":
                return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Resolvido</Badge>
            case "fechado":
                return <Badge className="bg-muted text-muted-foreground border-border">Fechado</Badge>
            default:
                return null
        }
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
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
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border" />
                        )}

                        <div className="flex gap-4">
                            <div
                                className={`relative z-10 p-2 rounded-full bg-secondary border-2 border-border ${getStatusColor(activity.status)}`}
                            >
                                <StatusIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-foreground text-sm">{activity.titulo}</p>
                                            {getStatusBadge(activity.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{activity.descricao}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.tempo}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
