'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  MoreVertical, 
  Copy, 
  LayoutList,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const TEMPLATES = [
  { id: 1, name: 'winter_promo_2024', status: 'approved', category: 'MARKETING', language: 'pt_BR', lastUpdated: '2 days ago', type: 'TEXT' },
  { id: 2, name: 'appointment_reminder', status: 'approved', category: 'UTILITY', language: 'pt_BR', lastUpdated: '1 month ago', type: 'TEXT' },
  { id: 3, name: 'new_procedures_v2', status: 'pending', category: 'MARKETING', language: 'pt_BR', lastUpdated: '5 hours ago', type: 'IMAGE' },
  { id: 4, name: 'welcome_package', status: 'approved', category: 'MARKETING', language: 'en_US', lastUpdated: '15 days ago', type: 'DOCUMENT' },
  { id: 5, name: 'black_friday_vip', status: 'rejected', category: 'MARKETING', language: 'pt_BR', lastUpdated: '6 months ago', type: 'TEXT' },
  { id: 6, name: 'post_service_survey', status: 'approved', category: 'UTILITY', language: 'pt_BR', lastUpdated: '10 days ago', type: 'TEXT' },
]

export default function WhatsAppTemplates() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <LayoutList className="w-8 h-8 text-pink-600" />
             Templates Library
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Official Meta Business templates (HSM) synchronized with your account.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm group">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Sync with Meta</span>
          </button>
          <button className="flex items-center space-x-3 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
            <Plus className="w-5 h-5" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search templates by name..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 transition-all outline-none shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
            {['All', 'Approved', 'Pending', 'Rejected'].map(filter => (
                <button key={filter} className={clsx(
                    'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                    filter === 'All' ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                )}>
                    {filter}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-6">
               <div className="flex justify-between items-start mb-6">
                  <div className={clsx(
                    'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 shadow-sm',
                    tpl.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                    tpl.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                  )}>
                    {tpl.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                    {tpl.status === 'pending' && <Clock className="w-3 h-3" />}
                    {tpl.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {tpl.status}
                  </div>
                  <button className="p-1.5 text-gray-300 hover:text-gray-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>

               <h3 className="text-lg font-black text-gray-900 group-hover:text-pink-600 transition-colors truncate mb-1 uppercase tracking-tight">{tpl.name}</h3>
               <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tpl.category}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tpl.language}</span>
               </div>

               <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 shadow-inner group-hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-pink-600 transition-colors">
                     {tpl.type === 'TEXT' && <MessageSquare className="w-5 h-5" />}
                     {tpl.type === 'IMAGE' && <ImageIcon className="w-5 h-5" />}
                     {tpl.type === 'DOCUMENT' && <FileText className="w-5 h-5" />}
                     <span className="text-[10px] font-black uppercase tracking-widest">{tpl.type} Primary Content</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2 italic leading-relaxed">
                    {"Hello {{1}}! We have an update regarding your appointment on {{2}}. Please confirm..."}
                  </p>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {tpl.lastUpdated}
                  </span>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all shadow-sm border border-gray-100" title="Copy ID">
                        <Copy className="w-4 h-4" />
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-gray-100 group-hover:shadow-pink-100">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
