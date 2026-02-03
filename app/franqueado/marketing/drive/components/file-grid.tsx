"use client"

import { Folder, Edit, Trash2, Download } from "lucide-react"
import type { FileItem } from "@/types/marketing"
import { formatFileSize, getFileIcon } from "../helper"

interface FileGridProps {
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

export function FileGrid({
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
}: FileGridProps) {
  const isSuperAdmin = userRole === 'SUPERADMIN'
  return (
    <div className="space-y-8">
      {folders.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Pastas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((item) => (
              <div
                key={item.id}
                onDoubleClick={() => onFolderDoubleClick(item.id)}
                onClick={() => onItemClick(item.id, false)}
                id={`file-item-${item.id}`}
                className={`group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedIds.has(item.id) ? "ring-2 ring-brand-pink bg-gray-800" : ""
                  }`}
              >
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id, false)}
                    className="absolute top-2 left-2 h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {!isSelectionMode && isSuperAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-xl bg-gray-700/50 group-hover:bg-gray-700 transition-colors">
                    <Folder size={40} className="text-brand-pink" fill="currentColor" fillOpacity={0.2} />
                  </div>
                  <p
                    className="font-medium text-sm truncate w-full text-gray-200 group-hover:text-white"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.modifiedAt.toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Arquivos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemClick(item.id, true)}
                id={`file-item-${item.id}`}
                className={`group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedIds.has(item.id) ? "ring-2 ring-brand-pink bg-gray-800" : ""
                  }`}
              >
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id, true)}
                    className="absolute top-2 left-2 h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-xl bg-gray-700/50 group-hover:bg-gray-700 transition-colors">
                    {getFileIcon(item.mimeType, item.name, 40)}
                  </div>
                  <p
                    className="font-medium text-sm truncate w-full text-gray-200 group-hover:text-white"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  {item.size && <p className="text-xs text-gray-500 mt-1">{formatFileSize(item.size)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
