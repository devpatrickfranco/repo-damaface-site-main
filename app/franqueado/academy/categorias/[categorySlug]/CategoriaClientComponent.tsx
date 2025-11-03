"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useCategoria, useCursos } from "@/hooks/useApi"
import Link from "next/link"
import { Clock, Users, Star, BookOpen, Filter, Search, Grid, List, ArrowLeft } from "lucide-react"

interface CategoriaClientComponentProps {
  params: { categorySlug: string }
}

export default function CategoriaClientComponent({ params }: CategoriaClientComponentProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const { data: categoria, loading: categoriaLoading, error: categoriaError } = useCategoria(params.categorySlug)
  const { data: cursosData, loading: cursosLoading, error: cursosError } = useCursos({
    categoria: params.categorySlug,
    page_size: 100
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || categoriaLoading || cursosLoading) {
    return <p className="text-white text-center py-16">Carregando...</p>
  }

  if (categoriaError || !categoria) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-red-400 mb-2">Categoria não encontrada</h1>
        <p className="text-gray-400">A categoria solicitada não existe ou foi removida.</p>
      </div>
    )
  }

  const cursosCategoria = cursosData || []

  return (
    <div className="space-y-8">
      {/* Botão Voltar */}
      <div>
        <Link href="/franqueado/academy/categorias" className="inline-flex items-center text-white hover:text-pink-500">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </Link>
      </div>

      {/* Header da Categoria */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-pink to-brand-pink/80 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">{categoria.nome}</h1>
          <p className="text-gray-400 text-lg">
            {cursosCategoria.length} curso{cursosCategoria.length !== 1 ? "s" : ""}
          </p>
          {categoria.descricao && (
            <p className="text-gray-300 text-lg mt-2 max-w-4xl">{categoria.descricao}</p>
          )}
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-dark-base/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-brand-pink/20 border border-brand-pink/30 rounded-xl text-brand-pink hover:bg-brand-pink/30 transition-all">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:bg-gray-700/50 transition-all">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Cursos */}
      {cursosCategoria.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosCategoria.map((curso: any) => (
            <div
              key={curso.id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl overflow-hidden hover:border-brand-pink/30 hover:shadow-2xl hover:shadow-brand-pink/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-brand-pink/20 to-purple-600/20 overflow-hidden">
                {curso.imagem_capa && (
                  <img src={curso.imagem_capa} alt={curso.titulo} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand-pink/90 text-white text-sm font-medium rounded-full">
                    {categoria.nome}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white/80 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{curso.duracao || "2h 30min"}</span>
                  <Users className="w-4 h-4 ml-2" />
                  <span>{curso.alunos || 0} alunos</span>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-pink transition-colors">
                  {curso.titulo}
                </h3>
                {curso.descricao && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{curso.descricao}</p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{curso.rating || "5.0"}</span>
                    <span className="text-gray-400 text-sm">({curso.total_avaliacoes || 0})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{curso.total_aulas || 0} aulas</span>
                  </div>
                </div>

                {curso.progresso_usuario && curso.progresso_usuario > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progresso</span>
                      <span className="text-sm text-brand-pink font-medium">{curso.progresso_usuario}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-pink to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${curso.progresso_usuario}%` }}
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => router.push(`/franqueado/academy/cursos/${curso.slug}`)}
                  className="w-full bg-gradient-to-r from-brand-pink to-brand-pink/80 hover:from-brand-pink/90 hover:to-brand-pink text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/25 group-hover:scale-[1.02]"
                >
                  {curso.progresso_usuario && curso.progresso_usuario > 0 ? "Continuar Curso" : "Iniciar Curso"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 max-w-md mx-auto">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-400">Não há cursos disponíveis nesta categoria no momento.</p>
          </div>
        </div>
      )}
    </div>
  )
}
