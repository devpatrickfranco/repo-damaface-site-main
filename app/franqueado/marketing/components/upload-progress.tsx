// components/upload-progress.tsx
"use client"

import { X, Upload, CheckCircle2, AlertCircle, Loader2, FileIcon, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { UploadProgress } from "@/types/marketing"

interface UploadProgressProps {
  progress: UploadProgress | null
  onCancel?: () => void
}

export function UploadProgressToast({ progress, onCancel }: UploadProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!progress) return null

  const percentage = Math.round((progress.completed / progress.total) * 100)
  const isComplete = progress.completed === progress.total
  const hasErrors = progress.failed > 0
  const isUploading = !isComplete

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 flex-1">
          {isComplete ? (
            hasErrors ? (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">
              {isComplete
                ? hasErrors
                  ? `${progress.completed - progress.failed} upload${progress.completed - progress.failed !== 1 ? 's' : ''} concluído${progress.completed - progress.failed !== 1 ? 's' : ''}`
                  : `${progress.total} upload${progress.total !== 1 ? 's' : ''} concluído${progress.total !== 1 ? 's' : ''}`
                : `Fazendo upload de ${progress.total} ${progress.total === 1 ? 'item' : 'itens'}`}
            </h3>
            <p className="text-xs text-gray-400">
              {isComplete
                ? hasErrors
                  ? `${progress.failed} ${progress.failed === 1 ? 'falhou' : 'falharam'}`
                  : 'Tudo pronto!'
                : `${progress.completed} de ${progress.total}`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {progress.total > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title={isExpanded ? "Recolher" : "Expandir"}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isComplete
                ? hasErrors
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-blue-500"
              }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* File List - Expandable */}
      {isExpanded && progress.total > 0 && (
        <div className="max-h-60 overflow-y-auto">
          {/* Current uploading file */}
          {!isComplete && progress.current && (
            <div className="px-4 py-3 border-b border-gray-700/50 bg-gray-750">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileIcon className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">
                    {progress.current}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                    <span className="text-xs text-blue-400">Iniciando upload...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed files indicator */}
          {progress.completed > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">
                    {progress.completed} arquivo{progress.completed !== 1 ? 's' : ''} enviado{progress.completed !== 1 ? 's' : ''}
                  </p>
                  {hasErrors && (
                    <p className="text-xs text-yellow-400 mt-0.5">
                      {progress.failed} com erro{progress.failed !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {isComplete && (
        <div className="px-4 py-3 bg-gray-750">
          <button
            onClick={onCancel}
            className="w-full py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  )
}

// Versão alternativa: Mini progress inline no header
export function UploadProgressInline({ progress }: { progress: UploadProgress | null }) {
  if (!progress) return null

  const percentage = Math.round((progress.completed / progress.total) * 100)
  const isComplete = progress.completed === progress.total
  const hasErrors = progress.failed > 0

  return (
    <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 min-w-[200px]">
      {isComplete ? (
        hasErrors ? (
          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        )
      ) : (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-white">
            {isComplete
              ? hasErrors
                ? "Concluído com erros"
                : "Concluído"
              : "Enviando"}
          </span>
          <span className="text-xs text-gray-400">
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className={`h-full transition-all duration-300 ${isComplete
                ? hasErrors
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-blue-500"
              }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}