"use client"

import Image from "next/image"

export function Banner() {
  return (
    // Container principal do banner com bordas arredondadas e sombra
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-800 mb-8 group">
      
      {/* Container interno que define a ALTURA do banner.
         h-48 (192px) no mobile
         sm:h-72 (288px) em tablets pequenos
         md:h-[400px] em desktops
      */}
      <div className="relative h-64 sm:h-80 md:h-[400px] w-full bg-gray-900">
        
        {/* --- IMAGEM DESKTOP (hidden no mobile, block no md em diante) --- */}
        {/* Lembre-se de colocar sua imagem real na pasta /public e atualizar o src abaixo */}
        <Image
          src="/Capa-Natal-desktop.png" 
          alt="Banner Marketing Desktop"
          fill // Ocupa 100% do container pai
          sizes="100vw"
          // "object-cover" garante que a imagem cubra a área sem distorcer, cortando se necessário
          className="hidden md:block object-cover transition-transform duration-700 group-hover:scale-105"
          priority // Carrega com prioridade por estar no topo da página
        />

        {/* --- IMAGEM MOBILE (block no mobile, hidden no md em diante) --- */}
        {/* Lembre-se de colocar sua imagem real na pasta /public e atualizar o src abaixo */}
        <Image
          src="/Capa-Natal-mobile.png"
          alt="Banner Marketing Mobile"
          fill // Ocupa 100% do container pai
          sizes="100vw"
          // A classe oposta: block no mobile, hidden no desktop
          className="block md:hidden object-cover object-center transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* (Opcional) Overlay escuro para garantir que o texto fique legível se você colocar texto em cima */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
      </div>

      {/* (Opcional) Se quiser colocar texto sobre a imagem */}
      {/* <div className="absolute bottom-0 left-0 p-8 z-20">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Central de Marketing</h1>
      </div> 
      */}
    </div>
  )
}