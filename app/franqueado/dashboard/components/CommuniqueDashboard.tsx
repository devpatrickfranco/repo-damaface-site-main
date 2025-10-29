"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"
import Link from "next/link"

interface Comunicado {
  id: number
  titulo: string
  conteudo: string
  tipo: string
  tipo_display: string
  data_publicacao: string
  urgente: boolean
}

interface CommuniqueDashboardProps {
  comunicados: Comunicado[]
}

export default function CommuniqueDashboard({ comunicados }: CommuniqueDashboardProps) {
  // Garante que comunicados seja sempre um array
  const comunicadosList = comunicados ?? []
  
  // Remove tags HTML do conteúdo
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }
  
  // Formata a data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)
    
    // Reseta as horas para comparação de datas
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
        <CardTitle className="flex items-center gap-2 text-white">
          <Megaphone className="w-5 h-5 text-brand-pink" />
          Comunicados
        </CardTitle>
        <Link 
          href="/franqueado/comunicados"
          className="text-sm text-brand-pink hover:text-brand-pink/80 transition-colors"
        >
          Ver mais →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {comunicadosList.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhum comunicado recente</p>
          </div>
        ) : (
          comunicadosList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-dark-base border border-border hover:border-brand-pink/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{item.titulo}</h3>
                    <Badge variant="outline" className="text-xs">
                      {item.tipo_display}
                    </Badge>
                    {item.urgente && (
                      <Badge variant="destructive" className="text-xs">
                        Urgente
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {stripHtml(item.conteudo)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
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