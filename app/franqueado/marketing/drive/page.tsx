"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useFileManager } from "@/hooks/use-file-manager"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import type React from "react"

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
import { UploadProgressToast, UploadProgressInline } from "./components/upload-progress"
import { DownloadProgressToast } from "./components/download-progress"
import { MoveProgressToast } from "./components/move-progress"
import type { SortOption } from "./components/sort-dropdown"
import type { DownloadProgress } from "@/hooks/useFileDownload"

type UploadItem = { file: File; relativePath?: string }



export default function FileManagerPage() {

  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado")
    }
  }, [isAuthenticated, authLoading, router])

  const {
    files,
    isLoading,
    currentFolderId,
    selectedFileId,
    selectedIds,
    isSelectionMode,
    uploadProgress,
    moveProgress,
    getCurrentFolderFiles,
    navigateToFolder,
    processUpload,
    handleDelete,
    handleRename,
    handleMove,
    handleMoveBatch,
    createFolder,
    toggleSelect,
    clearSelection,
    toggleSelectionMode,
    deleteItemsByIds,
    setCurrentFolderId,
    handleDownload,
    handleDownloadItem,
    breadcrumbs,
    searchFiles,
    globalSearchResults,
    isSearching
  } = useFileManager()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")

  // Estado para scroll e highlight
  const [scrollToId, setScrollToId] = useState<string | null>(null)

  // Efeito para scrollar até o arquivo quando a lista for carregada
  useEffect(() => {
    if (!scrollToId || isLoading) return

    const element = document.getElementById(`file-item-${scrollToId}`)
    if (element) {
      // Scroll suave
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Adiciona highlight visual temporário
      element.classList.add('ring-2', 'ring-cyan-500', 'bg-gray-800')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-cyan-500', 'bg-gray-800')
        setScrollToId(null)
      }, 2000)
    }
  }, [scrollToId, isLoading, files])

  const filteredFiles = useMemo(() => {
    const files = getCurrentFolderFiles()

    // Apply sorting
    return [...files].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
        case "name-desc":
          return b.name.localeCompare(a.name, 'pt-BR', { sensitivity: 'base' })
        case "date-desc":
          return b.modifiedAt.getTime() - a.modifiedAt.getTime()
        case "date-asc":
          return a.modifiedAt.getTime() - b.modifiedAt.getTime()
        default:
          return 0
      }
    })
  }, [getCurrentFolderFiles, sortOption])

  const { folders, fileItems } = useMemo(() => {
    const folders = filteredFiles.filter((f) => f.type === "folder")
    const fileItems = filteredFiles.filter((f) => f.type === "file")
    return { folders, fileItems }
  }, [filteredFiles])

  const folderPath = useMemo(() => {
    return breadcrumbs.map((b) => ({
      id: `folder-${b.id}`,
      name: b.nome,
    }))
  }, [breadcrumbs])

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

            <div className="flex items-center gap-3">
              {/* ✨ OPÇÃO 1: Progress inline no header (discreto) */}
              <UploadProgressInline progress={uploadProgress} />

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={searchFiles}
                results={globalSearchResults}
                isSearching={isSearching}
                onResultClick={(item) => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.id)
                    setScrollToId(item.id)
                  } else {
                    if (item.parentId) {
                      navigateToFolder(item.parentId)
                      setScrollToId(item.id)
                    }
                  }
                  setSearchQuery("") // Clear search after selection
                }}
              />
            </div>
          </div>

          <Toolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFileUpload={processUpload}
            onFolderUpload={processUpload}
            onCreateFolder={() => setShowCreateFolderModal(true)}
            isSelectionMode={isSelectionMode}
            onToggleSelectionMode={toggleSelectionMode}
            sortOption={sortOption}
            onSortChange={setSortOption}
            userRole={user?.role}
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
            userRole={user?.role}
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
            userRole={user?.role}
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
          selectedIds={selectedIds}
          onMove={(destinationId) => {
            if (selectedIds.size > 0 && isSelectionMode) {
              handleMoveBatch(Array.from(selectedIds), destinationId)
            } else if (selectedFileId) {
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
          breadcrumbs={breadcrumbs}
          onMove={() => setShowMoveModal(true)}
          onRename={handleRename}
          onDelete={handleBulkDelete}
          onClear={clearSelection}
          onDownloadProgressChange={setDownloadProgress}
          userRole={user?.role}
        />
      </div>

      <UploadProgressToast
        progress={uploadProgress}
        onCancel={() => {
        }}
      />

      <DownloadProgressToast
        progress={downloadProgress}
        onCancel={() => setDownloadProgress(null)}
      />

      <MoveProgressToast
        progress={moveProgress}
        onCancel={() => { }}
      />
    </div>
  )
}