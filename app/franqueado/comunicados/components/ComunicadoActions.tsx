// components/dashboard/ComunicadoActions.tsx

"use client"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import CriarComunicadoModal from "./CriarComunicadoModal"

export default function ComunicadoActions() {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Função para ser passada para o modal, para que ele possa avisar quando um novo comunicado foi criado
  const handleSuccess = () => {
    console.log("Comunicado criado, recarregar lista!")
  }

  const canCreate = user?.role === "ADMIN" || user?.role === "SUPERADMIN"

  if (!canCreate) {
    return null
  }

  return (
    <>
      <div className="mb-4">
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          + Criar Novo Comunicado
        </button>
      </div>

      <CriarComunicadoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} isEditMode={false} />
    </>
  )
}
