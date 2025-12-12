// components/upload-progress.tsx
"use client"

import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import type { UploadProgress } from "@/types/marketing"

interface UploadProgressProps {
  progress: UploadProgress | null
  onCancel?: () => void
}

export function UploadProgressToast({ progress, onCancel }: UploadProgressProps) {
  if (!progress) return null

  const percentage = Math.round((progress.completed / progress.total) * 100)
  const isComplete = progress.completed === progress.total
  const hasErrors = progress.failed > 0

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {isComplete ? (
            hasErrors ? (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )
          ) : (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isComplete
                ? hasErrors
                  ? "Upload concluído com erros"
                  : "Upload concluído"
                : "Enviando arquivos"}
            </h3>
            <p className="text-xs text-gray-400">
              {progress.completed} de {progress.total} arquivo{progress.total > 1 ? "s" : ""}
              {hasErrors && ` • ${progress.failed} falha${progress.failed > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        
        {isComplete && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete
                ? hasErrors
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Current File */}
        {!isComplete && progress.current && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <Upload className="w-3 h-3" />
            <span className="truncate">{progress.current}</span>
          </div>
        )}

        {/* Percentage */}
        <div className="mt-2 text-right text-xs font-medium text-gray-300">
          {percentage}%
        </div>
      </div>
    </div>
  )
}

// Versão alternativa: Mini progress inline no header
export function UploadProgressInline({ progress }: { progress: UploadProgress | null }) {
  if (!progress) return null

  const percentage = Math.round((progress.completed / progress.total) * 100)
  const isComplete = progress.completed === progress.total

  return (
    <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
      {isComplete ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-white">
            {isComplete ? "Concluído" : "Enviando"}
          </span>
          <span className="text-xs text-gray-400">
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}   