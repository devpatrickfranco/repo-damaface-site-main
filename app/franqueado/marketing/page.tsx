"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { useFileManager } from "@/hooks/use-file-manager"
import { getFolderPath } from "./helper"
import { SearchBar } from "./components/search-bar"
import { Toolbar } from "./components/toolbar"
import { Breadcrumb } from "./components/breadcrumb"
import { FileGrid } from "./components/file-grid"
import { FileList } from "./components/file-list"
import { EmptyState } from "./components/empty-state"
import { SelectionBar } from "./components/selection-bar"
import { CreateFolderModal } from "./components/create-folder-modal"
import { MoveModal } from "./components/move-modal"
import { DragOverlay } from "./components/drag-overlay"

type UploadItem = { file: File; relativePath?: string }

export default function FileManagerPage() {
  const {
    files,
    currentFolderId,
    selectedFileId,
    selectedIds,
    isSelectionMode,
    getCurrentFolderFiles,
    navigateToFolder,
    processUpload,
    handleDelete,
    handleRename,
    handleMove,
    createFolder,
    toggleSelect,
    clearSelection,
    toggleSelectionMode,
    deleteItemsByIds,
    setCurrentFolderId,
    handleDownload,
    handleDownloadItem
  } = useFileManager()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const filteredFiles = useMemo(() => {
    const currentFiles = getCurrentFolderFiles()
    if (!searchQuery.trim()) return currentFiles
    return currentFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [getCurrentFolderFiles, searchQuery])

  const { folders, fileItems } = useMemo(() => {
    const folders = filteredFiles.filter((f) => f.type === "folder")
    const fileItems = filteredFiles.filter((f) => f.type === "file")
    return { folders, fileItems }
  }, [filteredFiles])

  const folderPath = getFolderPath(files, currentFolderId)

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const getFilesFromDataTransferItems = async (items: DataTransferItemList): Promise<UploadItem[]> => {
    const traverseEntry = (entry: any, path: string): Promise<UploadItem[]> => {
      return new Promise((resolve) => {
        if (entry.isFile) {
          entry.file((file: File) => {
            const relativePath = path ? `${path}/${file.name}` : file.name
            resolve([{ file, relativePath }])
          })
        } else if (entry.isDirectory) {
          const reader = entry.createReader()
          const entries: any[] = []
          const readBatch = () => {
            reader.readEntries(async (batch: any[]) => {
              if (batch.length) {
                entries.push(...batch)
                readBatch()
              } else {
                const results = await Promise.all(
                  entries.map((child) => traverseEntry(child, path ? `${path}/${entry.name}` : entry.name)),
                )
                resolve(results.flat())
              }
            })
          }
          readBatch()
        } else {
          resolve([])
        }
      })
    }

    const promises: Promise<UploadItem[]>[] = []
    Array.from(items).forEach((item) => {
      const entry = typeof (item as any).webkitGetAsEntry === "function" ? (item as any).webkitGetAsEntry() : null
      if (entry) {
        promises.push(traverseEntry(entry, ""))
      } else if (item.kind === "file") {
        const file = item.getAsFile()
        if (file) promises.push(Promise.resolve([{ file, relativePath: file.name }]))
      }
    })

    const uploadFiles = await Promise.all(promises)
    return uploadFiles.flat()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (
      e.dataTransfer?.items &&
      Array.from(e.dataTransfer.items).some((it) => typeof (it as any).webkitGetAsEntry === "function")
    ) {
      const uploadFiles = await getFilesFromDataTransferItems(e.dataTransfer.items)
      if (uploadFiles.length) {
        processUpload(uploadFiles as any)
      }
    } else if (e.dataTransfer?.files?.length) {
      processUpload(e.dataTransfer.files)
    }
  }

  // Handlers
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName)
      setNewFolderName("")
      setShowCreateFolderModal(false)
    }
  }

  const handleItemClick = (id: string, isFile: boolean) => {
    if (isSelectionMode) {
      toggleSelect(id, isFile)
    } else if (isFile) {
      toggleSelect(id, isFile)
    }
  }

  const handleFolderDoubleClick = (folderId: string) => {
    if (!isSelectionMode) {
      navigateToFolder(folderId)
    }
  }

  // 2. REMOVIDO: A função handleBulkDownload antiga foi removida daqui

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    deleteItemsByIds(new Set(selectedIds))
  }

  const handleNavigateHome = useCallback(() => {
    setCurrentFolderId(null)
    setSearchQuery("")
    clearSelection()
  }, [setCurrentFolderId, clearSelection])

  return (
    <div
      className="min-h-screen bg-gray-900 text-white"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragOverlay isVisible={isDragging} />

      <div className="max-w-7xl mx-auto p-6">
        

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Meus Arquivos</h1>
              <p className="text-gray-400 text-sm">Gerencie seus arquivos e pastas de marketing</p>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <Toolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFileUpload={processUpload}
            onFolderUpload={processUpload}
            onCreateFolder={() => setShowCreateFolderModal(true)}
            isSelectionMode={isSelectionMode}
            onToggleSelectionMode={toggleSelectionMode}
          />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb
          path={folderPath}
          onNavigate={(folderId) => {
            if (folderId === null) {
              handleNavigateHome()
            } else {
              navigateToFolder(folderId)
            }
          }}
        />

        {/* Content */}
        {filteredFiles.length === 0 ? (
          <EmptyState isSearching={!!searchQuery} />
        ) : viewMode === "grid" ? (
          <FileGrid
            folders={folders}
            files={fileItems}
            selectedIds={selectedIds}
            isSelectionMode={isSelectionMode}
            onItemClick={handleItemClick}
            onFolderDoubleClick={handleFolderDoubleClick}
            onToggleSelect={toggleSelect}
            onRename={handleRename}
            onDelete={handleDelete}
            onDownload={handleDownloadItem} 
          />
        ) : (
          <FileList
            folders={folders}
            files={fileItems}
            selectedIds={selectedIds}
            isSelectionMode={isSelectionMode}
            onItemClick={handleItemClick}
            onFolderDoubleClick={handleFolderDoubleClick}
            onToggleSelect={toggleSelect}
            onRename={handleRename}
            onDelete={handleDelete}
            onDownload={handleDownloadItem}
          />
        )}

        {/* Modals */}
        <CreateFolderModal
          isOpen={showCreateFolderModal}
          folderName={newFolderName}
          onFolderNameChange={setNewFolderName}
          onCreate={handleCreateFolder}
          onClose={() => {
            setShowCreateFolderModal(false)
            setNewFolderName("")
          }}
        />

        <MoveModal
          isOpen={showMoveModal}
          files={files}
          selectedFileId={selectedFileId}
          onMove={(destinationId) => {
            if (selectedFileId) {
              handleMove(selectedFileId, destinationId)
            }
            setShowMoveModal(false)
          }}
          onClose={() => setShowMoveModal(false)}
        />

        {/* Selection Bar */}
        <SelectionBar
          selectedIds={selectedIds}
          selectedFileId={selectedFileId}
          files={files}
          onDownload={handleDownload} // <--- 3. CONECTADO: Usando a nova função
          onMove={() => setShowMoveModal(true)}
          onRename={handleRename}
          onDelete={handleBulkDelete}
          onClear={clearSelection}
        />
      </div>
    </div>
  )
}