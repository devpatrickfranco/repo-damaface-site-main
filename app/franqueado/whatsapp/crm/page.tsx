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
  Calendar,
  Users
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
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 shadow-lg shadow-pink-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">CRM de Contatos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gerencie e organize sua lista de contatos do WhatsApp
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
            <Upload className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-500/25 transition-all">
            <Plus className="w-4 h-4" />
            <span>Adicionar Contato</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar contatos por nome, email ou telefone..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-all">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Telefone & Email</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Último Contato</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {CONTACTS.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-pink-500/20">
                        {contact.avatar}
                      </div>
                      <span className="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-gray-400 font-medium">
                        <Phone className="w-3 h-3 mr-1.5 text-gray-600" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Mail className="w-3 h-3 mr-1.5 text-gray-600" />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-md text-[9px] font-bold text-gray-400 tracking-tight uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-gray-600" />
                      {contact.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mostrando 1-8 de 124 contatos</span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-30 disabled:hover:bg-transparent" disabled>
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20">
              1
            </button>
            <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all">
              2
            </button>
            <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all">
              3
            </button>
            <button className="p-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
