"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { cursos, categorias } from "@/data/academy/data-cursos"

import Link from "next/link"

import DynamicIcon from '@/app/franqueado/academy/components/DynamicIcon'
import {
  Search,
  Grid3X3,
  List,
  Clock,
  BookOpen,
  Users,
  Star,
  PlayCircle,
  Trophy,
  TrendingUp,
  ArrowRight,
  Zap,
  Award,
  Target,
  ArrowLeft,
} from "lucide-react"

export default function CursosPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/franqueado")
      }
    }, [isAuthenticated, authLoading, router])
  
  
  const [searchTerm, setSearchTerm] = useState("")
  // FIX: Initialized state with a default value and type.
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "em-andamento" | "concluidos" | "disponiveis">("all")
  const [sortBy, setSortBy] = useState<"titulo" | "rating" | "alunos" | "duracao">("titulo")
  const [showFilters, setShowFilters] = useState(false)


  const estatisticas = {
    totalCursos: cursos.length,
    cursosLivres: cursos.filter((c) => c.status === "Livre").length,
    cursosPagos: cursos.filter((c) => c.status === "Pago").length,
    mediaRating: (cursos.reduce((acc, c) => acc + c.rating, 0) / cursos.length).toFixed(1),
  }

  const filteredCursos = cursos
    .filter((curso) => {
      const matchesSearch =
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.instrutor.nome.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || curso.categoria?.id === Number(selectedCategory)

      // FIX: Correctly and safely handle status filtering when `curso.progresso` might be undefined.
      let matchesStatus = true
      if (filterStatus === "em-andamento") {
        matchesStatus = !!curso.progresso && curso.progresso.progresso_percentual > 0 && curso.progresso.progresso_percentual < 100
      } else if (filterStatus === "concluidos") {
        matchesStatus = !!curso.progresso && curso.progresso.progresso_percentual === 100
      } else if (filterStatus === "disponiveis") {
        matchesStatus = !curso.progresso || curso.progresso.progresso_percentual === 0
      }

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "alunos":
          return b.alunos - a.alunos
        case "duracao":
          return Number.parseInt(a.duracao) - Number.parseInt(b.duracao)
        default:
          return a.titulo.localeCompare(b.titulo)
      }
    })

  const renderCourseCard = (curso: any) => {
    const categoria = categorias.find((c) => c.id === curso.categoriaId)

    return (
      <Link
        key={curso.id}
        href={`/franqueado/academy/cursos/${curso.slug}`}
        className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-brand-pink/30 hover:shadow-2xl hover:shadow-brand-pink/10 transition-all duration-300 hover:-translate-y-1 ${
          viewMode === "list" ? "flex" : ""
        }`}
      >
        <div className={`relative ${viewMode === "list" ? "w-56 h-36" : "w-full h-52"} flex-shrink-0 overflow-hidden`}>
          <img
            src={curso.capa || "/placeholder.svg"}
            alt={curso.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-brand-pink/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {curso.status === "Pago" && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>PREMIUM</span>
              </div>
            )}
            {curso.destaque && (
              <div className="bg-gradient-to-r from-brand-pink to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>DESTAQUE</span>
              </div>
            )}
          </div>
          
          {/* FIX: Check `progresso_percentual` safely */}
          {curso.progresso?.progresso_percentual === 100 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>CONCLUÍDO</span>
            </div>
          )}

          {categoria && (
            <div className="absolute bottom-3 left-3">
              <div
                className={`${categoria.cor} text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg flex items-center space-x-1.5`}
              >
                <DynamicIcon name={categoria.icon} className="w-3.5 h-3.5" />
                <span>{categoria.nome}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-brand-pink transition-colors duration-300">
              {curso.titulo}
            </h3>
            {curso.status === "Pago" && curso.preco && (
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-xl font-bold text-brand-pink">R$ {curso.preco}</div>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{curso.descricao}</p>

          <div className="flex items-center space-x-3 mb-4 p-2 bg-gray-800/30 rounded-lg">
            <img
              src={curso.instrutor.avatar || "/placeholder.svg"}
              alt={curso.instrutor.nome}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-600"
            />
            <span className="text-gray-300 text-sm font-medium">{curso.instrutor.nome}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <span>{curso.duracao}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-400" />
              </div>
              <span>{curso.aulas} aulas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <span>{curso.alunos}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
              <span>{curso.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                curso.nivel === "Iniciante"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : curso.nivel === "Intermediário"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              <Target className="w-3 h-3" />
              <span>{curso.nivel}</span>
            </span>
          </div>
          
          {/* FIX: Check for progress object and use `progresso_percentual` */}
          {curso.progresso && curso.progresso.progresso_percentual > 0 && (
            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400 font-medium">Progresso</span>
                <span className="text-brand-pink font-bold">{curso.progresso.progresso_percentual}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-pink to-pink-400 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${curso.progresso.progresso_percentual}%` }}
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="bg-brand-pink/90 backdrop-blur-sm rounded-full p-2">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
      <div className="p-2">
        <Link href="/franqueado/academy">
          <ArrowLeft className="text-white hover:text-pink-500 cursor-pointer" />
        </Link>
      </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-pink to-pink-600 rounded-lg blur opacity-20"></div>
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                    Biblioteca de Cursos
                  </h1>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Explore nossa coleção completa de cursos especializados para franqueados
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-gray-700/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-brand-pink text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-brand-pink text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Total de Cursos</p>
                    <p className="text-3xl font-bold text-white">{estatisticas.totalCursos}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Cursos Livres</p>
                    <p className="text-3xl font-bold text-white">{estatisticas.cursosLivres}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Premium</p>
                    <p className="text-3xl font-bold text-white">{estatisticas.cursosPagos}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Avaliação Média</p>
                    <p className="text-3xl font-bold text-white">{estatisticas.mediaRating}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-pink/20 to-pink-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-brand-pink" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou instrutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-200"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-200"
                >
                  <option value="all">Todas as categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-200"
                >
                  <option value="all">Todos os status</option>
                  <option value="em-andamento">Em andamento</option>
                  <option value="concluidos">Concluídos</option>
                  <option value="disponiveis">Disponíveis</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-200"
                >
                  <option value="titulo">Ordenar por título</option>
                  <option value="rating">Melhor avaliados</option>
                  <option value="alunos">Mais populares</option>
                  <option value="duracao">Duração</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400 font-medium">
              Mostrando <span className="text-white font-bold">{filteredCursos.length}</span> de{" "}
              <span className="text-white font-bold">{cursos.length}</span> cursos
            </div>
          </div>

          {/* Courses Grid/List */}
          {filteredCursos.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {filteredCursos.map(renderCourseCard)}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
                <Search className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Nenhum curso encontrado</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                Tente ajustar seus filtros ou termos de busca para encontrar o conteúdo que você procura
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setFilterStatus("all")
                }}
                className="bg-gradient-to-r from-brand-pink to-pink-600 hover:from-pink-600 hover:to-brand-pink text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/25 hover:-translate-y-0.5"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
