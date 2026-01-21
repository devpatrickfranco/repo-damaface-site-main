'use client'

import { Image } from 'lucide-react'

export default function GerarImagemPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-900/30 rounded-lg">
                        <Image className="w-6 h-6 text-pink-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Gerar Imagem</h1>
                </div>
                <p className="text-gray-400">
                    Crie imagens personalizadas para suas campanhas de marketing
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="text-center text-gray-400">
                    <Image className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        Módulo em Desenvolvimento
                    </h3>
                    <p>
                        A funcionalidade de geração de imagens estará disponível em breve.
                    </p>
                </div>
            </div>
        </div>
    )
}
