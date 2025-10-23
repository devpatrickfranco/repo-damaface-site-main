'use client'

import { AuthProvider } from '@/context/AuthContext'

export const dynamic = 'force-dynamic'

export default function FranqueadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}