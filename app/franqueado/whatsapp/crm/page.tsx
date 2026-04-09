'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  Tag as TagIcon,
  Calendar
} from 'lucide-react'
import clsx from 'clsx'

const CONTACTS = [
  { id: 1, name: 'Ana Silva', email: 'ana.silva@email.com', phone: '+55 11 98765-4321', tags: ['Premium', 'São Paulo'], lastActive: '2 min ago', avatar: 'AS' },
  { id: 2, name: 'Carlos Souza', email: 'carlos.souza@email.com', phone: '+55 11 98765-4789', tags: ['Interested'], lastActive: '10 min ago', avatar: 'CS' },
  { id: 3, name: 'Beatriz Lima', email: 'beatriz.lima@email.com', phone: '+55 11 91234-5678', tags: ['Support', 'Rio de Janeiro'], lastActive: '1 hour ago', avatar: 'BL' },
  { id: 4, name: 'Marcos Oliveira', email: 'marcos.o@email.com', phone: '+55 11 94444-5555', tags: ['Lead'], lastActive: '2 hours ago', avatar: 'MO' },
  { id: 5, name: 'Fernanda Rocha', email: 'fernanda.rocha@email.com', phone: '+55 11 93333-2222', tags: ['Premium'], lastActive: '5 hours ago', avatar: 'FR' },
  { id: 6, name: 'João Pereira', email: 'joao.p@email.com', phone: '+55 11 95555-6666', tags: ['Interested'], lastActive: '1 day ago', avatar: 'JP' },
  { id: 7, name: 'Juliana Costa', email: 'juliana.c@email.com', phone: '+55 11 97777-8888', tags: ['Support'], lastActive: '2 days ago', avatar: 'JC' },
  { id: 8, name: 'Roberto Santos', email: 'roberto.s@email.com', phone: '+55 11 90000-1111', tags: ['Premium'], lastActive: '3 days ago', avatar: 'RS' },
]

export default function WhatsAppCRM() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Contact CRM</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage and organize your WhatsApp contacts list.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-xl text-sm font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-100">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md text-gray-800">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contacts by name, email or phone..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Phone & Email</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-black text-sm border-2 border-white shadow-sm">
                        {contact.avatar}
                      </div>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-gray-600 font-medium">
                        <Phone className="w-3 h-3 mr-1.5 opacity-40" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Mail className="w-3 h-3 mr-1.5 opacity-40" />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-[9px] font-black text-gray-500 tracking-tight uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-2 opacity-50" />
                      {contact.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 1-8 of 124 contacts</span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-transparent" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 border border-pink-200 bg-pink-50 text-pink-600 rounded-xl text-xs font-black shadow-sm">
              1
            </button>
            <button className="px-4 py-2 border border-gray-200 bg-white text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="px-4 py-2 border border-gray-200 bg-white text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
              3
            </button>
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
