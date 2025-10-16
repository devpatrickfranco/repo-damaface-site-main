"use client"

import { useState } from "react"
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Search,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Award,
  List,
  Loader2,
} from "lucide-react"
import { apiBackend } from "@/lib/api-backend"
import type { Trilha } from "@/types/academy"
import DynamicIcon from "@/app/franqueado/academy/components/DynamicIcon"
import allIconNames from "@/data/academy/lucide-icon-names.json"

interface TrilhaManageProps {
  trilhas: Trilha[]
  refetchTrilhas: () => void
}

const slugify = (text: string): string => {
  if (!text) return ""

  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export default function TrilhaManage({ trilhas, refetchTrilhas }: TrilhaManageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [iconSearchTerm, setIconSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descricao: "",
    cursos: "",
    certificacao: false,
    icon: "BookOpen",
    cor: "#3b82f6",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredIcons = allIconNames
    .filter((iconName) => iconName.toLowerCase().includes(iconSearchTerm.toLowerCase()))
    .slice(0, 100)

  const openCreateModal = () => {
    setFormData({
      titulo: "",
      slug: "",
      descricao: "",
      cursos: "",
      certificacao: false,
      icon: "BookOpen",
      cor: "#3b82f6",
    })
    setModalMode("create")
    setSelectedTrilha(null)
    setShowModal(true)
  }

  const openEditModal = (trilha: Trilha) => {
    setFormData({
      titulo: trilha.titulo,
      slug: trilha.slug,
      descricao: trilha.descricao,
      cursos: Array.isArray(trilha.cursos)
        ? trilha.cursos.map((curso) => (typeof curso === "object" ? curso.id : curso)).join(", ")
        : "",
      certificacao: trilha.certificacao || false,
      icon: trilha.icon as string,
      cor: trilha.cor,
    })
    setModalMode("edit")
    setSelectedTrilha(trilha)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowIconSelector(false)
    setIconSearchTerm("")
  }

  const handleSubmit = async () => {
    if (!formData.titulo.trim()) {
      alert("O título da trilha é obrigatório")
      return
    }
    setIsSubmitting(true)
    try {
      const slug = formData.slug.trim() ? slugify(formData.slug) : slugify(formData.titulo)

      const cursosStrArray = formData.cursos
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")

      const cursosArray: number[] = cursosStrArray.map((id) => {
        const n = Number(id)
        if (isNaN(n)) throw new Error(`ID de curso inválido: "${id}". Use apenas números.`)
        return n
      })

      const payload = {
        titulo: formData.titulo,
        slug,
        descricao: formData.descricao,
        cursos_ids: cursosArray,
        certificacao: formData.certificacao,
        icon: formData.icon,
        cor: formData.cor,
        publicada: true,
      }

      if (modalMode === "create") {
        await apiBackend.post("/academy/trilhas/", payload)
      } else if (modalMode === "edit" && selectedTrilha) {
        await apiBackend.patch(`/academy/trilhas/${selectedTrilha.slug}/`, payload)
      }
      refetchTrilhas()
      handleCloseModal()
    } catch (err: any) {
      console.error("Erro ao salvar trilha:", err)
      alert(err.message || err.response?.data?.message || "Ocorreu um erro ao salvar a trilha.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta trilha?")) {
      try {
        const trilhaToDelete = trilhas.find((t) => t.id === id)
        if (!trilhaToDelete) return
        await apiBackend.delete(`/academy/trilhas/${trilhaToDelete.slug}/`)
        refetchTrilhas()
      } catch (err: any) {
        console.error("Erro ao deletar trilha:", err)
        alert(err.response?.data?.message || "Ocorreu um erro ao deletar a trilha.")
      }
    }
  }

  const totalPages = Math.ceil(trilhas.length / itemsPerPage)
  const paginatedTrilhas = trilhas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Trilhas de Formação</h2>
            <p className="text-sm text-gray-400">Crie jornadas de aprendizado completas</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Trilha</span>
        </button>
      </div>

      {trilhas.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-lg mb-6">Nenhuma trilha encontrada</p>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25"
          >
            Criar Primeira Trilha
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTrilhas.map((trilha, index) => (
              <div
                key={trilha.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col justify-between bg-gray-900/50 p-5 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: trilha.cor }}
                  >
                    <DynamicIcon name={trilha.icon} className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold mb-1 truncate">{trilha.titulo}</div>
                    <p className="text-gray-400 text-sm line-clamp-2">{trilha.descricao || "Sem descrição"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5" title={`${trilha.cursos.length} cursos`}>
                      <List size={14} />
                      <span>{trilha.cursos.length}</span>
                    </div>
                    {trilha.certificacao && (
                      <div className="flex items-center gap-1.5 text-cyan-400" title="Oferece certificação">
                        <Award size={14} />
                        <span>Certificado</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(trilha)}
                      className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all"
                      title="Editar trilha"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trilha.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Excluir trilha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1 ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {modalMode === "create" ? "Nova Trilha" : "Editar Trilha"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título da Trilha *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Ex: Formação Completa em Vendas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Descreva o objetivo e o público-alvo desta trilha."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL amigável)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Deixe vazio para gerar automaticamente"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Apenas letras, números e hífens. Acentos serão removidos automaticamente.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">IDs dos Cursos (apenas números)</label>
                <input
                  type="text"
                  value={formData.cursos}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^[\d,\s]*$/.test(value) || value === "") {
                      setFormData((prev) => ({ ...prev, cursos: value }))
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Ex: 1, 2, 3"
                />
                <p className="text-xs text-gray-400 mt-1">Separe os IDs dos cursos por vírgula. Exemplo: 1, 2, 3</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="certificacao"
                  checked={formData.certificacao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, certificacao: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-500 bg-gray-600 text-cyan-500 focus:ring-cyan-500/50"
                />
                <label htmlFor="certificacao" className="ml-3 block text-sm font-medium text-gray-300">
                  Oferece certificação ao concluir
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cor da Trilha</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.cor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))}
                      className="w-12 h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.cor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: formData.cor }}
                    >
                      <DynamicIcon name={formData.icon} className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIconSelector(!showIconSelector)}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{showIconSelector ? "Fechar Seletor" : "Selecionar Ícone"}</span>
                      {showIconSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {showIconSelector && (
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        placeholder="Buscar ícones..."
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Mostrando {filteredIcons.length} de {allIconNames.length} ícones
                    </p>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-64 overflow-y-auto">
                    {filteredIcons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, icon: iconName }))
                        }}
                        className={`p-3 rounded-lg border transition-all flex items-center justify-center hover:bg-gray-600 ${
                          formData.icon === iconName ? "border-cyan-500 bg-cyan-500/20" : "border-gray-600 bg-gray-700"
                        }`}
                        title={iconName}
                      >
                        <DynamicIcon name={iconName} className="w-5 h-5 text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{modalMode === "create" ? "Criar Trilha" : "Salvar Alterações"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
