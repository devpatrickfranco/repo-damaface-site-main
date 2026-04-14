'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Carregamento dinâmico garante que o componente só roda no cliente
const WhatsAppConfig = dynamic(
  () => import('../components/WhatsAppConfig'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        <p className="text-sm text-gray-500">Iniciando módulo WhatsApp...</p>
      </div>
    ),
  }
)

export default function WhatsAppConfigPage() {
  return <WhatsAppConfig />
}
