"use client"

import { Download, MoveRight, Edit, Trash2, X } from "lucide-react"
import type { FileItem } from "@/types/marketing"

interface SelectionBarProps {
  selectedIds: Set<string>
  selectedFileId: string | null
  files: FileItem[]
  onDownload: () => void
  onMove: () => void
  onRename: (id: string, newName: string) => void
  onDelete: () => void
  onClear: () => void
}

export function SelectionBar({
  selectedIds,
  selectedFileId,
  files,
  onDownload,
  onMove,
  onRename,
  onDelete,
  onClear,
}: SelectionBarProps) {
  if (selectedIds.size === 0) return null

  const selectedFile = selectedFileId ? files.find((f) => f.id === selectedFileId) : null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-pink/20 text-brand-pink font-bold text-lg">
            {selectedIds.size}
          </div>
          <span className="text-sm text-gray-300">
            {selectedIds.size === 1 ? "item selecionado" : "itens selecionados"}
          </span>
        </div>

        <div className="w-px h-8 bg-gray-700" />

        <div className="flex items-center gap-1">
          <button
            onClick={onDownload}
            className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Download"
          >
            <Download size={20} />
          </button>

          {selectedIds.size === 1 && selectedFile?.type === "file" && (
            <button
              onClick={onMove}
              className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
              title="Mover para..."
            >
              <MoveRight size={20} />
            </button>
          )}

          {selectedIds.size === 1 && (
            <button
              onClick={() => {
                const id = Array.from(selectedIds)[0]
                const file = files.find((f) => f.id === id)
                if (file) {
                  const newName = prompt("Novo nome:", file.name)
                  if (newName && newName.trim()) {
                    onRename(id, newName.trim())
                  }
                }
              }}
              className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
              title="Renomear"
            >
              <Edit size={20} />
            </button>
          )}

          <button
            onClick={() => {
              const count = selectedIds.size
              if (confirm(`Tem certeza que deseja excluir ${count} ${count === 1 ? "item" : "itens"}?`)) {
                onDelete()
              }
            }}
            className="p-2.5 hover:bg-red-600/20 rounded-full transition-colors text-gray-300 hover:text-red-400"
            title="Excluir"
          >
            <Trash2 size={20} />
          </button>

          <button
            onClick={onClear}
            className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
            title="Limpar seleção"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
