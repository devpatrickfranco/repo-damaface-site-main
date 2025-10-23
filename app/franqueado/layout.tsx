'use client'

import { AuthProvider } from '@/context/AuthContext'

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