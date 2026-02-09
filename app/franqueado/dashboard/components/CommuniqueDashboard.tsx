"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"

import type { CommuniqueDashboardProps } from "@/types/dashboard"

export default function CommuniqueDashboard({ comunicados }: CommuniqueDashboardProps) {
  const comunicadosList = comunicados ?? []

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)

    const dataComparar = new Date(data.getFullYear(), data.getMonth(), data.getDate())
    const hojeComparar = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const ontemComparar = new Date(ontem.getFullYear(), ontem.getMonth(), ontem.getDate())

    if (dataComparar.getTime() === hojeComparar.getTime()) {
      return "Hoje"
    } else if (dataComparar.getTime() === ontemComparar.getTime()) {
      return "Ontem"
    } else {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Megaphone className="w-5 h-5 text-brand-pink" />
          Comunicados
        </CardTitle>
        <span className="text-sm text-brand-pink hover:text-brand-pink/80 transition-colors cursor-pointer">
          {"Ver mais \u2192"}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {comunicadosList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum comunicado recente</p>
          </div>
        ) : (
          comunicadosList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-secondary border border-border hover:border-brand-pink/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{item.titulo}</h3>
                    <Badge variant="outline" className="text-xs">
                      {item.tipo_display}
                    </Badge>
                    {item.urgente && (
                      <Badge variant="destructive" className="text-xs">
                        Urgente
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {stripHtml(item.conteudo)}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatarData(item.data_publicacao)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}