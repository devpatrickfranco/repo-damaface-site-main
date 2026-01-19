"use client"

import { Search, X, Loader2, Folder, File as FileIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { getFileIcon } from "../helper"
import type { FileItem } from "@/types/marketing"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  results?: FileItem[]
  isSearching?: boolean
  onResultClick?: (item: FileItem) => void
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Pesquisar arquivos...",
  results = [],
  isSearching = false,
  onResultClick
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Debounce search trigger
    const timer = setTimeout(() => {
      if (value.trim() && onSearch) {
        onSearch(value)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value, onSearch])

  useEffect(() => {
    setIsOpen(value.trim().length > 0 && (results.length > 0 || isSearching))
  }, [value, results, isSearching])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full md:w-[600px] z-10">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          placeholder={placeholder}
          className={`w-full pl-12 pr-10 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${isOpen ? "rounded-b-none border-gray-700" : "border-gray-700 rounded-full"
            }`}
        />
        {isSearching ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin text-cyan-500" size={18} />
          </div>
        ) : value ? (
          <button
            onClick={() => {
              onChange("")
              setIsOpen(false)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl shadow-xl max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onResultClick?.(item)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left group"
                >
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    {item.type === 'folder'
                      ? <Folder size={20} fill="currentColor" fillOpacity={0.2} />
                      : getFileIcon(item.mimeType, item.name, 20)
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{item.type === 'folder' ? 'Pasta' : 'Arquivo'}</span>
                      <span>•</span>
                      <span>{item.modifiedAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  {item.path && (
                    <div className="text-xs text-gray-400 truncate max-w-[100px] text-right" title={item.path}>
                      {item.path.split('/').slice(-2).join('/')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            !isSearching && (
              <div className="p-8 text-center text-gray-500">
                Nenhum arquivo encontrado
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
