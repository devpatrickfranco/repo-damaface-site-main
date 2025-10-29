"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AlertsDashboard() {
  const alerts = [
    {
      id: 1,
      title: "Ticket #1234 aguardando resposta",
      description: "Cliente aguardando retorno há 2 dias",
      priority: "Alta",
      time: "Há 2 dias",
    },
    {
      id: 2,
      title: "Curso 'Técnicas Avançadas' expira em breve",
      description: "Acesso expira em 5 dias",
      priority: "Média",
      time: "Expira em 5 dias",
    },
    {
      id: 3,
      title: "Aviso importante não lido",
      description: "Atualização de políticas da franquia",
      priority: "Alta",
      time: "Há 1 dia",
    },
  ]

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert key={alert.id} className="bg-dark-base border-destructive/30">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{alert.title}</p>
                  <Badge variant={alert.priority === "Alta" ? "destructive" : "secondary"} className="text-xs">
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{alert.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {alert.time}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
