"use client"
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useCategorias, useCursos } from '@/hooks/useApi'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'
import HeaderFranqueado from '../../components/HeaderFranqueado'
import DynamicIcon from '@/app/franqueado/academy/components/DynamicIcon'
import type { Categoria, Curso } from '@/types/academy'
import { 
  Search, Grid3X3, List, BookOpen, Users, Star, PlayCircle, 
  Trophy, TrendingUp, ChevronRight, Target, ArrowRight, 
  Sparkles, Zap, ArrowLeft 
} from 'lucide-react'

// Interface estendida para categorias com estatísticas calculadas
interface CategoriaComEstatisticas extends Categoria {
  totalCursos: number
  totalAlunos: number
  mediaRating: number
  cursosLivres: number
  cursosPagos: number
  cursos: Curso[]
}

export default function CategoriasPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const { data: categoriasData, loading: loadingCategorias, error: errorCategorias } = useCategorias()
  const { data: cursosData, loading: loadingCursos, error: errorCursos } = useCursos()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'nome' | 'cursos' | 'popularidade'>('nome')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/franqueado')
    }
  }, [isAuthenticated, authLoading, router])

  const categorias: Categoria[] = categoriasData || []
  const cursos: Curso[] = cursosData || []

  const categoriasWithStats: CategoriaComEstatisticas[] = useMemo(() => {
    return categorias.map((categoria) => {
      const cursosCategoria = cursos.filter(
        (curso) => curso.categoria?.id === categoria.id
      )

      const totalAlunos = cursosCategoria.reduce((acc, curso) => acc + (curso.alunos || 0), 0)
      const mediaRating = cursosCategoria.length > 0
        ? cursosCategoria.reduce((acc, curso) => acc + (curso.rating || 0), 0) / cursosCategoria.length
        : 0

      const cursosLivres = cursosCategoria.filter((curso) => curso.status === 'Livre').length
      const cursosPagos = cursosCategoria.filter((curso) => curso.status === 'Pago').length

      return {
        ...categoria,
        totalCursos: cursosCategoria.length,
        totalAlunos,
        mediaRating: Number(mediaRating.toFixed(1)),
        cursosLivres,
        cursosPagos,
        cursos: cursosCategoria,
      }
    }).filter(categoria => categoria.totalCursos > 0)
  }, [categorias, cursos])

  if (authLoading || loadingCategorias || loadingCursos) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando categorias...</div>
      </div>
    )
  }

  if (errorCategorias || errorCursos) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">
          Erro ao carregar dados: {errorCategorias || errorCursos}
        </div>
      </div>
    )
  }
  // Filter and sort categories
  const filteredCategorias = categoriasWithStats
    .filter((categoria) =>
      categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'cursos':
          return (b.totalCursos || 0) - (a.totalCursos || 0)
        case 'popularidade':
          return (b.totalAlunos || 0) - (a.totalAlunos || 0)
        default:
          return a.nome.localeCompare(b.nome)
      }
    })

  // Overall statistics
  const estatisticas = {
    totalCategorias: categoriasWithStats.length,
    totalCursos: categoriasWithStats.reduce((acc, cat) => acc + (cat.totalCursos || 0), 0),
    totalAlunos: categoriasWithStats.reduce((acc, cat) => acc + (cat.totalAlunos || 0), 0),
    mediaRating: categoriasWithStats.length > 0
      ? Number(
          (categoriasWithStats.reduce((acc, cat) => acc + (cat.mediaRating || 0), 0) / 
          categoriasWithStats.length).toFixed(1)
        )
      : 0,
  }

  const renderCategoryCard = (categoria: CategoriaComEstatisticas) => {
    return (
      <Link
        key={categoria.id}
        href={`/franqueado/academy/categorias/${categoria.slug}`}
        className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-brand-pink/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-pink/10 animate-fade-up ${
          viewMode === 'list' ? 'flex items-center' : ''
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Icon and Header */}
        <div
          className={`${
            viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'w-full h-36'
          } flex items-center justify-center relative overflow-hidden`}
          style={{ backgroundColor: categoria.cor }}  
        >
          <DynamicIcon
            name={categoria.icon}
            className={`${
              viewMode === 'list' ? 'w-8 h-8' : 'w-14 h-14'
            } text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          
          {(categoria.totalCursos || 0) > 2 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              POPULAR
            </div>
          )}
        </div>

        <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6 relative z-10`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl group-hover:text-brand-pink transition-colors duration-300 mb-2">
                {categoria.nome}
              </h3>
              <p className="text-gray-400 text-sm">
                {categoria.totalCursos} {categoria.totalCursos === 1 ? 'curso' : 'cursos'} disponível
                {categoria.totalCursos === 1 ? '' : 'is'}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-brand-pink/20 transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </div>

          <div
            className={`${
              viewMode === 'list' ? 'flex items-center space-x-6' : 'grid grid-cols-2 gap-3'
            } text-sm mb-5`}
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-medium">{categoria.totalAlunos?.toLocaleString()}</span>
            </div>

            {(categoria.mediaRating || 0) > 0 && (
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <span className="font-medium">{categoria.mediaRating}</span>
              </div>
            )}

            {viewMode === 'grid' && (
              <>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="font-medium">{categoria.cursosLivres} livres</span>
                </div>

                {(categoria.cursosPagos || 0) > 0 && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="font-medium">{categoria.cursosPagos} premium</span>
                  </div>
                )}
              </>
            )}
          </div>

          {viewMode === 'grid' && (categoria.cursos?.length || 0) > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-700/50">
              <p className="text-xs text-brand-pink font-semibold tracking-wide uppercase flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Cursos em Destaque
              </p>
              <div className="space-y-2">
                {categoria.cursos?.slice(0, 2).map((curso) => (
                  <div
                    key={curso.id}
                    className="flex items-center space-x-3 text-sm text-gray-300 bg-gray-700/30 rounded-lg p-2"
                  >
                    <PlayCircle className="w-4 h-4 text-brand-pink flex-shrink-0" />
                    <span className="truncate font-medium">{curso.titulo}</span>
                  </div>
                ))}
                {(categoria.cursos?.length || 0) > 2 && (
                  <p className="text-sm text-brand-pink font-medium">
                    +{(categoria.cursos?.length || 0) - 2} cursos adicionais
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Explorar categoria</span>
              <div className="flex items-center text-brand-pink font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>Ver cursos</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <HeaderFranqueado />
      <Sidebar active="academy" />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-2">
          <Link href="/franqueado/academy">
            <ArrowLeft className="text-white hover:text-pink-500 cursor-pointer" />
          </Link>
        </div>
        <div className="p-6">
          <div className="mb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-pink to-pink-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Categorias de Cursos
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Explore nossos cursos organizados por área de conhecimento e acelere seu aprendizado
                    </p>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-xl p-1 border border-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-brand-pink text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-brand-pink text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Categorias</p>
                    <p className="text-3xl font-bold text-white mt-1">{estatisticas.totalCategorias}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total de Cursos</p>
                    <p className="text-3xl font-bold text-white mt-1">{estatisticas.totalCursos}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:border-green-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total de Alunos</p>
                    <p className="text-3xl font-bold text-white mt-1">{estatisticas.totalAlunos.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 hover:border-yellow-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Avaliação Média</p>
                    <p className="text-3xl font-bold text-white mt-1">{estatisticas.mediaRating}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 mb-8 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar categorias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-300"
                  />
                </div>

                {/* Sort */}
                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-6 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all duration-300"
                  >
                    <option value="nome">Ordenar por nome</option>
                    <option value="cursos">Mais cursos</option>
                    <option value="popularidade">Mais populares</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-gray-400 text-lg">
                Mostrando <span className="text-white font-semibold">{filteredCategorias.length}</span> de{' '}
                <span className="text-white font-semibold">{categoriasWithStats.length}</span> categorias
              </div>
            </div>

            {/* Categories Grid/List */}
            {filteredCategorias.length > 0 ? (
              <div
                className={`${
                  viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'
                }`}
              >
                {filteredCategorias.map(renderCategoryCard)}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-16 h-16 text-gray-600" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Nenhuma categoria encontrada</h3>
                <p className="text-gray-400 mb-8 text-lg">Tente ajustar seus termos de busca</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-brand-pink to-pink-600 hover:from-pink-600 hover:to-brand-pink text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-brand-pink/25"
                >
                  Limpar busca
                </button>
              </div>
            )}

            {/* Popular Categories Section */}
            {categoriasWithStats.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Categorias Mais Populares</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoriasWithStats
                    .sort((a, b) => (b.totalAlunos || 0) - (a.totalAlunos || 0))
                    .slice(0, 3)
                    .map((categoria) => (
                      <Link
                        key={`popular-${categoria.id}`}
                        href={`/franqueado/academy/categorias/${categoria.slug}`}
                        className="group bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl border border-gray-600/50 p-8 hover:border-brand-pink/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-pink/10 animate-fade-up"
                      >
                        <div className="flex items-center space-x-4 mb-6">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                            style={{ backgroundColor: categoria.cor }}
                          >
                            <DynamicIcon name={categoria.icon} className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-xl group-hover:text-brand-pink transition-colors duration-300 mb-1">
                              {categoria.nome}
                            </h3>
                            <p className="text-gray-400">{categoria.totalAlunos?.toLocaleString()} alunos inscritos</p>
                          </div>
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                            <div className="text-2xl font-bold text-white mb-1">{categoria.totalCursos}</div>
                            <div className="text-gray-400">Cursos</div>
                          </div>
                          <div className="text-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                            <div className="text-2xl font-bold text-white mb-1">{categoria.mediaRating}</div>
                            <div className="text-gray-400">Avaliação</div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-700/50">
                          <div className="flex items-center justify-center text-brand-pink font-semibold group-hover:translate-x-1 transition-transform duration-300">
                            <span>Explorar categoria</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
