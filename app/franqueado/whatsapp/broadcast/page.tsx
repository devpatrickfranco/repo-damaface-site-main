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
  Eye
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Broadcast Campaigns</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Scale your communication with mass messages using Meta templates.</p>
        </div>
        <button className="flex items-center space-x-3 px-6 py-3 bg-pink-600 text-white rounded-2xl text-sm font-black hover:bg-pink-700 transition-all shadow-xl shadow-pink-200">
          <Plus className="w-5 h-5" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sent (Month)</p>
            <p className="text-2xl font-black text-gray-900">12,450</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Rate</p>
            <p className="text-2xl font-black text-gray-900">98.2%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Open Rate</p>
            <p className="text-2xl font-black text-gray-900">76.4%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">Recent Campaigns</h2>
            <button className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 transition-colors">
                View all history <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      'p-2.5 rounded-xl shadow-inner',
                      campaign.status === 'completed' ? 'bg-green-50 text-green-600' :
                      campaign.status === 'running' ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-gray-50 text-gray-400'
                    )}>
                      {campaign.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                       campaign.status === 'running' ? <Clock className="w-5 h-5" /> : <History className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{campaign.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Layout className="w-3 h-3" /> Template: {campaign.template}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={clsx(
                        'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm',
                        campaign.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                        campaign.status === 'running' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                     )}>
                        {campaign.status}
                     </span>
                     <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-50">
                   <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sent</p>
                      <p className="text-sm font-black text-gray-900">{campaign.sent.toLocaleString()}</p>
                   </div>
                   <div className="text-center border-x border-gray-50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivered</p>
                      <p className="text-sm font-black text-gray-900">{campaign.delivered.toLocaleString()}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Read</p>
                      <p className="text-sm font-black text-gray-900">{campaign.read.toLocaleString()}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {campaign.date}
                   </div>
                   <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                   </button>
                </div>
              </div>
              
              {campaign.status === 'running' && (
                <div className="h-1 bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[70%]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
