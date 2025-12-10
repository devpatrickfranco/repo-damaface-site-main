"use client"

import { useState, useMemo, useCallback } from "react"
import type { FileItem, FileType } from "@/types/marketing"
import { getFolderFullPath } from "./helper"

const initialFiles: FileItem[] = [
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
]

type UploadItem = { file: File; relativePath?: string }

export function useFileManager() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const getCurrentFolderFiles = useCallback((): FileItem[] => {
    return files.filter((file) => file.parentId === currentFolderId)
  }, [files, currentFolderId])

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId)
    setSelectedFileId(null)
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }, [])

  const folderOptions = useMemo(
    () =>
      files
        .filter((f) => f.type === "folder")
        .map((folder) => ({
          id: folder.id,
          label: getFolderFullPath(files, folder.id),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [files],
  )

  // Upload logic
  const addFlatFiles = useCallback((items: UploadItem[], parent: string | null) => {
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
  }, [])

  const addFilesWithPaths = useCallback((items: UploadItem[], parent: string | null) => {
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
  }, [])

  const normalizeUploadItems = (input: FileList | UploadItem[]): UploadItem[] => {
    if (Array.isArray(input)) return input
    return Array.from(input).map((file) => ({
      file,
      relativePath: file.webkitRelativePath || undefined,
    }))
  }

  const processUpload = useCallback(
    (input: FileList | UploadItem[]) => {
      const items = normalizeUploadItems(input)
      if (!items.length) return

      const hasPath = items.some((i) => i.relativePath && i.relativePath.includes("/"))
      if (hasPath) {
        addFilesWithPaths(items, currentFolderId)
      } else {
        addFlatFiles(items, currentFolderId)
      }
    },
    [currentFolderId, addFilesWithPaths, addFlatFiles],
  )

  // Delete logic
  const collectDescendants = (itemId: string, allItems: FileItem[], acc: Set<string>) => {
    allItems
      .filter((f) => f.parentId === itemId)
      .forEach((child) => {
        acc.add(child.id)
        collectDescendants(child.id, allItems, acc)
      })
  }

  const deleteItemsByIds = useCallback(
    (ids: Set<string>) => {
      const idsToDelete = new Set<string>(ids)
      ids.forEach((id) => collectDescendants(id, files, idsToDelete))

      setFiles((prev) => prev.filter((f) => !idsToDelete.has(f.id)))

      if (currentFolderId && idsToDelete.has(currentFolderId)) {
        setCurrentFolderId(null)
      }

      setSelectedFileId(null)
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    },
    [files, currentFolderId],
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteItemsByIds(new Set([id]))
    },
    [deleteItemsByIds],
  )

  const handleRename = useCallback((id: string, newName: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)))
    setSelectedFileId(null)
  }, [])

  const handleMove = useCallback((fileId: string, destinationId: string | null) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, parentId: destinationId, modifiedAt: new Date() } : f)),
    )
    setSelectedFileId(null)
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }, [])

  const createFolder = useCallback(
    (name: string) => {
      if (!name.trim()) return

      const newFolder: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        type: "folder",
        modifiedAt: new Date(),
        parentId: currentFolderId,
      }
      setFiles((prev) => [...prev, newFolder])
    },
    [currentFolderId],
  )

  // Selection logic
  const toggleSelect = useCallback(
    (id: string, isFile: boolean) => {
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
    },
    [isSelectionMode, selectedFileId],
  )

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

  return {
    files,
    currentFolderId,
    selectedFileId,
    selectedIds,
    isSelectionMode,
    folderOptions,
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
  }
}
