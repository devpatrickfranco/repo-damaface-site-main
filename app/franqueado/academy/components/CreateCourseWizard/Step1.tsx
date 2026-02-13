"use client"

// components/CreateCourseWizard/Step1.tsx
import type React from "react"
import { useRef } from "react"
import type { Categoria } from "@/types/academy"
import { Upload, X, ImageIcon } from "lucide-react"

// ALTERADO: Importando o tipo do nosso novo hook, que é a fonte da verdade.
import type { CourseFormData } from "@/hooks/useCourseWizard"

// A interface de props permanece a mesma, pois o componente ainda precisa desses dados.
interface Step1Props {
  formData: CourseFormData
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>
  categorias: Categoria[]
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData, categorias }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.")
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        capa: imageUrl,
        capaFile: file,
      }))
    }
  }

  const handleRemoveImage = () => {
    // Se a capa atual for uma URL de objeto, revogue-a para liberar memória
    if (formData.capa && formData.capa.startsWith("blob:")) {
      URL.revokeObjectURL(formData.capa)
    }
    setFormData((prev) => ({
      ...prev,
      // Retorna para a capa placeholder ou uma string vazia
      capa: "/placeholder-capa.svg",
      capaFile: undefined,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título do Curso */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Título do Curso *</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            placeholder="Digite o título do curso"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descrição *</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
            placeholder="Descreva o conteúdo do curso"
          />
        </div>

        {/* Upload de Capa */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Capa do Curso</label>

          {!formData.capa || formData.capa === "/placeholder-capa.svg" ? (
            <div
              onClick={triggerFileInput}
              className="w-full h-48 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-gray-800 transition-all duration-200 flex flex-col items-center justify-center group"
            >
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-pink-500 mb-2" />
              <p className="text-gray-400 group-hover:text-pink-500 font-medium">Clique para fazer upload da capa</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG até 5MB • Recomendado: 1200x600px</p>
            </div>
          ) : (
            <div className="relative w-full h-48 bg-gray-900 border border-gray-600 rounded-lg overflow-hidden">
              <img
                src={formData.capa || "/placeholder.svg"}
                alt="Capa do curso"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button
                    onClick={triggerFileInput}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Nome do Instrutor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Instrutor *</label>
          <input
            type="text"
            value={formData.instrutor.nome}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                instrutor: { ...prev.instrutor, nome: e.target.value },
              }))
            }
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            placeholder="Nome do instrutor"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoria *</label>
          <select
            value={formData.categoriaId}
            onChange={(e) => setFormData((prev) => ({ ...prev, categoriaId: Number(e.target.value) }))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Nível */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nível *</label>
          <select
            value={formData.nivel}
            onChange={(e) => setFormData((prev) => ({ ...prev, nivel: e.target.value as any }))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
          >
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>

        {/* Duração */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Duração (Estimada) *</label>
          <input
            type="text"
            value={formData.duracao}
            onChange={(e) => setFormData((prev) => ({ ...prev, duracao: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
            placeholder="Ex: 4h 30min"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as any,
                preco: e.target.value === "Livre" ? undefined : prev.preco,
              }))
            }
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
          >
            <option value="Livre">Livre</option>
            <option value="Pago">Pago</option>
          </select>
        </div>

        {/* Preço (Condicional) */}
        {formData.status === "Pago" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Preço (R$)</label>
            <input
              type="number"
              value={formData.preco ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preco: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        )}

        {/* Checkboxes: Destaque, Certificado e Franqueado */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-600 rounded-lg hover:border-pink-500/50 transition-all cursor-pointer group" onClick={() => setFormData((prev) => ({ ...prev, destaque: !prev.destaque }))}>
            <input
              type="checkbox"
              checked={formData.destaque ?? false}
              onChange={(e) => setFormData((prev) => ({ ...prev, destaque: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:ring-offset-0 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-300 cursor-pointer group-hover:text-pink-400 transition-colors">
              Destaque
            </label>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-600 rounded-lg hover:border-pink-500/50 transition-all cursor-pointer group" onClick={() => setFormData((prev) => ({ ...prev, certificado: !prev.certificado }))}>
            <input
              type="checkbox"
              checked={formData.certificado ?? false}
              onChange={(e) => setFormData((prev) => ({ ...prev, certificado: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:ring-offset-0 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-300 cursor-pointer group-hover:text-pink-400 transition-colors">
              Certificado
            </label>
          </div>
          {/* Novo Campo: Privado Franqueado */}
          <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-600 rounded-lg hover:border-pink-500/50 transition-all cursor-pointer group" onClick={() => setFormData((prev) => ({ ...prev, privado_franqueado: !prev.privado_franqueado }))}>
            <input
              type="checkbox"
              checked={formData.privado_franqueado ?? false}
              onChange={(e) => setFormData((prev) => ({ ...prev, privado_franqueado: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:ring-offset-0 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-300 cursor-pointer group-hover:text-pink-400 transition-colors">
              Franqueado
            </label>
          </div>
        </div>

        {/* Bio do Instrutor */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio do Instrutor</label>
          <textarea
            value={formData.instrutor.bio}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                instrutor: { ...prev.instrutor, bio: e.target.value },
              }))
            }
            rows={2}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all resize-none"
            placeholder="Breve biografia do instrutor"
          />
        </div>
      </div>
    </div>
  )
}

export default Step1