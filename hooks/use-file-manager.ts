"use client"

import { useState, useCallback, useEffect } from "react"
import { apiBackend, getBlob } from "@/lib/api-backend"
import type { FileItem, APIContentResponse, Breadcrumb } from "@/types/marketing"



// --- HOOK PRINCIPAL ---

export function useFileManager() {
  // Estado de Dados
  const [files, setFiles] = useState<FileItem[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Estado de Navegação e Seleção
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // 1. CARREGAMENTO DE DADOS (READ)
  const fetchContent = useCallback(async () => {
    setIsLoading(true)
    try {
      // Decide qual endpoint chamar (Raiz ou Pasta Específica)
      const url = currentFolderId
        ? `/marketing/folders/${currentFolderId}/conteudo/`
        : `/marketing/folders/root_content/`

      const data = await apiBackend.get<APIContentResponse>(url)

      // Mapeia PASTAS (Backend -> FileItem)
      const mappedFolders: FileItem[] = data.folders.map((f) => ({
        id: String(f.id),
        name: f.nome,
        type: "folder",
        modifiedAt: new Date(f.ultima_modificacao),
        parentId: f.pasta_pai ? String(f.pasta_pai) : null,
        path: f.caminho_completo,
        stats: {
          files: f.total_arquivos,
          folders: f.total_subpastas
        }
      }))

      // Mapeia ARQUIVOS (Backend -> FileItem)
      const mappedFiles: FileItem[] = data.files.map((f) => ({
        id: String(f.id),
        name: f.nome,
        type: "file",
        size: f.tamanho,
        modifiedAt: new Date(f.ultima_modificacao),
        parentId: f.folder ? String(f.folder) : null,
        mimeType: f.tipo,
        url: f.arquivo_url,
        path: f.caminho_completo
      }))

      setFiles([...mappedFolders, ...mappedFiles])
      setBreadcrumbs(data.breadcrumbs || [])

    } catch (error) {
      console.error("Erro ao carregar arquivos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentFolderId])

  // Recarrega sempre que mudar a pasta atual
  useEffect(() => {
    fetchContent()
    // Limpa seleção ao navegar
    setSelectedIds(new Set())
    setSelectedFileId(null)
    setIsSelectionMode(false)
  }, [fetchContent])


  // 2. AÇÕES DE ESCRITA (CREATE, UPDATE, DELETE)

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId)
  }, [])

  const createFolder = useCallback(async (name: string) => {
    if (!name.trim()) return
    try {
      await apiBackend.post("/folders/", {
        nome: name.trim(),
        pasta_pai: currentFolderId ? parseInt(currentFolderId) : null
      })
      await fetchContent()
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
    }
  }, [currentFolderId, fetchContent])

  const processUpload = useCallback(async (input: FileList | { file: File }[]) => {
    const fileList = Array.isArray(input) ? input : Array.from(input).map(i => ({ file: i }))
    if (!fileList.length) return

    setIsLoading(true)
    try {
      // Upload em paralelo
      const promises = fileList.map(item => {
        const file = 'file' in item ? item.file : item
        const formData = new FormData()
        formData.append("arquivo", file as File)
        
        if (currentFolderId) {
          formData.append("folder", currentFolderId)
        }
        // Opcional: Se quiser garantir o nome exato
        // formData.append("nome", file.name)

        return apiBackend.post("/marketing/drive/", formData)
      })

      await Promise.all(promises)
      await fetchContent()

    } catch (error) {
      console.error("Erro no upload:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentFolderId, fetchContent])

  const handleRename = useCallback(async (id: string, newName: string) => {
    const item = files.find(f => f.id === id)
    if (!item) return

    try {
      const endpoint = item.type === "folder" 
        ? `/marketing/folders/${id}/` 
        : `/marketing/drive/${id}/`
      
      await apiBackend.patch(endpoint, { nome: newName })
      await fetchContent()
    } catch (error) {
      console.error("Erro ao renomear:", error)
    }
  }, [files, fetchContent])

  const deleteItemsByIds = useCallback(async (ids: Set<string>) => {
    try {
      const promises = Array.from(ids).map(id => {
        const item = files.find(f => f.id === id)
        if (!item) return Promise.resolve()
        
        const endpoint = item.type === "folder" 
          ? `/marketing/folders/${id}/` 
          : `/marketing/drive/${id}/`
        
        return apiBackend.delete(endpoint)
      })

      await Promise.all(promises)
      await fetchContent()
      
      // Limpa seleção após deletar
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }, [files, fetchContent])

  const handleDelete = useCallback((id: string) => {
    deleteItemsByIds(new Set([id]))
  }, [deleteItemsByIds])

  const handleMove = useCallback(async (itemId: string, targetFolderId: string | null) => {
    const item = files.find(f => f.id === itemId)
    if (!item || item.type !== "file") {
      console.warn("Movimentação de pastas ainda não suportada.")
      return
    }

    try {
      await apiBackend.post(`/marketing/drive/${itemId}/mover/`, {
        target_folder_id: targetFolderId ? parseInt(targetFolderId) : null
      })
      await fetchContent()
      // Limpa seleção após mover
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    } catch (error) {
      console.error("Erro ao mover:", error)
    }
  }, [files, fetchContent])


  // 3. DOWNLOADS

  const handleDownloadItem = useCallback(async (id: string) => {
    const item = files.find(f => f.id === id)
    if (!item || item.type !== "file") return

    try {
      // Usa a URL direta se disponível, ou endpoint de download seguro
      if (item.url) {
        window.open(item.url, '_blank')
      } else {
        // Fallback via Blob
        const blob = await getBlob(`/marketing/drive/${id}/`) 
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = item.name
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Erro no download:", error)
    }
  }, [files])

  const handleDownload = useCallback(() => {
    if (selectedIds.size === 0) return
    // Baixa o primeiro selecionado como exemplo
    const firstId = Array.from(selectedIds)[0]
    handleDownloadItem(firstId)
  }, [selectedIds, handleDownloadItem])


  // 4. LÓGICA DE SELEÇÃO (Visual)

  const toggleSelect = useCallback((id: string, isFile: boolean) => {
    if (!isSelectionMode) {
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
        if (selectedFileId === id) setSelectedFileId(null)
      } else {
        next.add(id)
        if (isFile) setSelectedFileId(id)
      }
      return next
    })
  }, [isSelectionMode, selectedFileId])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setSelectedFileId(null)
    setIsSelectionMode(false)
  }, [])

  const toggleSelectionMode = useCallback(() => {
    if (isSelectionMode) {
      clearSelection()
    } else {
      setIsSelectionMode(true)
      setSelectedIds(new Set())
      setSelectedFileId(null)
    }
  }, [isSelectionMode, clearSelection])

  const getCurrentFolderFiles = useCallback(() => files, [files])

  // Retorno da Hook
  return {
    // Dados
    files,
    breadcrumbs,
    isLoading,
    
    // Estado
    currentFolderId,
    selectedFileId,
    selectedIds,
    isSelectionMode,
    
    // Getters
    getCurrentFolderFiles,
    
    // Ações
    navigateToFolder,
    processUpload,
    handleDelete,
    deleteItemsByIds,
    handleRename,
    handleMove,
    createFolder,
    handleDownload,
    handleDownloadItem,
    
    // Seleção
    toggleSelect,
    clearSelection,
    toggleSelectionMode,
    setCurrentFolderId
  }
}