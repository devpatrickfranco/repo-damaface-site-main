"use client"

import { Download, MoveRight, Edit, Trash2, X } from "lucide-react"
import { useEffect } from "react"
import { useFileDownload } from "@/hooks/useFileDownload"
import { fileItemToDriveFile, breadcrumbToDriveFolder } from "@/types/marketing"
import type { FileItem, Breadcrumb } from "@/types/marketing"
import type { DownloadProgress } from "@/hooks/useFileDownload"

interface SelectionBarProps {
  selectedIds: Set<string>
  selectedFileId: string | null
  files: FileItem[]
  breadcrumbs: Breadcrumb[]
  onMove: () => void
  onRename: (id: string, newName: string) => void
  onDelete: () => void
  onClear: () => void
  onDownloadProgressChange?: (progress: DownloadProgress | null) => void
  userRole?: 'SUPERADMIN' | 'ADMIN' | 'FRANQUEADO' | 'FUNCIONARIO'
}

export function SelectionBar({
  selectedIds,
  selectedFileId,
  files,
  breadcrumbs,
  onMove,
  onRename,
  onDelete,
  onClear,
  onDownloadProgressChange,
  userRole,
}: SelectionBarProps) {
  const { download, isDownloading, error, downloadProgress } = useFileDownload()
  const isSuperAdmin = userRole === 'SUPERADMIN'

  // Notify parent of download progress changes
  useEffect(() => {
    if (onDownloadProgressChange) {
      onDownloadProgressChange(downloadProgress)
    }
  }, [downloadProgress, onDownloadProgressChange])

  if (selectedIds.size === 0) return null

  const selectedFile = selectedFileId ? files.find((f) => f.id === selectedFileId) : null

  const handleDownload = async () => {
    // Filtra apenas arquivos selecionados (não pastas)
    const selectedFiles = files.filter(f =>
      selectedIds.has(f.id) && f.type === 'file'
    )

    if (selectedFiles.length === 0) {
      alert('Nenhum arquivo selecionado para download')
      return
    }

    // Converte FileItems para DriveFiles
    const driveFiles = selectedFiles
      .map(fileItemToDriveFile)
      .filter(Boolean) as any[]

    if (driveFiles.length === 0) {
      alert('Arquivos selecionados não possuem URL de download')
      return
    }

    // Pega a pasta atual dos breadcrumbs
    const currentFolder = breadcrumbs.length > 0
      ? breadcrumbToDriveFolder(breadcrumbs[breadcrumbs.length - 1])
      : null

    try {
      await download(driveFiles, currentFolder)

      // Limpa seleção após download bem-sucedido
      if (!error) {
        onClear()
      }
    } catch (err) {
      console.error('Erro ao baixar arquivos:', err)
    }
  }

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
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={isDownloading ? "Baixando..." : "Download"}
          >
            <Download size={20} className={isDownloading ? "animate-pulse" : ""} />
          </button>

          {error && (
            <span className="text-red-400 text-xs max-w-[200px] truncate" title={error}>
              {error}
            </span>
          )}

          {isSuperAdmin && selectedIds.size >= 1 && (
            <button
              onClick={onMove}
              className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
              title="Mover para..."
            >
              <MoveRight size={20} />
            </button>
          )}

          {isSuperAdmin && selectedIds.size === 1 && (
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

          {isSuperAdmin && (
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
          )}

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
