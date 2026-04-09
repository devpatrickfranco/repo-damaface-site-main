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
  HelpCircle
} from 'lucide-react'
import clsx from 'clsx'

const PRICING_LOGS = [
  { id: 1, type: 'Marketing', desc: 'Promoção de Inverno', count: 1240, cost: 35.80, status: 'billed', date: '2024-05-15' },
  { id: 2, type: 'Utility', desc: 'Lembrete de Agendamento', count: 450, cost: 8.90, status: 'billed', date: '2024-06-01' },
  { id: 3, type: 'Service', desc: 'Conversa de Suporte', count: 1, cost: 0.12, status: 'pending', date: 'Today' },
  { id: 4, type: 'Marketing', desc: 'Novos Procedimentos', count: 800, cost: 24.00, status: 'scheduled', date: '2024-07-01' },
]

export default function WhatsAppFinances() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <DollarSign className="w-8 h-8 text-green-600" />
             Financial Insights
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Real-time monitoring of your message spending and COEX costs.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center space-x-2 shadow-sm">
             <Calendar className="w-4 h-4 text-gray-400" />
             <span className="text-xs font-bold text-gray-700">June 2024</span>
           </div>
           <button className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
             <Download className="w-4 h-4" />
             <span>Export Report</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <BarChart3 className="w-24 h-24" />
           </div>
           <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent (USD)</p>
                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12.4%
                 </span>
              </div>
              <p className="text-5xl font-black text-gray-900 tracking-tighter">$ 245.80</p>
              <p className="text-sm font-bold text-gray-400 mt-2">≈ R$ 1.253,58 (BRL)</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">WABA Messages</p>
                    <p className="text-xl font-black text-gray-900">$ 210.30</p>
                 </div>
                 <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">COEX Fee</p>
                    <p className="text-xl font-black text-gray-900">$ 35.50</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-pink-600 p-6 rounded-[2rem] shadow-xl shadow-pink-100 flex flex-col justify-between text-white relative overflow-hidden group">
           <div className="absolute -bottom-4 -right-4 p-6 opacity-20 group-hover:scale-110 transition-transform">
              <Zap className="w-24 h-24 fill-current" />
           </div>
           <div>
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Available Credit</p>
              <p className="text-3xl font-black mt-1">$ 154.20</p>
           </div>
           <button className="mt-8 flex items-center justify-center space-x-2 w-full py-3 bg-white text-pink-600 rounded-2xl text-xs font-black shadow-lg hover:bg-gray-50 transition-all uppercase tracking-widest">
              <span>Add Credit</span>
              <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group">
           <div>
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Conversations</p>
                 <HelpCircle className="w-3.5 h-3.5 text-gray-200 cursor-help" />
              </div>
              <p className="text-3xl font-black text-gray-900 group-hover:text-pink-600 transition-colors">4,820</p>
           </div>
           <div className="mt-4 space-y-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-pink-500 w-[65%]" />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">65% of monthly limit</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Cost Breakdown by Campaign</h2>
            <div className="flex items-center gap-2">
               <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><Info className="w-5 h-5" /></button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Description</th>
                     <th className="px-6 py-4">Messages</th>
                     <th className="px-6 py-4">Cost (USD)</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {PRICING_LOGS.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-5">
                           <span className={clsx(
                              'px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm',
                              log.type === 'Marketing' ? 'bg-pink-50 text-pink-700 border-pink-100' :
                              log.type === 'Utility' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                           )}>
                              {log.type}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{log.desc}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center text-sm font-bold text-gray-600">
                              <MessageCircle className="w-4 h-4 mr-2 opacity-30" />
                              {log.count.toLocaleString()}
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-sm font-black text-gray-900">$ {log.cost.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center">
                              <div className={clsx(
                                 'w-1.5 h-1.5 rounded-full mr-2',
                                 log.status === 'billed' ? 'bg-green-500' :
                                 log.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                              )} />
                              <span className="text-xs font-bold text-gray-500 capitalize">{log.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-xs font-medium text-gray-400">{log.date}</span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <button className="w-full py-4 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            Load more logs <ChevronRight className="w-4 h-4" />
         </button>
      </div>

      <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl shadow-blue-200">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <Info className="w-32 h-32" />
         </div>
         <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Need help understanding Meta message pricing?</h2>
            <p className="text-blue-100 mt-4 font-medium">Pricing varies by country and conversation category. Check out our detailed guide to optimize your spending.</p>
         </div>
         <button className="mt-8 md:mt-0 relative z-10 px-8 py-4 bg-white text-blue-600 rounded-[1.5rem] text-sm font-black hover:bg-blue-50 transition-all shadow-xl uppercase tracking-widest flex items-center gap-3 active:scale-95 transform">
            <span>View Pricing Guide</span>
            <ChevronRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  )
}
