export type FileType = "file" | "folder"

export interface FileItem {
  // Campos visuais essenciais
  id: string
  originalId: number // ID original do banco de dados (sem prefixo)
  name: string
  type: FileType
  mimeType?: string

  // Metadados
  size?: number
  modifiedAt: Date
  parentId: string | null
  url?: string
  path?: string
  stats?: {
    files: number
    folders: number
  }
  // Upload local
  file?: File
}

export interface FolderOption {
  id: string
  label: string
}

// Tipos para controle de progresso
export interface UploadProgress {
  total: number
  completed: number
  failed: number
  current?: string
}

export interface UploadResult {
  success: string[]
  failed: Array<{ name: string; error: string }>
}

// --- TIPOS INTERNOS DA API (Snake Case do Django) ---
export interface BackendFolder {
  id: number
  nome: string
  pasta_pai: number | null
  caminho_completo: string
  ultima_modificacao: string
  total_arquivos: number
  total_subpastas: number
}

export interface BackendFile {
  id: number
  nome: string
  folder: number | null
  tamanho: number
  tipo: string
  arquivo_url: string
  caminho_completo: string
  ultima_modificacao: string
}

export interface Breadcrumb {
  id: number
  nome: string
}

export interface APIContentResponse {
  current_folder: BackendFolder | null
  breadcrumbs: Breadcrumb[]
  folders: BackendFolder[]
  files: BackendFile[]
}

// --- TIPOS PARA HOOK DE DOWNLOAD ---

/**
 * Arquivo do Drive para download (compatível com useFileDownload)
 */
export type DriveFile = {
  id: number
  nome: string
  arquivo_url: string
}

/**
 * Pasta do Drive (compatível com useFileDownload)
 */
export type DriveFolder = {
  id: number
  nome: string
}

// --- FUNÇÕES DE CONVERSÃO ---

/**
 * Converte FileItem para DriveFile (para uso com useFileDownload)
 */
export function fileItemToDriveFile(item: FileItem): DriveFile | null {
  if (item.type !== 'file' || !item.url) return null

  return {
    id: item.originalId,
    nome: item.name,
    arquivo_url: item.url
  }
}

/**
 * Converte Breadcrumb para DriveFolder (para uso com useFileDownload)
 */
export function breadcrumbToDriveFolder(breadcrumb: Breadcrumb): DriveFolder {
  return {
    id: breadcrumb.id,
    nome: breadcrumb.nome
  }
}