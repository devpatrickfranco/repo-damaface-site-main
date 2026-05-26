'use client'

import React, { useEffect } from 'react'
import { useWhatsAppStore } from '@/modules/whatsapp/store/useWhatsAppStore'
import { ChatPanel } from '@/modules/whatsapp/components/chat/ChatPanel'
import WhatsAppActivationStatus from './components/WhatsAppActivationStatus'
import { MessageSquare, Settings, AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function WhatsAppDashboard() {
  const { status, fetchStatus, loading, isSyncing, error, connection } = useWhatsAppStore()

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  if (loading && !connection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        <RefreshCw className="w-8 h-8 animate-spin text-green-500 mb-4" />
        <p className="text-sm font-medium">Carregando módulo do WhatsApp...</p>
      </div>
    )
  }

  if (status === 'active') {
    return (
      <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
        {/* Header simples: "WhatsApp Atendimento" + botão "Configurações" */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#25D366]/20 to-emerald-500/10 shadow-lg shadow-green-500/5 border border-[#25D366]/20">
              <MessageSquare className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">WhatsApp Atendimento</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Central de atendimento e conversas com clientes
              </p>
            </div>
          </div>
          <Link
            href="/franqueado/whatsapp/configurar"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-xl text-sm font-bold border border-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configurações WABA</span>
          </Link>
        </div>

        {/* Chat Inbox (Atendimento) */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '550px' }}>
          <ChatPanel />
        </div>
      </div>
    )
  }

  // Se a conexão não estiver ativa, renderiza o painel de status de ativação com link/aviso para configurar
  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
      {/* Aviso de conexão inativa no topo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            Sua conta WhatsApp Business não está ativa no momento. Algumas funcionalidades estão desabilitadas.
          </span>
        </div>
        <Link
          href="/franqueado/whatsapp/configurar"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shrink-0 text-center"
        >
          Ir para Configurações
        </Link>
      </div>

      <WhatsAppActivationStatus />
    </div>
  )
}
