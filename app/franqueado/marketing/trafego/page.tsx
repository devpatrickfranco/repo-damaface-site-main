'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { TrendingUp } from 'lucide-react'

export default function TrafegoPage() {
    const { isAuthenticated, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/franqueado')
        }
    }, [isAuthenticated, authLoading, router])

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p>Verificando autenticação...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-900/30 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-pink-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Tráfego</h1>
                </div>
                <p className="text-gray-400">
                    Gerencie e analise suas campanhas de tráfego pago
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="text-center text-gray-400">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        Módulo em Desenvolvimento
                    </h3>
                    <p>
                        A funcionalidade de gestão de tráfego estará disponível em breve.
                    </p>
                </div>
            </div>
        </div>
    )
}
