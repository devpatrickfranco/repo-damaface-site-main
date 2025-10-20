"use client"

import { useState } from "react"
import ComunicadoItem from "./ComunicadoItem"
import ComunicadoDetailModal from "./ComunicadoDetailModal"
import CriarComunicadoModal from "./CriarComunicadoModal"
import type { ComunicadoType } from "@/types/comunicado"

interface ComunicadoListProps {
  comunicados: ComunicadoType[]
  onUpdate: () => void
}

export default function ComunicadoList({ comunicados, onUpdate }: ComunicadoListProps) {
  const [selectedComunicado, setSelectedComunicado] = useState<ComunicadoType | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  
  // Estados para edição
  const [editingComunicado, setEditingComunicado] = useState<ComunicadoType | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleViewDetails = (comunicado: ComunicadoType) => {
    console.log("[v0] Abrindo detalhes do comunicado:", comunicado)
    setSelectedComunicado(comunicado)
    setIsDetailModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedComunicado(null)
  }

  // Função para abrir modal de edição
  const handleEdit = (comunicado: ComunicadoType) => {
    setEditingComunicado(comunicado)
    setIsEditModalOpen(true)
  }

  // Função para fechar modal de edição
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingComunicado(null)
  }

  // Função para sucesso da edição
  const handleEditSuccess = () => {
    onUpdate() // Atualiza a lista
    handleCloseEditModal() // Fecha o modal
  }

  // Função para quando marcar como lido
  const handleMarcarComoLido = (comunicadoId: number) => {
    console.log("[v0] Marcando comunicado como lido:", comunicadoId)
    // Atualiza o estado local do comunicado selecionado
    if (selectedComunicado && selectedComunicado.id === comunicadoId) {
      setSelectedComunicado({
        ...selectedComunicado,
        lido_pelo_usuario_atual: true
      })
    }
     
    // Atualiza a lista completa
    onUpdate()
  }

  // <CHANGE> Adicionada validação mais robusta para comunicados
  console.log("[v0] Comunicados recebidos no ComunicadoList:", comunicados)
  console.log("[v0] Tipo:", typeof comunicados, "É array?", Array.isArray(comunicados))

  if (!comunicados || !Array.isArray(comunicados) || comunicados.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Nenhum comunicado encontrado</h3>
          <p className="text-gray-400">Quando houver comunicados disponíveis, eles aparecerão aqui.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {comunicados.map((comunicado) => (
          <ComunicadoItem
            key={comunicado.id}
            comunicado={comunicado}
            onUpdate={onUpdate}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Modal de detalhes com callback para marcar como lido */}
      <ComunicadoDetailModal 
        comunicado={selectedComunicado} 
        isOpen={isDetailModalOpen} 
        onClose={handleCloseModal}
        onMarcarComoLido={handleMarcarComoLido}
      />

      {/* Modal de edição */}
      <CriarComunicadoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        comunicadoParaEdicao={editingComunicado}
        isEditMode={true}
      />
    </>
  )
}