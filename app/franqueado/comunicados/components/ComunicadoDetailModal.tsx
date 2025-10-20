"use client"

import { useState, useEffect } from "react"
import { apiBackend } from "@/lib/api-backend"
import type { ComunicadoType } from "@/types/comunicado"

interface ComunicadoDetailModalProps {
  comunicado: ComunicadoType | null
  isOpen: boolean
  onClose: () => void
  onMarcarComoLido?: (comunicadoId: number) => void
}

export default function ComunicadoDetailModal({ 
  comunicado, 
  isOpen, 
  onClose,
  onMarcarComoLido 
}: ComunicadoDetailModalProps) {
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isRead, setIsRead] = useState(false)

  useEffect(() => {
    if (comunicado) {
      console.log("[v0] Comunicado no modal:", comunicado)
      setIsRead(comunicado.lido_pelo_usuario_atual || false)
    }
  }, [comunicado])

  // <CHANGE> Corrigida a função de marcar como lido com melhor tratamento de resposta
  const handleMarcarComoLido = async () => {
    if (!comunicado || isRead) return

    setIsMarkingAsRead(true)
    console.log("[v0] Marcando comunicado como lido:", comunicado.id)

    try {
      const response = await apiBackend.post(`/dashboard/comunicados/${comunicado.id}/mark-as-read/`)
      console.log("[v0] Resposta ao marcar como lido:", response)
      
      setIsRead(true)
      alert('Comunicado marcado como lido!')
      
      if (onMarcarComoLido) {
        onMarcarComoLido(Number(comunicado.id))
      }
    } catch (error) {
      console.error('[v0] Erro ao marcar como lido:', error)
      alert('Erro ao marcar comunicado como lido. Tente novamente.')
    } finally {
      setIsMarkingAsRead(false)
    }
  }

  if (!comunicado || !isOpen) return null

  const getTipoBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      COMUNICADO: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      ALERTA: "bg-red-500/10 text-red-400 border border-red-500/20",
      TREINAMENTO: "bg-green-500/10 text-green-400 border border-green-500/20",
      NOVIDADE: "bg-brand-pink/10 text-brand-pink border border-brand-pink/20",
    }
    return colors[tipo] || "bg-gray-500/10 text-gray-400 border border-gray-500/20"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden m-4 flex flex-col border border-gray-700 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente sutil */}
        <div className="relative border-b border-gray-700 p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-white leading-tight">
                {comunicado.titulo}
              </h2>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getTipoBadgeColor(comunicado.tipo ?? 'COMUNICADO')}`}>
                  {comunicado.tipo ?? 'COMUNICADO'}
                </span>
                {comunicado.urgente && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Urgente
                  </span>
                )}
                {isRead && (
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Lido
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all rounded-lg p-2"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-gray-800">
          {/* Informações do autor e data com destaque */}
          <div className="relative pl-4 py-3 bg-gray-900/50 rounded-lg border-l-4 border-brand-pink">
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-pink" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-400">Autor:</span>
                <span className="text-white font-medium">{comunicado.autor?.nome || 'Não informado'}</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-pink" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400">Publicado em:</span>
                <span className="text-white font-medium">{formatDate(comunicado.data_publicacao)}</span>
              </p>
            </div>
          </div>

          {/* Conteúdo com melhor tipografia */}
          <div className="prose prose-sm max-w-none prose-invert">
            <div 
              className="text-base leading-relaxed text-gray-300 bg-gray-900/30 rounded-lg p-5 border border-gray-700/50"
              dangerouslySetInnerHTML={{ __html: comunicado.conteudo }}
            />
          </div>

          {/* Anexos com visual melhorado */}
          {comunicado.anexos && comunicado.anexos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-pink" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <h4 className="font-semibold text-white">Anexos</h4>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
                  {comunicado.anexos.length}
                </span>
              </div>
              <div className="space-y-2">
                {comunicado.anexos.map((anexo) => (
                  <a
                    key={anexo.id}
                    href={anexo.arquivo || anexo.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-brand-pink/30 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-brand-pink/50 transition-colors">
                      <svg
                        className="h-5 w-5 text-gray-400 group-hover:text-brand-pink transition-colors"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm flex-1 text-gray-300 group-hover:text-white transition-colors font-medium">
                      {anexo.nome_original}
                    </span>
                    <svg
                      className="h-5 w-5 text-gray-500 group-hover:text-brand-pink transition-colors"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões melhorados */}
        <div className="border-t border-gray-700 p-6 flex flex-col sm:flex-row gap-3 justify-end bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all text-gray-300 hover:text-white font-medium"
          >
            Fechar
          </button>
          
          {!isRead && (
            <button
              onClick={handleMarcarComoLido}
              disabled={isMarkingAsRead}
              className="px-5 py-2.5 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg shadow-brand-pink/20 hover:shadow-brand-pink/30"
            >
              {isMarkingAsRead ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Marcando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Marcar como Lido
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}