"use client"

import React, { useState, useMemo } from "react"
import { Search, X, Home, ChevronRight, Folder } from "lucide-react"
import type { FileItem } from "@/types/marketing"
import { getFolderFullPath } from "../helper"

interface MoveModalProps {
  isOpen: boolean
  files: FileItem[]
  selectedFileId: string | null
  onMove: (destinationId: string | null) => void
  onClose: () => void
}

export function MoveModal({ isOpen, files, selectedFileId, onMove, onClose }: MoveModalProps) {
  const [moveTargetId, setMoveTargetId] = useState<string | null>(null)
  const [moveBrowseFolderId, setMoveBrowseFolderId] = useState<string | null>(null)
  const [moveSearch, setMoveSearch] = useState("")

  const selectedFile = selectedFileId ? files.find((f) => f.id === selectedFileId) : null

  const moveChildren = useMemo(
    () => files.filter((f) => f.type === "folder" && f.parentId === moveBrowseFolderId),
    [files, moveBrowseFolderId],
  )

  const moveBreadcrumb = useMemo(() => {
    const path: FileItem[] = []
    let currentId = moveBrowseFolderId
    while (currentId) {
      const folder = files.find((f) => f.id === currentId && f.type === "folder")
      if (!folder) break
      path.unshift(folder)
      currentId = folder.parentId
    }
    return path
  }, [files, moveBrowseFolderId])

  const moveSearchResults = useMemo(() => {
    if (!moveSearch.trim()) return []
    return files.filter((f) => f.type === "folder" && f.name.toLowerCase().includes(moveSearch.toLowerCase()))
  }, [files, moveSearch])

  const handleClose = () => {
    setMoveTargetId(null)
    setMoveBrowseFolderId(null)
    setMoveSearch("")
    onClose()
  }

  const handleMove = () => {
    if (!selectedFileId) return

    const file = files.find((f) => f.id === selectedFileId)
    if (!file) return

    const destination = moveTargetId ?? null

    if (file.parentId === destination) {
      handleClose()
      return
    }

    onMove(destination)
    handleClose()
  }

  if (!isOpen || !selectedFileId) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xl font-semibold">Mover arquivo</h3>
            <p className="text-sm text-gray-400 mt-1">
              Selecione o destino para o arquivo <span className="text-gray-200 font-medium">{selectedFile?.name}</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={moveSearch}
                onChange={(e) => setMoveSearch(e.target.value)}
                placeholder="Buscar pasta pelo nome..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
              {moveSearch && (
                <button
                  onClick={() => setMoveSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <button
                onClick={() => setMoveBrowseFolderId(null)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  moveBrowseFolderId === null ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`}
              >
                <Home size={14} />
                <span>Meus Arquivos</span>
              </button>
              {moveBreadcrumb.map((folder) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight size={14} className="text-gray-600" />
                  <button
                    onClick={() => setMoveBrowseFolderId(folder.id)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      moveBrowseFolderId === folder.id ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                    }`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMoveTargetId(moveBrowseFolderId)}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  moveTargetId === moveBrowseFolderId
                    ? "border-brand-pink text-white bg-brand-pink/10"
                    : "border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white"
                }`}
              >
                <Folder size={16} />
                <span>{moveBrowseFolderId ? "Selecionar esta pasta" : "Selecionar raiz"}</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {moveSearch.trim() && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Resultados da busca</p>
                  {moveSearchResults.length === 0 && (
                    <p className="text-sm text-gray-500 px-1">Nenhuma pasta encontrada.</p>
                  )}
                  {moveSearchResults.map((folder) => (
                    <div
                      key={`search-${folder.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-750 cursor-pointer transition-colors"
                    >
                      <button
                        onClick={() => {
                          setMoveBrowseFolderId(folder.id)
                          setMoveSearch("")
                        }}
                        className="flex items-center gap-2 text-gray-200 hover:text-white truncate"
                        title={getFolderFullPath(files, folder.id)}
                      >
                        <Folder size={16} className="text-brand-pink" />
                        <span className="text-sm truncate">{getFolderFullPath(files, folder.id)}</span>
                      </button>
                      <button
                        onClick={() => setMoveTargetId(folder.id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                          moveTargetId === folder.id
                            ? "border-brand-pink text-white bg-brand-pink/10"
                            : "border-gray-600 text-gray-200 hover:border-brand-pink/60"
                        }`}
                      >
                        Selecionar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Pastas em {moveBrowseFolderId ? getFolderFullPath(files, moveBrowseFolderId) : "Meus Arquivos"}
                </p>
                {moveChildren.length === 0 && <p className="text-sm text-gray-500 px-1">Nenhuma pasta aqui.</p>}
                {moveChildren
                  .filter((folder) => folder.name.toLowerCase().includes(moveSearch.toLowerCase()))
                  .map((folder) => (
                    <div
                      key={`child-${folder.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-750 cursor-pointer transition-colors"
                    >
                      <button
                        onClick={() => setMoveBrowseFolderId(folder.id)}
                        className="flex items-center gap-2 text-gray-200 hover:text-white truncate"
                      >
                        <ChevronRight size={14} className="text-gray-500" />
                        <Folder size={16} className="text-brand-pink" />
                        <span className="text-sm truncate">{folder.name}</span>
                      </button>
                      <button
                        onClick={() => setMoveTargetId(folder.id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs border transition-colors ${
                          moveTargetId === folder.id
                            ? "border-brand-pink text-white bg-brand-pink/10"
                            : "border-gray-600 text-gray-200 hover:border-brand-pink/60"
                        }`}
                      >
                        Selecionar
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleMove}
              className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium"
            >
              Mover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
