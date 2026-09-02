'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { isSuperadminCosmeticCheck } from '@/lib/funnels/auth'

/**
 * Guard de rota compartilhado pelas páginas de `/franqueado/funnels/**`.
 * É só UX (redireciona quem não é superadmin) — a barreira real é o back-end
 * validando `superadmin` em toda chamada às rotas `/api/admin/funnels/**`
 * (back-end-funil.md §4, lib/funnels/auth.ts).
 */
export function useSuperadminGuard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const isSuperadmin = isSuperadminCosmeticCheck(user)

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || !isSuperadmin) {
      router.push('/franqueado')
    }
  }, [loading, isAuthenticated, isSuperadmin, router])

  return { isChecking: loading || !isAuthenticated || !isSuperadmin }
}
