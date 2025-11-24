"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, X, Save, Search, ChevronUp, ChevronDown, BookOpen, Loader2, Sparkles } from "lucide-react"
import { apiBackend } from "@/lib/api-backend"
import type { Categoria } from "@/types/academy"
import DynamicIcon from "@/app/franqueado/academy/components/DynamicIcon"
import allIconNames from "@/data/academy/lucide-icon-names.json"

interface CategoryManageProps {
  categorias: Categoria[]
  refetchCategorias: () => void
}

export default function CategoryManage({
  categorias,
  refetchCategorias,
}: CategoryManageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [iconSearchTerm, setIconSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    slug: "",
    icon: "Folder",
    cor: "#6b7280",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredIcons = allIconNames
    .filter((iconName) => iconName.toLowerCase().includes(iconSearchTerm.toLowerCase()))
    .slice(0, 100)

  const totalPages = Math.ceil(categorias.length / itemsPerPage)
  const paginatedCategorias = categorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const openCreateModal = () => {
    setFormData({
      nome: "",
      slug: "",
      icon: "Folder",
      cor: "#6b7280",
    })
    setModalMode("create")
    setSelectedCategory(null)
    setShowModal(true)
  }

  const openEditModal = (categoria: Categoria) => {
    setFormData({
      nome: categoria.nome,
      slug: categoria.slug,
      icon: categoria.icon as string,
      cor: categoria.cor,
    })
    setModalMode("edit")
    setSelectedCategory(categoria)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      alert("Nome da categoria é obrigatório")
      return
    }
    setIsSubmitting(true)
    try {
      const slug = formData.slug.trim() || formData.nome.toLowerCase().replace(/\s+/g, "-")
      const payload = { nome: formData.nome, slug, icon: formData.icon, cor: formData.cor }
      if (modalMode === "create") {
        await apiBackend.post('/academy/categorias/', payload)
      } else if (modalMode === "edit" && selectedCategory) {
        await apiBackend.patch(`/academy/categorias/${selectedCategory.slug}/`, payload)
      }
      refetchCategorias()
      handleCloseModal()
    } catch (err: any) {
      console.error("Erro ao salvar categoria:", err)
      alert(err.response?.data?.message || 'Ocorreu um erro ao salvar a categoria.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta categoria? Os cursos associados não serão excluídos.")) {
      try {
        const categoriaToDelete = categorias.find(c => c.id === id)
        if (!categoriaToDelete) return
        await apiBackend.delete(`/academy/categorias/${categoriaToDelete.slug}/`)
        refetchCategorias()
      } catch (err: any) {
        console.error("Erro ao deletar categoria:", err)
        alert(err.response?.data?.message || 'Ocorreu um erro ao deletar a categoria.')
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({ nome: "", slug: "", icon: "Folder", cor: "#6b7280" })
    setShowIconSelector(false)
    setIconSearchTerm("")
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Categorias</h2>
            <p className="text-sm text-gray-400">Organize seus cursos por categoria</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-pink-400" />
          </div>
          <p className="text-gray-400 text-lg mb-6">Nenhuma categoria encontrada</p>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-pink-500/25"
          >
            Criar Primeira Categoria
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCategorias.map((categoria) => (
              <div key={categoria.id} className="flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: categoria.cor }}>
                    <DynamicIcon name={categoria.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{categoria.nome}</div>
                    <div className="text-gray-400 text-sm">{categoria.slug}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => openEditModal(categoria)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-all" title="Editar categoria">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(categoria.id)} className="text-red-500 hover:text-red-600 p-2 hover:bg-red-500/10 rounded-lg transition-all" title="Excluir categoria">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50">
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 rounded ${ currentPage === index + 1 ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300" }`}>
                  {index + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50">
                Próximo
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col relative z-[10000]">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {modalMode === "create" ? "Nova Categoria" : "Editar Categoria"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Categoria *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20" placeholder="Ex: Marketing Digital"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL amigável)</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20" placeholder="Ex: marketing-digital (deixe vazio para gerar automaticamente)"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cor da Categoria</label>
                <div className="flex items-center space-x-3">
                  <input type="color" value={formData.cor} onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))} className="w-12 h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"/>
                  <input type="text" value={formData.cor} onChange={(e) => setFormData((prev) => ({ ...prev, cor: e.target.value }))} className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20" placeholder="#6b7280"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input type="text" value={formData.icon} onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))} className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20" placeholder="Digite o nome do ícone (ex: BookOpen)"/>
                    <button type="button" onClick={() => setShowIconSelector(!showIconSelector)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-all flex items-center space-x-2">
                      {showIconSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>Selecionar</span>
                    </button>
                  </div>
                  {showIconSelector && (
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input type="text" value={iconSearchTerm} onChange={(e) => setIconSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20" placeholder="Buscar ícones..."/>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Mostrando {filteredIcons.length} de {allIconNames.length} ícones</p>
                      </div>
                      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                        {filteredIcons.map((iconName) => (
                          <button key={iconName} type="button" onClick={() => { setFormData((prev) => ({ ...prev, icon: iconName })); setShowIconSelector(false); setIconSearchTerm(""); }} className={`p-3 rounded-lg border transition-all hover:bg-gray-600 ${ formData.icon === iconName ? "border-pink-500 bg-pink-500/20" : "border-gray-600 bg-gray-700" }`} title={iconName}>
                            <DynamicIcon name={iconName} className="w-5 h-5 text-white" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-sm text-gray-300 mb-3">Preview da categoria:</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: formData.cor }}>
                    <DynamicIcon name={formData.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{formData.nome || "Nome da categoria"}</div>
                    <div className="text-gray-400 text-sm">
                      {formData.slug || formData.nome.toLowerCase().replace(/\s+/g, "-") || "slug-da-categoria"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button onClick={handleCloseModal} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all w-48 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{modalMode === "create" ? "Criar Categoria" : "Salvar Alterações"}</span>
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