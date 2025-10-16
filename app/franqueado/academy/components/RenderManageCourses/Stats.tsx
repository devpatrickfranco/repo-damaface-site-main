"use client"

import type React from "react"

import { Search, BookOpen, Play, Users, Eye, Star, TrendingUp } from "lucide-react"
import type { Curso, Categoria } from "@/types/academy"

interface StatsProps {
  cursos: Curso[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string | number
  setSelectedCategory: (value: string) => void
  filterStatus: "all" | "livre" | "pago"
  setFilterStatus: (value: "all" | "livre" | "pago") => void
  categorias: Categoria[]
  filteredCount: number
}

export default function Stats({
  cursos,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filterStatus,
  setFilterStatus,
  categorias,
  filteredCount,
}: StatsProps) {
  const stats = {
    totalCursos: cursos.length,
    cursosLivres: cursos.filter((c) => c.status === "Livre").length,
    cursosPagos: cursos.filter((c) => c.status === "Pago").length,
    totalAulas: cursos.reduce((acc, curso) => acc + (curso.aulas || 0), 0),
    totalAlunos: cursos.reduce((acc, curso) => acc + (curso.alunos || 0), 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Cursos"
          value={stats.totalCursos}
          icon={<BookOpen className="w-5 h-5" />}
          gradient="from-blue-500 to-cyan-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Cursos Livres"
          value={stats.cursosLivres}
          icon={<Eye className="w-5 h-5" />}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Cursos Pagos"
          value={stats.cursosPagos}
          icon={<Star className="w-5 h-5" />}
          gradient="from-amber-500 to-orange-500"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Total de Aulas"
          value={stats.totalAulas}
          icon={<Play className="w-5 h-5" />}
          gradient="from-purple-500 to-pink-500"
          iconBg="bg-purple-500/10"
        />
        <StatCard
          title="Total Alunos"
          value={stats.totalAlunos}
          icon={<Users className="w-5 h-5" />}
          gradient="from-pink-500 to-rose-500"
          iconBg="bg-pink-500/10"
        />
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de Busca */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-pink-400" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all min-w-[140px] cursor-pointer"
            >
              <option value="all">Todos os status</option>
              <option value="livre">Cursos Livres</option>
              <option value="pago">Cursos Pagos</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all min-w-[160px] cursor-pointer"
            >
              <option value="all">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Mostrando <span className="text-white font-semibold">{filteredCount}</span> de{" "}
            <span className="text-white font-semibold">{cursos.length}</span> cursos
          </p>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  gradient: string
  iconBg: string
}

function StatCard({ title, value, icon, gradient, iconBg }: StatCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1">
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div className={`${iconBg} rounded-xl p-3 text-white transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}
      />
    </div>
  )
}
