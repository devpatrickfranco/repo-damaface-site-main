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

  // trava scroll
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
        animate-fade
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
          animate-scale
          ${className || ""}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
