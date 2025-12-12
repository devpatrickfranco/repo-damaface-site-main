"use client"

import type React from "react"

import { useRef } from "react"
import { Upload, FolderPlus, Grid3X3, List, CheckSquare } from "lucide-react"

interface ToolbarProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onFileUpload: (files: { file: File; relativePath?: string }[]) => void
  onFolderUpload: (files: { file: File; relativePath?: string }[]) => void
  onCreateFolder: () => void
  isSelectionMode: boolean
  onToggleSelectionMode: () => void
}

export function Toolbar({
  viewMode,
  onViewModeChange,
  onFileUpload,
  onFolderUpload,
  onCreateFolder,
  isSelectionMode,
  onToggleSelectionMode,
}: ToolbarProps) {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        file,
        relativePath: file.name,
      }))
  
      onFileUpload(files as any)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }
  
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        file,
        relativePath: (file as any).webkitRelativePath || file.name,
      }))
  
      onFolderUpload(files as any)
      if (folderInputRef.current) folderInputRef.current.value = ""
    }
  }
  

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium text-sm"
      >
        <Upload size={18} />
        <span>Upload Arquivo</span>
      </button>
      <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />

      <button
        onClick={() => folderInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium text-sm border border-gray-600"
      >
        <Upload size={18} />
        <span>Upload Pasta</span>
      </button>
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: "" } as any)}
        multiple
        onChange={handleFolderChange}
        className="hidden"
      />

      <button
        onClick={onCreateFolder}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium text-sm border border-gray-600"
      >
        <FolderPlus size={18} />
        <span>Nova Pasta</span>
      </button>

      <button
        onClick={onToggleSelectionMode}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors font-medium text-sm border ${
          isSelectionMode
            ? "bg-brand-pink text-white border-brand-pink"
            : "bg-gray-700 hover:bg-gray-600 border-gray-600"
        }`}
      >
        <CheckSquare size={18} />
        <span>{isSelectionMode ? "Cancelar seleção" : "Selecionar"}</span>
      </button>

      <div className="flex-1" />

      <div className="flex items-center bg-gray-800 rounded-full p-1 border border-gray-700">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-full transition-colors ${
            viewMode === "grid" ? "bg-gray-700 text-brand-pink" : "text-gray-400 hover:text-white"
          }`}
          title="Visualização em grade"
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-full transition-colors ${
            viewMode === "list" ? "bg-gray-700 text-brand-pink" : "text-gray-400 hover:text-white"
          }`}
          title="Visualização em lista"
        >
          <List size={18} />
        </button>
      </div>
    </div>
  )
}
