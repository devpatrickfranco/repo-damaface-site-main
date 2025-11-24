"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function Modal({ open, onClose, children, className }: ModalProps) {
  if (typeof window === "undefined") return null
  if (!open) return null

  // ESC para fechar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // Trava o scroll do body
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return createPortal(
    <div
      className="
        fixed inset-0 z-[99999] 
        flex items-center justify-center 
        bg-black/60 backdrop-blur-sm 
        animate-fadeIn
        p-4
      "
      onClick={onClose}
    >
      <div
        className={`
          bg-gray-800 border border-gray-700 
          rounded-xl shadow-2xl 
          max-h-[90vh] overflow-y-auto 
          w-full max-w-2xl 
          animate-scaleIn 
          ${className || ""}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn .2s ease-out }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.95) }
          to { opacity: 1; transform: scale(1) }
        }
        .animate-scaleIn { animation: scaleIn .2s ease-out }
      `}</style>
    </div>,
    document.body
  )
}
