"use client"

import Image from "next/image"

export default function Banner() {
  return (
    <div className="relative w-full h-48 md:h-64 bg-gray-900 border-b border-gray-800 overflow-hidden">      
      {/* === IMAGEM DESKTOP (só aparece em telas md ou maiores) === */}
      <Image
        src="/Capa-Natal-desktop.png" 
        alt="Banner Desktop"
        fill
        className="hidden md:block object-cover object-top"
        priority
        sizes="100vw"
      />

      {/* === IMAGEM MOBILE (só aparece em telas menores que md) === */}
      <Image
        src="/Capa-Natal-mobile.png"
        alt="Banner imagem Mobile"
        fill
        className="block md:hidden object-cover object-top"
        priority
        sizes="100vw"
      />
    </div>
  )
}