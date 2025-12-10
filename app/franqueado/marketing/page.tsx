"use client"

import React, { useState, useRef, useMemo } from "react"
import {
  Folder,
  type File,
  Upload,
  FolderPlus,
  ChevronRight,
  Home,
  Download,
  Trash2,
  Edit,
  ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  FileSpreadsheet,
  FileCode,
  MoveRight,
  Search,
  Grid3X3,
  List,
  X,
  CheckSquare,
} from "lucide-react"

// Tipos para o sistema de arquivos
type FileType = "file" | "folder"

interface FileItem {
  id: string
  name: string
  type: FileType
  size?: number
  modifiedAt: Date
  parentId: string | null
  mimeType?: string
  file?: File
}

// Função auxiliar para formatar tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

// Função para obter ícone baseado no tipo de arquivo
const getFileIcon = (mimeType?: string, name?: string, size = 24): React.ReactElement => {
  if (!mimeType && !name) return <FileText className="text-blue-400" size={size} />

  const extension = name?.split(".").pop()?.toLowerCase() || ""
  const type = mimeType?.split("/")[0] || ""

  if (type === "image" || ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return <ImageIcon className="text-green-400" size={size} />
  }
  if (type === "video" || ["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) {
    return <Video className="text-purple-400" size={size} />
  }
  if (type === "audio" || ["mp3", "wav", "ogg", "flac"].includes(extension)) {
    return <Music className="text-pink-400" size={size} />
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return <Archive className="text-amber-400" size={size} />
  }
  if (["xls", "xlsx", "csv"].includes(extension)) {
    return <FileSpreadsheet className="text-green-500" size={size} />
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(extension)) {
    return <FileCode className="text-orange-400" size={size} />
  }
  if (["pdf"].includes(extension)) {
    return <FileText className="text-red-400" size={size} />
  }

  return <FileText className="text-blue-400" size={size} />
}

export default function MarketingPage() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Documentos",
      type: "folder",
      modifiedAt: new Date("2024-01-15"),
      parentId: null,
    },
    {
      id: "2",
      name: "Imagens",
      type: "folder",
      modifiedAt: new Date("2024-01-20"),
      parentId: null,
    },
    {
      id: "3",
      name: "relatorio.pdf",
      type: "file",
      size: 2456789,
      modifiedAt: new Date("2024-01-18"),
      parentId: null,
      mimeType: "application/pdf",
    },
    {
      id: "4",
      name: "apresentacao.pptx",
      type: "file",
      size: 5678901,
      modifiedAt: new Date("2024-01-19"),
      parentId: null,
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    },
    {
      id: "5",
      name: "Subpasta",
      type: "folder",
      modifiedAt: new Date("2024-01-21"),
      parentId: "1",
    },
  ])

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [moveTargetId, setMoveTargetId] = useState<string | null>(null)
  const [moveBrowseFolderId, setMoveBrowseFolderId] = useState<string | null>(null)
  const [moveSearch, setMoveSearch] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Obter arquivos da pasta atual
  const getCurrentFolderFiles = (): FileItem[] => {
    return files.filter((file) => file.parentId === currentFolderId)
  }

  // Filtrar arquivos por pesquisa
  const filteredFiles = useMemo(() => {
    const currentFiles = getCurrentFolderFiles()
    if (!searchQuery.trim()) return currentFiles

    return currentFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [files, currentFolderId, searchQuery])

  // Separar pastas e arquivos
  const { folders, fileItems } = useMemo(() => {
    const folders = filteredFiles.filter((f) => f.type === "folder")
    const fileItems = filteredFiles.filter((f) => f.type === "file")
    return { folders, fileItems }
  }, [filteredFiles])

  // Obter caminho da pasta atual (breadcrumb)
  const getFolderPath = (): FileItem[] => {
    const path: FileItem[] = []
    let currentId = currentFolderId

    while (currentId) {
      const folder = files.find((f) => f.id === currentId && f.type === "folder")
      if (folder) {
        path.unshift(folder)
        currentId = folder.parentId
      } else {
        break
      }
    }

    return path
  }

  // Caminho completo de uma pasta para exibir no seletor de destino
  const getFolderFullPath = (folderId: string): string => {
    const segments: string[] = []
    let current = files.find((f) => f.id === folderId && f.type === "folder")

    while (current) {
      segments.unshift(current.name)
      current = current.parentId ? files.find((f) => f.id === current?.parentId && f.type === "folder") : undefined
    }

    return segments.join(" / ") || "Meus Arquivos"
  }

  // Lista de pastas disponíveis para mover arquivos
  const folderOptions = useMemo(
    () =>
      files
        .filter((f) => f.type === "folder")
        .map((folder) => ({
          id: folder.id,
          label: getFolderFullPath(folder.id),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [files],
  )

  // Pastas dentro da navegação atual do modal de mover
  const moveChildren = useMemo(
    () => files.filter((f) => f.type === "folder" && f.parentId === moveBrowseFolderId),
    [files, moveBrowseFolderId],
  )

  // Breadcrumb para a navegação do modal de mover
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

  // Busca global por pastas pelo nome
  const moveSearchResults = useMemo(() => {
    if (!moveSearch.trim()) return []
    return files.filter((f) => f.type === "folder" && f.name.toLowerCase().includes(moveSearch.toLowerCase()))
  }, [files, moveSearch])

  // Navegar para uma pasta
  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId)
    setSelectedFileId(null)
    setSelectedIds(new Set())
    setSearchQuery("")
    setIsSelectionMode(false)
  }

  // Criar nova pasta
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: "folder",
      modifiedAt: new Date(),
      parentId: currentFolderId,
    }

    setFiles((prev) => [...prev, newFolder])
    setNewFolderName("")
    setShowCreateFolderModal(false)
  }

  type UploadItem = { file: File; relativePath?: string }

  // Adiciona arquivos simples no diretório atual
  const addFlatFiles = (items: UploadItem[], parent: string | null) => {
    const newFiles: FileItem[] = items.map(({ file }) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "file" as FileType,
      size: file.size,
      modifiedAt: new Date(),
      parentId: parent,
      mimeType: file.type,
      file: file,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  // Adiciona arquivos preservando subpastas via relativePath (webkitRelativePath ou path calculado)
  const addFilesWithPaths = (items: UploadItem[], parent: string | null) => {
    const folderMap = new Map<string, FileItem>()
    const basePath = parent || "root"

    items.forEach(({ file, relativePath }) => {
      const pathParts = (relativePath || file.webkitRelativePath || file.name).split("/")
      const fileName = pathParts.pop() || file.name

      let currentPath = ""
      let parentId = parent

      pathParts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part
        const folderKey = `${basePath}/${currentPath}`

        if (!folderMap.has(folderKey)) {
          const folderId = `folder_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
          const folder: FileItem = {
            id: folderId,
            name: part,
            type: "folder",
            modifiedAt: new Date(),
            parentId: parentId,
          }
          folderMap.set(folderKey, folder)
          parentId = folderId
        } else {
          parentId = folderMap.get(folderKey)!.id
        }
      })

      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: fileName,
        type: "file",
        size: file.size,
        modifiedAt: new Date(),
        parentId: parentId,
        mimeType: file.type,
        file: file,
      }

      folderMap.set(`file_${fileItem.id}`, fileItem)
    })

    setFiles((prev) => [...prev, ...Array.from(folderMap.values())])
  }

  // Normaliza input (FileList ou UploadItem[]) para UploadItem[]
  const normalizeUploadItems = (input: FileList | UploadItem[]): UploadItem[] => {
    if (Array.isArray(input)) return input
    return Array.from(input).map((file) => ({
      file,
      relativePath: file.webkitRelativePath || undefined,
    }))
  }

  // Decide entre upload simples ou com estrutura de pastas
  const processUpload = (input: FileList | UploadItem[]) => {
    const items = normalizeUploadItems(input)
    if (!items.length) return

    const hasPath = items.some((i) => i.relativePath && i.relativePath.includes("/"))
    if (hasPath) {
      addFilesWithPaths(items, currentFolderId)
    } else {
      addFlatFiles(items, currentFolderId)
    }
  }

  // Upload via input de arquivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return
    processUpload(uploadedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Upload via input de pastas
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return
    processUpload(uploadedFiles)
    if (folderInputRef.current) {
      folderInputRef.current.value = ""
    }
  }

  // Drag & drop (arquivos ou pastas)
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

  // Lê entradas (pastas) via FileSystem API quando disponível
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

    const files = await Promise.all(promises)
    return files.flat()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (
      e.dataTransfer?.items &&
      Array.from(e.dataTransfer.items).some((it) => typeof (it as any).webkitGetAsEntry === "function")
    ) {
      const files = await getFilesFromDataTransferItems(e.dataTransfer.items)
      if (files.length) {
        processUpload(files)
      }
    } else if (e.dataTransfer?.files?.length) {
      processUpload(e.dataTransfer.files)
    }
  }

  // Coleta filhos recursivamente para exclusão
  const collectDescendants = (itemId: string, allItems: FileItem[], acc: Set<string>) => {
    allItems
      .filter((f) => f.parentId === itemId)
      .forEach((child) => {
        acc.add(child.id)
        collectDescendants(child.id, allItems, acc)
      })
  }

  // Exclui múltiplos itens em uma única operação
  const deleteItemsByIds = (ids: Set<string>) => {
    const idsToDelete = new Set<string>(ids)
    ids.forEach((id) => collectDescendants(id, files, idsToDelete))

    setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)))

    if (currentFolderId && idsToDelete.has(currentFolderId)) {
      setCurrentFolderId(null)
    }

    setSelectedFileId(null)
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }

  // Deletar arquivo/pasta (e seu conteúdo) em uma única operação
  const handleDelete = (id: string) => {
    deleteItemsByIds(new Set([id]))
  }

  // Renomear arquivo/pasta
  const handleRename = (id: string, newName: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)))
    setSelectedFileId(null)
  }

  // Mover arquivo selecionado para outra pasta (ou raiz)
  const handleMoveSelectedFile = () => {
    if (!selectedFileId) return

    const file = files.find((f) => f.id === selectedFileId)
    if (!file) return

    const destination = moveTargetId ?? null

    // Validação: já está na pasta escolhida
    if (file.parentId === destination) {
      setShowMoveModal(false)
      setMoveTargetId(null)
      setMoveBrowseFolderId(null)
      setMoveSearch("")
      return
    }

    setFiles((prev) =>
      prev.map((f) => (f.id === selectedFileId ? { ...f, parentId: destination, modifiedAt: new Date() } : f)),
    )

    setShowMoveModal(false)
    setMoveTargetId(null)
    setMoveBrowseFolderId(null)
    setMoveSearch("")
    setSelectedFileId(null)
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }

  const toggleSelect = (id: string, isFile: boolean) => {
    if (!isSelectionMode) {
      // Fora do modo de seleção, apenas seleciona o arquivo para mostrar na hotbar
      if (isFile) {
        setSelectedFileId(id)
        setSelectedIds(new Set([id]))
      }
      return
    }

    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        if (selectedFileId === id) {
          setSelectedFileId(null)
        }
      } else {
        next.add(id)
        if (isFile) {
          setSelectedFileId(id)
        }
      }
      return next
    })
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
    setSelectedFileId(null)
    setIsSelectionMode(false)
  }

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      clearSelection()
    } else {
      setIsSelectionMode(true)
      setSelectedIds(new Set())
      setSelectedFileId(null)
    }
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    deleteItemsByIds(new Set(selectedIds))
  }

  const handleBulkDownload = () => {
    const selectedFiles = files.filter((f) => selectedIds.has(f.id) && f.type === "file" && f.file)
    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo com conteúdo para baixar.")
      return
    }

    selectedFiles.forEach((file) => {
      if (!file.file) return
      const url = URL.createObjectURL(file.file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 500)
    })
  }

  const handleItemClick = (id: string, isFile: boolean) => {
    if (isSelectionMode) {
      toggleSelect(id, isFile)
    } else if (isFile) {
      // Seleciona apenas este arquivo para mostrar na hotbar
      setSelectedFileId(id)
      setSelectedIds(new Set([id]))
    }
  }

  const handleFolderDoubleClick = (folderId: string) => {
    if (!isSelectionMode) {
      navigateToFolder(folderId)
    }
  }

  const folderPath = getFolderPath()

  return (
    <div
      className="min-h-screen bg-gray-900 text-white"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-brand-pink/60 rounded-3xl px-8 py-6 bg-gray-900/80 text-center shadow-2xl">
            <p className="text-lg font-medium text-white">Solte para enviar</p>
            <p className="text-sm text-gray-300 mt-1">Arquivos ou pastas serão enviados para a pasta atual</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header com barra de pesquisa estilo Google Drive */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Meus Arquivos</h1>
              <p className="text-gray-400 text-sm">Gerencie seus arquivos e pastas de marketing</p>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar arquivos..."
                className="w-full pl-12 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium text-sm"
            >
              <Upload size={18} />
              <span>Upload Arquivo</span>
            </button>
            <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />

            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium text-sm border border-gray-600"
            >
              <Upload size={18} />
              <span>Upload Pasta</span>
            </button>
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: "" } as any)}
              multiple
              onChange={handleFolderUpload}
              className="hidden"
            />

            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium text-sm border border-gray-600"
            >
              <FolderPlus size={18} />
              <span>Nova Pasta</span>
            </button>

            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors font-medium text-sm border ${
                isSelectionMode
                  ? "bg-brand-pink text-white border-brand-pink"
                  : "bg-gray-700 hover:bg-gray-600 border-gray-600"
              }`}
            >
              <CheckSquare size={18} />
              <span>{isSelectionMode ? "Cancelar seleção" : "Selecionar"}</span>
            </button>

            <div className="flex-1" />

            <div className="flex items-center bg-gray-800 rounded-full p-1 border border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "grid" ? "bg-gray-700 text-brand-pink" : "text-gray-400 hover:text-white"
                }`}
                title="Visualização em grade"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === "list" ? "bg-gray-700 text-brand-pink" : "text-gray-400 hover:text-white"
                }`}
                title="Visualização em lista"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-sm">
          <button
            onClick={() => {
              setCurrentFolderId(null)
              setSelectedFileId(null)
              setSelectedIds(new Set())
              setSearchQuery("")
              setIsSelectionMode(false)
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
          >
            <Home size={16} />
            <span>Meus Arquivos</span>
          </button>
          {folderPath.map((folder) => (
            <div key={folder.id} className="flex items-center gap-1.5">
              <ChevronRight size={16} className="text-gray-500" />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="px-2 py-1 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* Conteúdo */}
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            {searchQuery ? (
              <>
                <Search size={64} className="text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">Nenhum resultado encontrado</p>
                <p className="text-gray-500 text-sm mt-2">Tente buscar por outro termo</p>
              </>
            ) : (
              <>
                <Folder size={64} className="text-brand-pink/50 mb-4" />
                <p className="text-gray-400 text-lg">Esta pasta está vazia</p>
                <p className="text-gray-500 text-sm mt-2">
                  Faça upload de arquivos ou crie uma nova pasta para começar
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Seção de Pastas */}
            {folders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Pastas</h2>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {folders.map((item) => (
                      <div
                        key={item.id}
                        onDoubleClick={() => handleFolderDoubleClick(item.id)}
                        onClick={() => handleItemClick(item.id, false)}
                        className={`group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          selectedIds.has(item.id) ? "ring-2 ring-brand-pink bg-gray-800" : ""
                        }`}
                      >
                        {isSelectionMode && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id, false)}
                            className="absolute top-2 left-2 h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {/* Ações rápidas para pasta - só aparecem fora do modo de seleção */}
                        {!isSelectionMode && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const newName = prompt("Novo nome da pasta:", item.name)
                                if (newName && newName.trim()) {
                                  handleRename(item.id, newName.trim())
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
                                  handleDelete(item.id)
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
                ) : (
                  <div className="space-y-1">
                    {folders.map((item) => (
                      <div
                        key={item.id}
                        onDoubleClick={() => handleFolderDoubleClick(item.id)}
                        onClick={() => handleItemClick(item.id, false)}
                        className={`group relative flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                          selectedIds.has(item.id) ? "bg-gray-800 ring-1 ring-brand-pink" : ""
                        }`}
                      >
                        {isSelectionMode && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id, false)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-brand-pink focus:ring-brand-pink"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        <Folder
                          size={24}
                          className="text-brand-pink flex-shrink-0"
                          fill="currentColor"
                          fillOpacity={0.2}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-200 group-hover:text-white truncate" title={item.name}>
                            {item.name}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{item.modifiedAt.toLocaleDateString("pt-BR")}</p>

                        {/* Ações rápidas para pasta (lista) - só aparecem fora do modo de seleção */}
                        {!isSelectionMode && (
                          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const newName = prompt("Novo nome da pasta:", item.name)
                                if (newName && newName.trim()) {
                                  handleRename(item.id, newName.trim())
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
                                  handleDelete(item.id)
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
                )}
              </div>
            )}

            {/* Seção de Arquivos */}
            {fileItems.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">Arquivos</h2>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {fileItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id, true)}
                        className={`group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          selectedIds.has(item.id) ? "ring-2 ring-brand-pink bg-gray-800" : ""
                        }`}
                      >
                        {isSelectionMode && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id, true)}
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
                ) : (
                  <div className="space-y-1">
                    {fileItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id, true)}
                        className={`group flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 ${
                          selectedIds.has(item.id) ? "bg-gray-800 ring-1 ring-brand-pink" : ""
                        }`}
                      >
                        {isSelectionMode && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id, true)}
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
                        {item.size && (
                          <p className="text-sm text-gray-500 hidden sm:block">{formatFileSize(item.size)}</p>
                        )}
                        <p className="text-sm text-gray-500">{item.modifiedAt.toLocaleDateString("pt-BR")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal de criação de pasta */}
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Criar Nova Pasta</h3>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateFolder()
                    } else if (e.key === "Escape") {
                      setShowCreateFolderModal(false)
                      setNewFolderName("")
                    }
                  }}
                  placeholder="Nome da pasta"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent mb-6"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateFolderModal(false)
                      setNewFolderName("")
                    }}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de mover arquivo */}
        {showMoveModal && selectedFileId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-xl font-semibold">Mover arquivo</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Selecione o destino para o arquivo{" "}
                    <span className="text-gray-200 font-medium">
                      {files.find((f) => f.id === selectedFileId)?.name}
                    </span>
                  </p>
                </div>

                {/* Busca e navegação */}
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

                  {/* Breadcrumb de navegação */}
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

                  {/* Botão selecionar pasta atual */}
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
                    {/* Resultados da busca global */}
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
                              title={getFolderFullPath(folder.id)}
                            >
                              <Folder size={16} className="text-brand-pink" />
                              <span className="text-sm truncate">{getFolderFullPath(folder.id)}</span>
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

                    {/* Pastas na pasta atual */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                        Pastas em {moveBrowseFolderId ? getFolderFullPath(moveBrowseFolderId) : "Meus Arquivos"}
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
                    onClick={() => {
                      setShowMoveModal(false)
                      setMoveTargetId(null)
                      setMoveBrowseFolderId(null)
                      setMoveSearch("")
                    }}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleMoveSelectedFile}
                    className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium"
                  >
                    Mover
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl z-40">
            <div className="flex items-center gap-6">
              {/* Mostra quantidade de itens selecionados */}
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
                {/* Download - só mostra se tiver arquivos selecionados */}
                <button
                  onClick={handleBulkDownload}
                  className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                  title="Download"
                >
                  <Download size={20} />
                </button>

                {/* Mover - só funciona com 1 arquivo selecionado */}
                {selectedIds.size === 1 &&
                  selectedFileId &&
                  files.find((f) => f.id === selectedFileId)?.type === "file" && (
                    <button
                      onClick={() => {
                        const file = files.find((f) => f.id === selectedFileId)
                        if (file?.type === "file") {
                          setMoveTargetId(file.parentId ?? null)
                          setMoveBrowseFolderId(file.parentId ?? null)
                          setMoveSearch("")
                          setShowMoveModal(true)
                        }
                      }}
                      className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                      title="Mover para..."
                    >
                      <MoveRight size={20} />
                    </button>
                  )}

                {/* Renomear - só funciona com 1 item selecionado */}
                {selectedIds.size === 1 && (
                  <button
                    onClick={() => {
                      const id = Array.from(selectedIds)[0]
                      const file = files.find((f) => f.id === id)
                      if (file) {
                        const newName = prompt("Novo nome:", file.name)
                        if (newName && newName.trim()) {
                          handleRename(id, newName.trim())
                        }
                      }
                    }}
                    className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                    title="Renomear"
                  >
                    <Edit size={20} />
                  </button>
                )}

                {/* Excluir */}
                <button
                  onClick={() => {
                    const count = selectedIds.size
                    if (confirm(`Tem certeza que deseja excluir ${count} ${count === 1 ? "item" : "itens"}?`)) {
                      handleBulkDelete()
                    }
                  }}
                  className="p-2.5 hover:bg-red-600/20 rounded-full transition-colors text-gray-300 hover:text-red-400"
                  title="Excluir"
                >
                  <Trash2 size={20} />
                </button>

                {/* Fechar / Limpar seleção */}
                <button
                  onClick={clearSelection}
                  className="p-2.5 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                  title="Limpar seleção"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}