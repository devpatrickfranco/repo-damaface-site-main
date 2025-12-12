"use client"

import { Home, ChevronRight } from "lucide-react"
export interface BreadcrumbItem {
  id: string
  name: string
}

interface BreadcrumbProps {
  path: BreadcrumbItem[]
  onNavigate: (folderId: string | null) => void
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="mb-6 flex items-center gap-1.5 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
      >
        <Home size={16} />
        <span>Meus Arquivos</span>
      </button>
      {path.map((folder) => (
        <div key={folder.id} className="flex items-center gap-1.5">
          <ChevronRight size={16} className="text-gray-500" />
          <button
            onClick={() => onNavigate(folder.id)}
            className="px-2 py-1 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  )
}