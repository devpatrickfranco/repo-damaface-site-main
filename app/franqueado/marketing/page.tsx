'use client'

import React, { useState, useRef } from 'react'
import { 
  Folder, 
  File, 
  Upload, 
  FolderPlus, 
  ChevronRight, 
  Home,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  FileSpreadsheet,
  FileCode
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Tipos para o sistema de arquivos
type FileType = 'file' | 'folder'

interface FileItem {
  id: string
  name: string
  type: FileType
  size?: number // em bytes
  modifiedAt: Date
  parentId: string | null
  mimeType?: string
  file?: File // Para arquivos recém-uploadados
}

// Função auxiliar para formatar tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Função para obter ícone baseado no tipo de arquivo
const getFileIcon = (mimeType?: string, name?: string): React.ReactElement => {
  if (!mimeType && !name) return <FileText className="text-blue-400" size={24} />
  
  const extension = name?.split('.').pop()?.toLowerCase() || ''
  const type = mimeType?.split('/')[0] || ''

  if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return <ImageIcon className="text-green-400" size={24} />
  }
  if (type === 'video' || ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
    return <Video className="text-purple-400" size={24} />
  }
  if (type === 'audio' || ['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
    return <Music className="text-pink-400" size={24} />
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return <Archive className="text-yellow-400" size={24} />
  }
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return <FileSpreadsheet className="text-green-500" size={24} />
  }
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml'].includes(extension)) {
    return <FileCode className="text-orange-400" size={24} />
  }
  if (['pdf'].includes(extension)) {
    return <FileText className="text-red-400" size={24} />
  }
  
  return <FileText className="text-blue-400" size={24} />
}

