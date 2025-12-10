import type React from "react"
import { FileText, ImageIcon, Video, Music, Archive, FileSpreadsheet, FileCode } from "lucide-react"
import type { FileItem } from "@/types/marketing"

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export const getFileIcon = (mimeType?: string, name?: string, size = 24): React.ReactElement => {
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

export const getFolderPath = (files: FileItem[], currentFolderId: string | null): FileItem[] => {
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

export const getFolderFullPath = (files: FileItem[], folderId: string): string => {
  const segments: string[] = []
  let current = files.find((f) => f.id === folderId && f.type === "folder")

  while (current) {
    segments.unshift(current.name)
    current = current.parentId ? files.find((f) => f.id === current?.parentId && f.type === "folder") : undefined
  }

  return segments.join(" / ") || "Meus Arquivos"
}
