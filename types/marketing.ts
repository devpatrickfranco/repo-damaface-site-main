export type FileType = "file" | "folder"

export interface FileItem {
  id: string
  name: string
  type: FileType
  size?: number
  modifiedAt: Date
  parentId: string | null
  mimeType?: string
  file?: File
}

export interface FolderOption {
  id: string
  label: string
}