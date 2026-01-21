"use client"

interface DragOverlayProps {
  isVisible: boolean
}

export function DragOverlay({ isVisible }: DragOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
      <div className="border-2 border-dashed border-brand-pink/60 rounded-3xl px-8 py-6 bg-gray-900/80 text-center shadow-2xl">
        <p className="text-lg font-medium text-white">Solte para enviar</p>
        <p className="text-sm text-gray-300 mt-1">Arquivos ou pastas serão enviados para a pasta atual</p>
      </div>
    </div>
  )
}
