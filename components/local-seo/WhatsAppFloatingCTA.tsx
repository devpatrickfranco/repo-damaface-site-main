"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import type { Unidade } from "@/types/local-seo"
import { whatsappUrl } from "./ClinicSections"

export function WhatsAppFloatingCTA({ unidade }: { unidade: Unidade }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.6)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const href = whatsappUrl(unidade.whatsapp, `Olá! Quero agendar uma avaliação na Damaface ${unidade.cidade}.`)

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Agendar avaliação na Damaface ${unidade.cidade} pelo WhatsApp`}
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-brand-pink text-white shadow-lg shadow-brand-pink/30 transition-all duration-300 hover:scale-105 lg:flex ${
          visivel ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 p-3 backdrop-blur-sm transition-transform duration-300 lg:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-semibold text-white shadow-md"
        >
          <MessageCircle className="h-5 w-5" />
          Agendar pelo WhatsApp
        </a>
      </div>
    </>
  )
}
