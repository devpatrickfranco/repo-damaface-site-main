'use client'

import { useState } from 'react'
import {
  Plus,
  Send,
  History,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  MoreVertical,
  Users,
  Layout,
  ChevronRight,
  Eye,
  Megaphone
} from 'lucide-react'
import clsx from 'clsx'

const CAMPAIGNS = [
  { id: 1, name: 'Promoção de Inverno', status: 'completed', sent: 1240, delivered: 1220, read: 980, date: '2024-05-15', template: 'winter_promo_2024' },
  { id: 2, name: 'Lembrete de Agendamento', status: 'running', sent: 450, delivered: 430, read: 310, date: '2024-06-01', template: 'appointment_reminder' },
  { id: 3, name: 'Novos Procedimentos - Julho', status: 'scheduled', sent: 0, delivered: 0, read: 0, date: '2024-07-01', template: 'new_procedures' },
  { id: 4, name: 'Black Friday 2023', status: 'completed', sent: 5000, delivered: 4950, read: 4200, date: '2023-11-20', template: 'black_friday_vip' },
]

export default function WhatsAppBroadcast() {
  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg shadow-pink-500/20">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Campanhas de Disparo</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Escale sua comunicação com mensagens em massa usando templates da Meta
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/25 transition-all">
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex items-center gap-4 group hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Send className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Enviado (Mês)</p>
            <p className="text-2xl font-black text-white">12.450</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex items-center gap-4 group hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Taxa de Entrega</p>
            <p className="text-2xl font-black text-white">98.2%</p>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex items-center gap-4 group hover:border-gray-700 transition-all">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Taxa de Abertura</p>
            <p className="text-2xl font-black text-white">76.4%</p>
          </div>
        </div>
      </div>

      {/* ── Campaigns ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white uppercase tracking-wider">Campanhas Recentes</h2>
          <button className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors">
            Ver todo histórico <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'p-2.5 rounded-xl',
                      campaign.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      campaign.status === 'running' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-500'
                    )}>
                      {campaign.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                       campaign.status === 'running' ? <Clock className="w-5 h-5" /> : <History className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight">{campaign.name}</h3>
                      <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Layout className="w-3 h-3" /> Template: {campaign.template}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={clsx(
                        'px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border',
                        campaign.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        campaign.status === 'running' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-800 text-gray-500 border-gray-700'
                     )}>
                        {campaign.status === 'completed' ? 'Concluída' : campaign.status === 'running' ? 'Ativa' : 'Agendada'}
                     </span>
                     <button className="p-1.5 text-gray-500 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-800">
                   <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Enviados</p>
                      <p className="text-sm font-black text-white">{campaign.sent.toLocaleString()}</p>
                   </div>
                   <div className="text-center border-x border-gray-800">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Entregues</p>
                      <p className="text-sm font-black text-white">{campaign.delivered.toLocaleString()}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Visualizados</p>
                      <p className="text-sm font-black text-white">{campaign.read.toLocaleString()}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
                      {campaign.date}
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-xl text-[10px] font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-widest border border-gray-700">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                   </button>
                </div>
              </div>

              {campaign.status === 'running' && (
                <div className="h-1 bg-gray-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-600 to-rose-600 w-[70%] rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
