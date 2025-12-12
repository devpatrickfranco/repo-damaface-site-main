import type React from "react"
import { FileText, ImageIcon, Video, Music, Archive, FileSpreadsheet, FileCode } from "lucide-react"
import type { FileItem } from "@/types/marketing"
import JSZip from "jszip"

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



export const getFolderFullPath = (files: FileItem[], folderId: string): string => {
  const segments: string[] = []
  let current = files.find((f) => f.id === folderId && f.type === "folder")

  while (current) {
    segments.unshift(current.name)
    current = current.parentId ? files.find((f) => f.id === current?.parentId && f.type === "folder") : undefined
  }

  return segments.join(" / ") || "Meus Arquivos"
}

export const downloadFilesAsZip = async (files: FileItem[], selectedIds: Set<string>) => {
  const zip = new JSZip()
  const selectedItems = files.filter((f) => selectedIds.has(f.id))

  // Função recursiva para adicionar pastas e subpastas ao zip
  const addFolderToZip = (folderId: string, currentPath: string) => {
    // Encontrar todos os filhos desta pasta
    const children = files.filter((f) => f.parentId === folderId)

    children.forEach((child) => {
      if (child.type === "file" && child.file) {
        // Se for arquivo, adiciona ao zip no caminho atual
        zip.file(`${currentPath}${child.name}`, child.file)
      } else if (child.type === "folder") {
        // Se for pasta, cria o caminho e chama recursivamente
        // O JSZip cria pastas automaticamente baseado no caminho do arquivo, 
        // mas se a pasta estiver vazia, precisamos criar explicitamente se quisermos que ela apareça
        const newPath = `${currentPath}${child.name}/`
        zip.folder(newPath)
        addFolderToZip(child.id, newPath)
      }
    })
  }

  // Processar itens selecionados na raiz da seleção
  selectedItems.forEach((item) => {
    if (item.type === "file" && item.file) {
      zip.file(item.name, item.file)
    } else if (item.type === "folder") {
      const folderPath = `${item.name}/`
      zip.folder(folderPath)
      addFolderToZip(item.id, folderPath)
    }
  })

  // Gerar o blob e disparar o download
  try {
    const content = await zip.generateAsync({ type: "blob" })

    // Criar nome do arquivo
    let zipName = "download.zip"
    if (selectedItems.length === 1) {
      zipName = `${selectedItems[0].name}.zip`
    } else if (selectedItems.length > 1) {
      zipName = `arquivos_marketing_${new Date().toISOString().slice(0, 10)}.zip`
    }

    // Criar link temporário para download
    const url = window.URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = zipName
    document.body.appendChild(a)
    a.click()

    // Limpeza
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error("Erro ao gerar ZIP:", error)
    alert("Erro ao criar arquivo ZIP. Verifique o console.")
  }
}