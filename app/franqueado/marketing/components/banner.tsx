"use client"

import { Sparkles, TrendingUp } from "lucide-react"

export function Banner() {
  return (
    <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 mb-8 group">
      {/* Background Decorativo (Brilhos e Formas) */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl group-hover:bg-brand-pink/30 transition-all duration-700" />
      <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
      
      {/* Grid Pattern sutil */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Conteúdo */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
        <div className="flex items-center gap-2 text-brand-pink mb-2 font-medium tracking-wide text-sm uppercase">
          <Sparkles size={16} />
          <span>Marketing Hub</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 max-w-2xl">
          Gerencie seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-400">ativos digitais</span>
        </h1>
        
        <p className="text-gray-400 max-w-xl text-sm md:text-base">
          Organize campanhas, vídeos e imagens em um único lugar seguro e acessível para todo o time.
        </p>

        {/* Opcional: Mini Stats ou Botão CTA */}
        <div className="absolute bottom-6 right-8 hidden md:flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-md rounded-full border border-gray-700/50 text-xs text-gray-300">
              <TrendingUp size={14} className="text-green-400" />
              <span>Espaço livre: 85%</span>
           </div>
        </div>
      </div>
    </div>
  )
}