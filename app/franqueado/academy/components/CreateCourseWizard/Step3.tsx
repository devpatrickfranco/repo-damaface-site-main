"use client"

// components/CreateCourseWizard/Step3.tsx
import type React from "react"
import { useRef } from "react"
import type { materiais } from "@/types/academy"
import { PlusCircle, Trash2, PlayCircle, FileText, Link, Video, Upload } from "lucide-react"

import type { useCourseWizard } from "@/hooks/useCourseWizard"

interface Step3Props {
  wizard: ReturnType<typeof useCourseWizard>
}

const Step3: React.FC<Step3Props> = ({ wizard }) => {
  const {
    modulos,
    currentAula,
    setCurrentAula,
    handleAddAula,
    handleRemoveAula,
    materiaisGerais,
    currentMaterial,
    setCurrentMaterial,
    handleAddMaterial,
    handleRemoveMaterial,
  } = wizard

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (currentMaterial.tipo === "pdf" && file.type !== "application/pdf") {
        alert("Por favor, selecione apenas arquivos PDF.")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 10MB.")
        return
      }

      // ✅ CORREÇÃO: Salvando como arquivoFile e criando URL blob para preview
      const blobUrl = URL.createObjectURL(file)
      setCurrentMaterial((prev) => ({
        ...prev,
        arquivoFile: file, // ✅ Nome correto
        url: blobUrl, // ✅ URL blob para preview
      }))
    }
  }

  const getIconForMaterial = (tipo: materiais["tipo"]) => {
    switch (tipo) {
      case "pdf":
        return <FileText className="text-red-400" size={16} />
      case "link":
        return <Link className="text-blue-400" size={16} />
      case "video":
        return <Video className="text-green-400" size={16} />
      default:
        return <FileText className="text-gray-400" size={16} />
    }
  }

  const handleAddMaterialWithReset = () => {
    handleAddMaterial()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Formulário para Adicionar Aulas */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">1. Adicionar Aulas ao Curso</h3>
        <div className="space-y-4">
          <select
            value={currentAula.moduloId}
            onChange={(e) => setCurrentAula((prev) => ({ ...prev, moduloId: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Selecione o Módulo *</option>
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Título da Aula *"
            value={currentAula.titulo}
            onChange={(e) => setCurrentAula((prev) => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="ID do Vídeo no YouTube *"
              value={currentAula.video_id}
              onChange={(e) => setCurrentAula((prev) => ({ ...prev, video_id: e.target.value }))}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Duração (Ex: 10:45)"
              value={currentAula.duracao}
              onChange={(e) => setCurrentAula((prev) => ({ ...prev, duracao: e.target.value }))}
              className="w-full sm:w-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <button
            onClick={handleAddAula}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> Adicionar Aula
          </button>
        </div>
      </div>

      {/* 2. Formulário para Adicionar Materiais de Estudo */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">2. Adicionar Materiais de Estudo</h3>
        <p className="text-sm text-gray-400 mb-4">Adicione PDFs, links ou vídeos complementares para todo o curso.</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título do Material *"
            value={currentMaterial.titulo}
            onChange={(e) => setCurrentMaterial((prev) => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <select
            value={currentMaterial.tipo}
            onChange={(e) =>
              setCurrentMaterial((prev) => ({
                ...prev,
                tipo: e.target.value as materiais["tipo"],
                url: "",
                arquivoFile: undefined, // ✅ Limpa arquivo ao trocar tipo
              }))
            }
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="pdf">PDF (Upload)</option>
            <option value="link">Link Externo</option>
            <option value="video">Vídeo (URL)</option>
          </select>
          {currentMaterial.tipo === "pdf" ? (
            <div className="space-y-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 flex items-center justify-center gap-2 text-gray-300"
              >
                <Upload size={18} />
                {currentMaterial.arquivoFile ? currentMaterial.arquivoFile.name : "Clique para fazer upload do PDF"}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              <p className="text-xs text-gray-500">Máximo 10MB.</p>
            </div>
          ) : (
            <input
              type="url"
              placeholder={currentMaterial.tipo === "link" ? "URL do link *" : "URL do vídeo *"}
              value={currentMaterial.url}
              onChange={(e) => setCurrentMaterial((prev) => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          )}
          <button
            onClick={handleAddMaterialWithReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> Adicionar Material
          </button>
        </div>
      </div>

      {/* Lista de Materiais Adicionados */}
      {materiaisGerais.length > 0 && (
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-3">Materiais do Curso</h4>
          <div className="space-y-2">
            {materiaisGerais.map((material, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {getIconForMaterial(material.tipo)}
                  <div>
                    <p className="text-white font-medium">{material.titulo}</p>
                    <p className="text-sm text-gray-400 truncate max-w-xs">
                      {/* ✅ Mostra nome do arquivo para PDFs, URL para outros */}
                      {material.tipo === "pdf" && material.arquivoFile ? material.arquivoFile.name : material.url}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleRemoveMaterial(index)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Visualização da Estrutura do Curso */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">3. Estrutura do Curso</h3>
        <div className="space-y-4">
          {modulos.length > 0 ? (
            modulos.map((modulo) => (
              <div key={modulo.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="font-bold text-pink-400">{modulo.titulo}</p>
                <div className="mt-2 space-y-2">
                  {modulo.aulas.length > 0 ? (
                    modulo.aulas.map((aula) => (
                      <div key={aula.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <PlayCircle className="text-gray-500" size={16} />
                          <span>
                            {aula.titulo} ({aula.duracao})
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveAula(modulo.id, aula.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic px-2">Nenhuma aula adicionada a este módulo.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Comece adicionando módulos e aulas para ver a estrutura aqui.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step3
