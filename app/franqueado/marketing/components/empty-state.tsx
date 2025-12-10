"use client"

import { Folder, Search } from "lucide-react"

interface EmptyStateProps {
  isSearching: boolean
}

export function EmptyState({ isSearching }: EmptyStateProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Search size={64} className="text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">Nenhum resultado encontrado</p>
        <p className="text-gray-500 text-sm mt-2">Tente buscar por outro termo</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Folder size={64} className="text-brand-pink/50 mb-4" />
      <p className="text-gray-400 text-lg">Esta pasta está vazia</p>
      <p className="text-gray-500 text-sm mt-2">Faça upload de arquivos ou crie uma nova pasta para começar</p>
    </div>
  )
}