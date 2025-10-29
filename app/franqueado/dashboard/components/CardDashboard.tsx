"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Ticket, GraduationCap, Bell } from "lucide-react"

export default function CardDashboard() {
  const cards = [
    {
      title: "Tickets",
      value: "2",
      description: "Tickets abertos",
      icon: Ticket,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Cursos",
      value: "1",
      description: "Curso em andamento",
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avisos",
      value: "3",
      description: "Avisos não lidos",
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
          <Card key={card.title} className="bg-dark-base border-border hover:border-brand-pink/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{card.title}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
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