export default function MarketingPage() {
  const [files, setFiles] = useState<FileItem[]>([
    // Dados mockados iniciais
    {
      id: '1',
      name: 'Documentos',
      type: 'folder',
      modifiedAt: new Date('2024-01-15'),
      parentId: null
    },
    {
      id: '2',
      name: 'Imagens',
      type: 'folder',
      modifiedAt: new Date('2024-01-20'),
      parentId: null
    },
    {
      id: '3',
      name: 'relatorio.pdf',
      type: 'file',
      size: 2456789,
      modifiedAt: new Date('2024-01-18'),
      parentId: null,
      mimeType: 'application/pdf'
    },
    {
      id: '4',
      name: 'apresentacao.pptx',
      type: 'file',
      size: 5678901,
      modifiedAt: new Date('2024-01-19'),
      parentId: null,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    {
      id: '5',
      name: 'Subpasta',
      type: 'folder',
      modifiedAt: new Date('2024-01-21'),
      parentId: '1' // Dentro de "Documentos"
    }
  ])

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  // Obter arquivos da pasta atual
  const getCurrentFolderFiles = (): FileItem[] => {
    return files.filter(file => file.parentId === currentFolderId)
  }

  // Obter caminho da pasta atual (breadcrumb)
  const getFolderPath = (): FileItem[] => {
    const path: FileItem[] = []
    let currentId = currentFolderId

    while (currentId) {
      const folder = files.find(f => f.id === currentId && f.type === 'folder')
      if (folder) {
        path.unshift(folder)
        currentId = folder.parentId
      } else {
        break
      }
    }

    return path
  }

  // Navegar para uma pasta
  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId)
    setSelectedFileId(null)
  }

  // Voltar para pasta anterior
  const navigateBack = () => {
    const currentFolder = files.find(f => f.id === currentFolderId)
    if (currentFolder?.parentId !== undefined) {
      setCurrentFolderId(currentFolder.parentId)
      setSelectedFileId(null)
    } else {
      setCurrentFolderId(null) // Voltar para raiz
    }
  }

  // Criar nova pasta
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: 'folder',
      modifiedAt: new Date(),
      parentId: currentFolderId
    }

    setFiles(prev => [...prev, newFolder])
    setNewFolderName('')
    setShowCreateFolderModal(false)
  }

  // Upload de arquivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    const newFiles: FileItem[] = Array.from(uploadedFiles).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file' as FileType,
      size: file.size,
      modifiedAt: new Date(),
      parentId: currentFolderId,
      mimeType: file.type,
      file: file
    }))

    setFiles(prev => [...prev, ...newFiles])
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload de pastas (usando webkitdirectory)
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    const folderMap = new Map<string, FileItem>()
    const basePath = currentFolderId || 'root'

    // Criar estrutura de pastas
    Array.from(uploadedFiles).forEach(file => {
      const pathParts = (file.webkitRelativePath || file.name).split('/')
      const fileName = pathParts.pop() || file.name
      const folderPath = pathParts.join('/')

      // Criar pastas necessárias
      let currentPath = ''
      let parentId = currentFolderId

      pathParts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part
        const folderKey = `${basePath}/${currentPath}`

        if (!folderMap.has(folderKey)) {
          const folderId = `folder_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
          const folder: FileItem = {
            id: folderId,
            name: part,
            type: 'folder',
            modifiedAt: new Date(),
            parentId: parentId
          }
          folderMap.set(folderKey, folder)
          parentId = folderId
        } else {
          parentId = folderMap.get(folderKey)!.id
        }
      })

      // Adicionar arquivo
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: fileName,
        type: 'file',
        size: file.size,
        modifiedAt: new Date(),
        parentId: parentId,
        mimeType: file.type,
        file: file
      }

      folderMap.set(`file_${fileItem.id}`, fileItem)
    })

    // Adicionar todos os itens ao estado
    setFiles(prev => [...prev, ...Array.from(folderMap.values())])

    // Limpar input
    if (folderInputRef.current) {
      folderInputRef.current.value = ''
    }
  }

  // Deletar arquivo/pasta
  const handleDelete = (id: string) => {
    const deleteRecursive = (itemId: string) => {
      setFiles(prev => prev.filter(f => f.id !== itemId))
      // Deletar filhos recursivamente
      const children = files.filter(f => f.parentId === itemId)
      children.forEach(child => deleteRecursive(child.id))
    }

    deleteRecursive(id)
    setSelectedFileId(null)
  }

  // Renomear arquivo/pasta
  const handleRename = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, name: newName } : f
    ))
    setSelectedFileId(null)
  }

  const currentFiles = getCurrentFolderFiles()
  const folderPath = getFolderPath()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Marketing - Gerenciador de Arquivos</h1>
          <p className="text-gray-400">Gerencie seus arquivos e pastas de marketing</p>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Upload size={18} />
              <span>Upload Arquivo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Upload size={18} />
              <span>Upload Pasta</span>
            </button>
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: '' } as any)}
              multiple
              onChange={handleFolderUpload}
              className="hidden"
            />

            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <FolderPlus size={18} />
              <span>Nova Pasta</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              Lista
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
          <button
            onClick={() => {
              setCurrentFolderId(null)
              setSelectedFileId(null)
            }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home size={16} />
            <span>Principal</span>
          </button>
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight size={16} />
              <button
                onClick={() => navigateToFolder(folder.id)}
                className="hover:text-white transition-colors"
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {/* Conteúdo */}
        {currentFiles.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Folder size={64} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Esta pasta está vazia</p>
              <p className="text-gray-500 text-sm mt-2">
                Faça upload de arquivos ou crie uma nova pasta para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'space-y-2'
            }
          >
            {currentFiles.map((item) => (
              <Card
                key={item.id}
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-750 hover:border-gray-600 ${
                  selectedFileId === item.id ? 'ring-2 ring-blue-500' : ''
                } ${viewMode === 'list' ? 'flex items-center gap-4 p-3' : 'p-4'}`}
                onClick={() => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.id)
                  } else {
                    setSelectedFileId(item.id === selectedFileId ? null : item.id)
                  }
                }}
                onDoubleClick={() => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.id)
                  }
                }}
              >
                <CardContent className={viewMode === 'list' ? 'flex-1 flex items-center gap-4 p-0' : 'p-0'}>
                  <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : 'text-center'}>
                    <div className="flex-shrink-0">
                      {item.type === 'folder' ? (
                        <Folder size={viewMode === 'list' ? 32 : 48} className="text-yellow-400 mx-auto" />
                      ) : (
                        <div className="mx-auto">
                          {getFileIcon(item.mimeType, item.name)}
                        </div>
                      )}
                    </div>
                    <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'mt-2'}>
                      <p className={`font-medium truncate ${viewMode === 'list' ? 'text-base' : 'text-sm'}`}>
                        {item.name}
                      </p>
                      {viewMode === 'list' && (
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          {item.type === 'file' && item.size && (
                            <span>{formatFileSize(item.size)}</span>
                          )}
                          <span>
                            {item.modifiedAt.toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {viewMode === 'grid' && item.type === 'file' && item.size && (
                        <p className="text-xs text-gray-400 mt-1">
                          {formatFileSize(item.size)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de criação de pasta */}
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Criar Nova Pasta</h3>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder()
                    } else if (e.key === 'Escape') {
                      setShowCreateFolderModal(false)
                      setNewFolderName('')
                    }
                  }}
                  placeholder="Nome da pasta"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowCreateFolderModal(false)
                      setNewFolderName('')
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Menu de contexto para arquivo selecionado */}
        {selectedFileId && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-40">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {files.find(f => f.id === selectedFileId)?.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const file = files.find(f => f.id === selectedFileId)
                    if (file?.file) {
                      const url = URL.createObjectURL(file.file)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = file.name
                      a.click()
                      URL.revokeObjectURL(url)
                    }
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => {
                    const file = files.find(f => f.id === selectedFileId)
                    if (file) {
                      const newName = prompt('Novo nome:', file.name)
                      if (newName && newName.trim()) {
                        handleRename(selectedFileId, newName.trim())
                      }
                    }
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Renomear"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este item?')) {
                      handleDelete(selectedFileId)
                    }
                  }}
                  className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setSelectedFileId(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Fechar"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
