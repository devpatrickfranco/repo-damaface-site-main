// app/franqueado/academy/components/TrilhasView.tsx
'use client';

import { trilhas } from '@/data/academy/data-cursos';

export default function TrilhasView() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Trilhas de Formação</h1>
                <p className="text-gray-400">Siga um caminho estruturado de aprendizado para dominar áreas específicas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trilhas.map((trilha) => (
                    <div key={trilha.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-pink-400/30 transition-all cursor-pointer group">
                        {/* ... JSX do card de Trilha ... */}
                    </div>
                ))}
            </div>
        </div>
    )
}