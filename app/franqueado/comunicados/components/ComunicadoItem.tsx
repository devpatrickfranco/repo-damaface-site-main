"use client"

import { useAuth } from "@/context/AuthContext"
import { apiBackend } from "@/lib/api-backend"
import type { ComunicadoType } from "@/types/comunicado"
import { useState } from "react"
import { EyeIcon, CheckIcon, ClockIcon, FileText } from "lucide-react"

interface ComunicadoItemProps {
  comunicado: ComunicadoType
  onUpdate: () => void
  onViewDetails: (comunicado: ComunicadoType) => void
  onEdit?: (comunicado: ComunicadoType) => void 
} 

export default function ComunicadoItem({ comunicado, onUpdate, onViewDetails, onEdit }: ComunicadoItemProps) {
  const { user } = useAuth(); // Assume que `user` tem `id` e `role`
  const [isLoading, setIsLoading] = useState(false);
  const [isRead, setIsRead] = useState(comunicado.lido_pelo_usuario_atual);

  // Variáveis de controle
  const isOwner = comunicado.autor?.id === user?.id;
  const isSuperAdmin = user?.role === "SUPERADMIN";

  // Função para chamar a nova Action View
  const handleAction = async (action: 'send_for_approval' | 'approve') => {
    const confirmText = action === 'approve' 
        ? "Tem certeza que deseja aprovar este comunicado?"
        : "Enviar este comunicado para aprovação?";
    if (!confirm(confirmText)) return;

    setIsLoading(true);
    try {
      await apiBackend.post(`/dashboard/comunicados/${comunicado.id}/actions/`, { action });
      onUpdate();
    } catch (error) {
      console.error(`Falha ao ${action}`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.")) return;
    setIsLoading(true);
    try {
      await apiBackend.delete(`/dashboard/comunicados/${comunicado.id}/`);
      onUpdate();
    } catch (error) {
      console.error("Falha ao excluir", error);
    } finally {
      setIsLoading(false);
    }
  }


  const isFranqueado = user?.role === "FRANQUEADO" || user?.role === "FUNCIONARIO"

  const showMarkAsReadButton = isFranqueado && comunicado.status === "APROVADO" && !isRead
  const canBeApproved = comunicado.status === "PENDENTE_APROVACAO" || comunicado.status === "RASCUNHO"
  // Formata a data para um formato legível
  const formattedDate = new Date(comunicado.data_publicacao).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Extrai texto limpo do HTML para preview
  const getTextPreview = (html: string, maxLength = 150) => {
    const div = document.createElement("div")
    div.innerHTML = html
    const text = div.textContent || div.innerText || ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div
      className={`bg-gray-800 rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/10 ${
        !isRead && comunicado.status === "APROVADO"
          ? "border-pink-500/30 shadow-pink-500/5"
          : "border-gray-700 hover:border-gray-600"
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">{comunicado.titulo}</h3>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span className="flex items-center">
                Por: <span className="text-gray-300 ml-1">{comunicado.autor?.nome || "Sistema"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formattedDate}
              </span>
              {comunicado.anexos && comunicado.anexos.length > 0 && (
                <>
                  <span>•</span>
                  <span 
                    className="flex items-center text-pink-400 hover:text-pink-300 transition-colors cursor-help"
                    title={`${comunicado.anexos.length} arquivo${comunicado.anexos.length > 1 ? "s" : ""} anexo${comunicado.anexos.length > 1 ? "s" : ""}`}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    {comunicado.anexos.length} arquivo{comunicado.anexos.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            {!isRead && comunicado.status === "APROVADO" && (
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            )}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                comunicado.status === "APROVADO"
                  ? "bg-green-500/20 text-green-400"
                  : comunicado.status === "PENDENTE_APROVACAO"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {comunicado.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {getTextPreview(comunicado.conteudo)}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-900/50 ...">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Lógica para ENVIAR PARA APROVAÇÃO */}
              {isOwner && comunicado.status === "RASCUNHO" && (
                <button onClick={() => handleAction('send_for_approval')} disabled={isLoading} className="btn-secondary">
                  Enviar p/ Aprovação
                </button>
              )}

              {/* Lógica para APROVAR */}
              {isSuperAdmin && comunicado.status === "PENDENTE_APROVACAO" && (
                <button onClick={() => handleAction('approve')} disabled={isLoading} className="btn-success">
                  Aprovar
                </button>
              )}
              
              {(isOwner && comunicado.status !== 'APROVADO') && (
                <button 
                  onClick={() => onEdit?.(comunicado)} 
                  disabled={isLoading}
                  className="btn-secondary"
                >
                  Editar
                </button>
              )}
              
              {/* Lógica para EXCLUIR */}
              {((isOwner && comunicado.status !== 'APROVADO') || isSuperAdmin) && (
                  <button onClick={handleDelete} disabled={isLoading} className="btn-danger">
                      Excluir
                  </button>
              )}
            </div>
            <button onClick={() => onViewDetails(comunicado)} className="btn-primary">
              Ver Detalhes
            </button>
          </div>
        </div>
    </div>
  )
}
