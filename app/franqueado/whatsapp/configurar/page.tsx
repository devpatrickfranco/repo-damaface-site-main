'use client'

import React, { useEffect } from 'react'
import { useWhatsAppStore } from '@/modules/whatsapp/store/useWhatsAppStore'
import { useAuth } from '@/context/AuthContext'
import { ConnectionBanner } from '@/modules/whatsapp/components/ConnectionBanner'
import { WabaAccountDetails } from '@/modules/whatsapp/components/WabaAccountDetails'
import { MultiTenantNetworkCard } from '@/modules/whatsapp/components/MultiTenantNetworkCard'
import { EmbeddedSignupButton } from '@/modules/whatsapp/components/EmbeddedSignupButton'
import { TestSendMessage } from '@/app/franqueado/whatsapp/components/TestSendMessage'
import {
  ArrowLeft,
  Settings,
  Library,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

export default function WhatsAppConfigPage() {
  const {
    status,
    connection,
    loading,
    isSyncing,
    error,
    fetchStatus,
    resetError
  } = useWhatsAppStore()

  const { user } = useAuth()
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN'

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 text-gray-200">
      {/* ── Header & Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link
            href="/franqueado/whatsapp"
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Voltar para Atendimento"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" />
              <h1 className="text-2xl font-black text-white tracking-tight">Configurações WhatsApp</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerencie a integração da conta WhatsApp Business (WABA) da sua clínica
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchStatus()}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Sincronizar Status</span>
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-300">{error.message}</p>
            <div className="flex items-center gap-4 mt-3">
              {(error.actionable || error.retryable) && (
                <button
                  onClick={() => { resetError(); fetchStatus(); }}
                  className="text-[10px] font-bold text-red-400 uppercase hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tentar Sincronizar Agora</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Status, Conexão e Detalhes da Conta (WABA) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Status da Conexão */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Status de Integração
            </h2>
            <ConnectionBanner />
          </div>

          {/* Embedded Signup Meta (Exibido apenas quando inativo/desconectado) */}
          {status !== 'active' && (
            <div className="p-6 bg-gray-900/45 border border-gray-800 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Vincular Conta WhatsApp Business</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Utilize o Embedded Signup da Meta para registrar o número de telefone da sua franquia de forma oficial e instantânea.
              </p>
              <div className="pt-2">
                <EmbeddedSignupButton />
              </div>
            </div>
          )}

          {/* Detalhes da Conta WABA (Sempre visível) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Dados Técnicos da Conta (Meta)
            </h2>
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <WabaAccountDetails />
            </div>
          </div>

        </div>

        {/* Coluna Direita: Ferramentas de Teste, Templates HSM e Multi-Franquias */}
        <div className="lg:col-span-4 space-y-8">

          {/* Seção Templates HSM */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Mensagens Modelo (HSM)
            </h2>
            <div className="p-5 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <Library className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Templates de Mensagens</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Gerencie, envie para aprovação e sincronize templates oficiais da Meta.
                  </p>
                </div>
              </div>
              <Link
                href="/franqueado/whatsapp/templates"
                className="w-full flex items-center justify-between p-3 bg-gray-800/40 hover:bg-gray-800 border border-gray-700 hover:border-pink-600/30 rounded-xl transition-all group"
              >
                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                  Gerenciar Templates
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Teste de Envio (Apenas se ativo) */}
          {status === 'active' && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Ferramentas de Homologação
              </h2>
              <TestSendMessage />
            </div>
          )}

          {/* Rede Multi-tenant (Visível apenas para admins) */}
          {isAdmin && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Painel Admin Multi-tenant
              </h2>
              <MultiTenantNetworkCard />
            </div>
          )}

          {/* Info Badge */}
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold px-2">
            <ShieldCheck className="w-4 h-4 text-green-600/60" />
            <span>META TECHNOLOGY PROVIDER · SECURITY VERIFIED</span>
          </div>

        </div>

      </div>
    </div>
  )
}
