"use client"

interface CreateFolderModalProps {
  isOpen: boolean
  folderName: string
  onFolderNameChange: (name: string) => void
  onCreate: () => void
  onClose: () => void
}

export function CreateFolderModal({
  isOpen,
  folderName,
  onFolderNameChange,
  onCreate,
  onClose,
}: CreateFolderModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Criar Nova Pasta</h3>
          <input
            type="text"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCreate()
              } else if (e.key === "Escape") {
                onClose()
              }
            }}
            placeholder="Nome da pasta"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent mb-6"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onCreate}
              className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pink/90 rounded-full transition-colors font-medium"
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
