"use client"

import { useState } from "react"
import { apiBackend } from "@/lib/api-backend"
import {
  Grid3X3,
  List,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
} from "lucide-react"
import type { Curso, Categoria } from "@/types/academy"

interface CourseViewProps {
  cursos: Curso[]
  categorias: Categoria[]
  onEditCourse: (curso: Curso) => void
  refetchCursos: () => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export default function CourseView({
  cursos,
  categorias,
  onEditCourse,
  refetchCursos,
  viewMode,
  setViewMode,
}: CourseViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const totalPages = Math.ceil(cursos.length / itemsPerPage)
  const paginatedCursos = cursos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getCategoryName = (categoryId?: number | null) => {
    if (!categoryId) return "Sem categoria"
    const category = categorias.find((cat) => cat.id === categoryId)
    if (!category) {
      console.warn("Categoria não encontrada para ID:", categoryId)
      return "Categoria não encontrada"
    }
    return category.nome
  }

  const openDeleteModal = (curso: Curso) => {
    setSelectedCourse(curso)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedCourse(null)
  }

  const handleDelete = async () => {
    if (!selectedCourse) return

    setIsDeleting(true)
    try {
      await apiBackend.delete(`/academy/cursos/${selectedCourse.slug}/`)
      refetchCursos()
      closeDeleteModal()
    } catch (err: any) {
      console.error("Erro ao deletar curso:", err)
      alert(err.response?.data?.message || "Ocorreu um erro ao deletar o curso.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (cursos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-16 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Nenhum curso encontrado</h3>
          <p className="text-gray-400">Tente ajustar os filtros ou crie um novo curso para começar</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-xl border border-gray-700/50 p-1 bg-gray-800/50 backdrop-blur-sm shadow-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "grid"
              ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            aria-label="Visualização em grade"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === "list"
              ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            aria-label="Visualização em lista"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {paginatedCursos.map((curso, index) => (
          <div
            key={curso.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <CourseCard
              curso={curso}
              categoryName={getCategoryName(curso.categoria?.id)}
              viewMode={viewMode}
              onEdit={() => onEditCourse(curso)}
              onDelete={() => openDeleteModal(curso)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="group px-4 py-2.5 text-sm font-medium text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 shadow-lg hover:shadow-xl hover:-translate-x-0.5"
          >
            <ChevronLeft className="w-4 h-4 inline-block mr-1 transition-transform group-hover:-translate-x-0.5" />
            Anterior
          </button>

          <div className="flex gap-2">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-10 h-10 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                )}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page >= currentPage - 2 && page <= currentPage + 2)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 text-sm font-medium rounded-xl transition-all shadow-lg ${currentPage === page
                    ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-pink-500/25 scale-110"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50"
                    }`}
                >
                  {page}
                </button>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="group px-4 py-2.5 text-sm font-medium text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 shadow-lg hover:shadow-xl hover:translate-x-0.5"
          >
            Próximo
            <ChevronRight className="w-4 h-4 inline-block ml-1 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}

      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Confirmar Exclusão</h3>
                  <p className="text-gray-400 text-sm">Esta ação não pode ser desfeita</p>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg p-1 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-700/50">
                <p className="text-gray-300 text-sm">
                  Tem certeza que deseja excluir o curso{" "}
                  <span className="text-white font-semibold">"{selectedCourse.titulo}"</span>?
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all font-medium"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all min-w-[140px] disabled:opacity-50 shadow-lg shadow-red-500/25"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface CourseCardProps {
  curso: Curso
  categoryName: string
  viewMode: "grid" | "list"
  onEdit: () => void
  onDelete: () => void
}

function CourseCard({ curso, categoryName, viewMode, onEdit, onDelete }: CourseCardProps) {
  return (
    <div
      className={`group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 ${viewMode === "list" ? "flex items-center" : ""
        }`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Capa / Preview */}
      {viewMode === "grid" && (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
          {curso.capa ? (
            <>
              <img
                src={curso.capa || "/placeholder.svg"}
                alt={curso.titulo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-600" />
            </div>
          )}

          {/* Badge de status */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${curso.status === "Livre"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
            >
              {curso.status}
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="relative p-5 flex-1">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors">
              {curso.titulo}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{curso.descricao}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gray-700/50 px-3 py-1 rounded-lg text-xs text-gray-300 border border-gray-600/50">
              <Sparkles className="w-3 h-3" />
              {categoryName}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-700/50 px-3 py-1 rounded-lg text-xs text-gray-300 border border-gray-600/50">
              <Clock className="w-3 h-3" />
              {curso.duracao}h
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            <Edit className="w-4 h-4 inline-block mr-1.5" />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl text-white font-medium transition-all shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
          >
            <Trash2 className="w-4 h-4 inline-block mr-1.5" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
