"use client"

import { useState, useCallback, useEffect } from "react"
import { apiBackend, getBlob } from "@/lib/api-backend"
import type { FileItem, APIContentResponse, Breadcrumb, UploadProgress, UploadResult } from "@/types/marketing"

// --- HOOK PRINCIPAL ---

export function useFileManager() {
  // Estado de Dados
  const [files, setFiles] = useState<FileItem[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Estado de Upload
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  // Estado de Navegação e Seleção
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // 1. CARREGAMENTO DE DADOS (READ)
  const fetchContent = useCallback(async () => {
    setIsLoading(true)
    try {
      const url = currentFolderId
        ? `/marketing/folders/${currentFolderId}/conteudo/`
        : `/marketing/folders/root_content/`

      const data = await apiBackend.get<APIContentResponse>(url)

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

  useEffect(() => {
    fetchContent()
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
      await apiBackend.post("/marketing/folders/", {
        nome: name.trim(),
        pasta_pai: currentFolderId ? parseInt(currentFolderId) : null
      })
      await fetchContent()
    } catch (error) {
      console.error("Erro ao criar pasta:", error)
    }
  }, [currentFolderId, fetchContent])

  // 🚀 UPLOAD OTIMIZADO - Versão com Batch e Progresso
  const processUpload = useCallback(async (input: FileList | { file: File }[]) => {
    const fileList = Array.isArray(input) ? input : Array.from(input).map(f => ({ file: f }))
    if (!fileList.length) return

    const totalFiles = fileList.length
    
    // Inicializa progresso
    setUploadProgress({
      total: totalFiles,
      completed: 0,
      failed: 0
    })

    const results: UploadResult = {
      success: [],
      failed: []
    }

    try {
      // Upload sequencial com feedback visual
      for (let i = 0; i < fileList.length; i++) {
        const item = fileList[i]
        const file = 'file' in item ? item.file : item
        
        setUploadProgress(prev => prev ? {
          ...prev,
          current: file.name
        } : null)

        try {
          const formData = new FormData()
          formData.append("arquivo", file as File)
          formData.append("nome", file.name)
          
          if (currentFolderId) {
            formData.append("folder", currentFolderId)
          }

          await apiBackend.post("/marketing/drive/", formData)
          results.success.push(file.name)
          
          setUploadProgress(prev => prev ? {
            ...prev,
            completed: prev.completed + 1
          } : null)

        } catch (error) {
          console.error(`Erro ao enviar ${file.name}:`, error)
          results.failed.push({
            name: file.name,
            error: error instanceof Error ? error.message : "Erro desconhecido"
          })
          
          setUploadProgress(prev => prev ? {
            ...prev,
            completed: prev.completed + 1,
            failed: prev.failed + 1
          } : null)
        }
      }

      // Recarrega apenas UMA vez no final
      await fetchContent()

      // Mostra resumo se houve falhas
      if (results.failed.length > 0) {
        console.warn("Alguns arquivos falharam:", results.failed)
      }

    } finally {
      // Limpa progresso após 2 segundos
      setTimeout(() => setUploadProgress(null), 2000)
    }
  }, [currentFolderId, fetchContent])

  // 🚀 ALTERNATIVA: Upload em paralelo (mais rápido, mas sem progresso granular)
  const processUploadParallel = useCallback(async (input: FileList | { file: File }[]) => {
    const fileList = Array.isArray(input) ? input : Array.from(input).map(f => ({ file: f }))
    if (!fileList.length) return

    setIsLoading(true)
    setUploadProgress({
      total: fileList.length,
      completed: 0,
      failed: 0
    })

    try {
      // Upload em paralelo (máximo 3 simultâneos)
      const BATCH_SIZE = 3
      const batches = []
      
      for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
        const batch = fileList.slice(i, i + BATCH_SIZE)
        batches.push(batch)
      }

      for (const batch of batches) {
        const promises = batch.map(item => {
          const file = 'file' in item ? item.file : item
          const formData = new FormData()
          
          formData.append("arquivo", file as File)
          formData.append("nome", file.name)
          
          if (currentFolderId) {
            formData.append("folder", currentFolderId)
          }

          return apiBackend.post("/marketing/drive/", formData)
            .then(() => {
              setUploadProgress(prev => prev ? {
                ...prev,
                completed: prev.completed + 1
              } : null)
            })
            .catch(error => {
              console.error(`Erro ao enviar ${file.name}:`, error)
              setUploadProgress(prev => prev ? {
                ...prev,
                completed: prev.completed + 1,
                failed: prev.failed + 1
              } : null)
            })
        })

        await Promise.all(promises)
      }

      await fetchContent()

    } finally {
      setIsLoading(false)
      setTimeout(() => setUploadProgress(null), 2000)
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
    if (!item) {
      console.warn("Item não encontrado.")
      return
    }

    try {
      const endpoint = item.type === "file" 
        ? `/marketing/drive/${itemId}/mover/`
        : `/marketing/folders/${itemId}/mover/`

      await apiBackend.post(endpoint, {
        item_id: parseInt(itemId),
        tipo_item: item.type,
        target_folder_id: targetFolderId ? parseInt(targetFolderId) : null
      })
      
      await fetchContent()
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    } catch (error) {
      console.error("Erro ao mover:", error)
      throw error
    }
  }, [files, fetchContent])

  // 3. DOWNLOADS

  const handleDownloadItem = useCallback(async (id: string) => {
    const item = files.find(f => f.id === id)
    if (!item || item.type !== "file") return

    try {
      if (item.url) {
        window.open(item.url, '_blank')
      } else {
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
    const firstId = Array.from(selectedIds)[0]
    handleDownloadItem(firstId)
  }, [selectedIds, handleDownloadItem])

  // 4. LÓGICA DE SELEÇÃO

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
    uploadProgress,
    
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
    processUploadParallel,
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