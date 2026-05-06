'use client'

import { useState } from 'react'
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Info,
  MessageCircle,
  Zap,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  HelpCircle,
  Wallet
} from 'lucide-react'
import clsx from 'clsx'

const PRICING_LOGS = [
  { id: 1, type: 'Marketing', desc: 'Promoção de Inverno', count: 1240, cost: 35.80, status: 'billed', date: '2024-05-15' },
  { id: 2, type: 'Utility', desc: 'Lembrete de Agendamento', count: 450, cost: 8.90, status: 'billed', date: '2024-06-01' },
  { id: 3, type: 'Service', desc: 'Conversa de Suporte', count: 1, cost: 0.12, status: 'pending', date: 'Hoje' },
  { id: 4, type: 'Marketing', desc: 'Novos Procedimentos', count: 800, cost: 24.00, status: 'scheduled', date: '2024-07-01' },
]

const TYPE_STYLES: Record<string, string> = {
  Marketing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Utility: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Service: 'bg-gray-800 text-gray-400 border-gray-700',
}

const STATUS_STYLES: Record<string, string> = {
  billed: 'bg-green-500',
  pending: 'bg-yellow-500',
  scheduled: 'bg-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  billed: 'Faturado',
  pending: 'Pendente',
  scheduled: 'Agendado',
}

export default function WhatsAppFinances() {
  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg shadow-pink-500/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Financeiro</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Monitoramento de gastos com mensagens e custos COEX em tempo real
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-300">Junho 2024</span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/25 transition-all">
            <Download className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* ── Stats Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Spent */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 col-span-1 md:col-span-2 relative overflow-hidden group hover:border-gray-700 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <BarChart3 className="w-24 h-24" />
          </div>
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Gasto (USD)</p>
              <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.4%
              </span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter">$ 245.80</p>
            <p className="text-sm font-bold text-gray-500 mt-2">≈ R$ 1.253,58 (BRL)</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Mensagens WABA</p>
                <p className="text-xl font-black text-white">$ 210.30</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Taxa COEX</p>
                <p className="text-xl font-black text-white">$ 35.50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Credit */}
        <div className="bg-gradient-to-br from-pink-600 to-rose-600 p-6 rounded-2xl shadow-lg shadow-pink-500/20 flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 p-6 opacity-20 group-hover:scale-110 transition-transform">
            <Zap className="w-24 h-24 fill-current" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Crédito Disponível</p>
            <p className="text-3xl font-black mt-1">$ 154.20</p>
          </div>
          <button className="mt-8 relative z-10 flex items-center justify-center gap-2 w-full py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl text-xs font-bold hover:bg-white/30 transition-all uppercase tracking-widest border border-white/10">
            <span>Adicionar Crédito</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Total Conversations */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-gray-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total de Conversas</p>
              <HelpCircle className="w-3.5 h-3.5 text-gray-700 cursor-help" />
            </div>
            <p className="text-3xl font-black text-white group-hover:text-pink-400 transition-colors">4,820</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-600 to-rose-600 w-[65%]" />
            </div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">65% do limite mensal</p>
          </div>
        </div>
      </div>

      {/* ── Cost Breakdown Table ── */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <h2 className="text-lg font-black text-white uppercase tracking-widest">Detalhamento por Campanha</h2>
          <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Mensagens</th>
                <th className="px-6 py-4">Custo (USD)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {PRICING_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-5">
                    <span className={clsx(
                      'px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border',
                      TYPE_STYLES[log.type]
                    )}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors">{log.desc}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-sm font-bold text-gray-400">
                      <MessageCircle className="w-4 h-4 mr-2 text-gray-600" />
                      {log.count.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-white">$ {log.cost.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className={clsx(
                        'w-1.5 h-1.5 rounded-full mr-2',
                        STATUS_STYLES[log.status],
                        log.status === 'pending' && 'animate-pulse'
                      )} />
                      <span className="text-xs font-bold text-gray-400 capitalize">{STATUS_LABELS[log.status]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xs font-medium text-gray-500">{log.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="w-full py-4 bg-gray-900/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-800/50 transition-all flex items-center justify-center gap-2 border-t border-gray-800">
          Carregar mais registros <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Pricing Guide CTA ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Info className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl font-black tracking-tight leading-tight">Precificação de Mensagens Meta</h2>
          <p className="text-blue-200 mt-2 font-medium">Os preços variam por país e categoria de conversa. Consulte nosso guia para otimizar seus gastos.</p>
        </div>
        <button className="mt-6 md:mt-0 relative z-10 px-8 py-4 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest flex items-center gap-3 active:scale-95 transform">
          <span>Ver Guia</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
