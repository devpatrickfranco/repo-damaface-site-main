"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"

export default function CommuniqueDashboard() {
  const communiques = [
    {
      id: 1,
      title: "Nova promoção de produtos",
      description: "Confira os novos produtos com desconto especial para franqueados",
      date: "Hoje",
      type: "Promoção",
    },
    {
      id: 2,
      title: "Atualização do sistema",
      description: "Sistema será atualizado no próximo domingo das 2h às 6h",
      date: "Ontem",
      type: "Sistema",
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Megaphone className="w-5 h-5 text-brand-pink" />
          Comunicados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {communiques.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-dark-base border border-border hover:border-brand-pink/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
