"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Ticket, GraduationCap, Bell } from "lucide-react"

import type { CardDashboardProps } from "@/types/dashboard"

export default function CardDashboard({
  chamadosAbertos,
  cursosAndamento,
  comunicadosNaoLidos
}: CardDashboardProps) {
  const cards = [
    {
      title: "Tickets",
      value: chamadosAbertos.toString(),
      description: chamadosAbertos === 1 ? "Ticket aberto" : "Tickets abertos",
      icon: Ticket,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Cursos",
      value: cursosAndamento.toString(),
      description: cursosAndamento === 1 ? "Curso em andamento" : "Cursos em andamento",
      icon: GraduationCap,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Avisos",
      value: comunicadosNaoLidos.toString(),
      description: comunicadosNaoLidos === 1 ? "Aviso nao lido" : "Avisos nao lidos",
      icon: Bell,
      color: "text-brand-pink",
      bgColor: "bg-brand-pink/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="bg-secondary border-border hover:border-brand-pink/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}