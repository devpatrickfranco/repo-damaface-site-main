'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FolderOpen } from 'lucide-react'

export default function MarketingPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/franqueado')
      return
    }
    // Redireciona automaticamente para o Drive
    router.push('/franqueado/marketing/drive')
  }, [router, isAuthenticated, authLoading])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-900/30 rounded-full mb-4">
          <FolderOpen className="w-8 h-8 text-pink-400 animate-pulse" />
        </div>
        <p className="text-gray-400">Redirecionando para o Drive...</p>
      </div>
    </div>
  )
}