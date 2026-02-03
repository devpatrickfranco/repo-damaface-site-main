"use client"

import { Folder, Edit, Trash2 } from "lucide-react"
import type { FileItem } from "@/types/marketing"
import { formatFileSize, getFileIcon } from "../helper"

interface FileListProps {
  folders: FileItem[]
  files: FileItem[]
  selectedIds: Set<string>
  isSelectionMode: boolean
  onItemClick: (id: string, isFile: boolean) => void
  onFolderDoubleClick: (folderId: string) => void
  onToggleSelect: (id: string, isFile: boolean) => void
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  userRole?: 'SUPERADMIN' | 'ADMIN' | 'FRANQUEADO' | 'FUNCIONARIO'
}

export function FileList({
  folders,
  files,
  selectedIds,
  isSelectionMode,
  onItemClick,
  onFolderDoubleClick,
  onToggleSelect,
  onRename,
  onDelete,
  userRole
}: FileListProps) {
  const isSuperAdmin = userRole === 'SUPERADMIN'
  return (
    <div className="space-y-8">
      {folders.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Pastas</h2>
          <div className="space-y-1">
            {folders.map((item) => (
              <div
                key={item.id}
                onDoubleClick={() => onFolderDoubleClick(item.id)}
                onClick={() => onItemClick(item.id, false)}
                id={`file-item-${item.id}`}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 ${selectedIds.has(item.id) ? "bg-gray-800 ring-1 ring-brand-pink" : ""
                  }`}
              >
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id, false)}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <Folder size={24} className="text-brand-pink flex-shrink-0" fill="currentColor" fillOpacity={0.2} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 group-hover:text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{item.modifiedAt.toLocaleDateString("pt-BR")}</p>

                {!isSelectionMode && isSuperAdmin && (
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const newName = prompt("Novo nome da pasta:", item.name)
                        if (newName && newName.trim()) {
                          onRename(item.id, newName.trim())
                        }
                      }}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                      title="Renomear pasta"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Excluir esta pasta e todo o conteúdo dentro dela?")) {
                          onDelete(item.id)
                        }
                      }}
                      className="p-2 bg-red-700/80 hover:bg-red-600 rounded-md transition-colors"
                      title="Excluir pasta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Arquivos</h2>
          <div className="space-y-1">
            {files.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick(item.id, true)}
                id={`file-item-${item.id}`}
                className={`group flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 ${selectedIds.has(item.id) ? "bg-gray-800 ring-1 ring-brand-pink" : ""
                  }`}
              >
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id, true)}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="flex-shrink-0">{getFileIcon(item.mimeType, item.name, 24)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 group-hover:text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                </div>
                {item.size && <p className="text-sm text-gray-500 hidden sm:block">{formatFileSize(item.size)}</p>}
                <p className="text-sm text-gray-500">{item.modifiedAt.toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
