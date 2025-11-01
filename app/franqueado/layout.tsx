'use client'

import { AuthProvider } from '@/context/AuthContext'
import HeaderFranqueado from './components/HeaderFranqueado'
import Sidebar from './components/Sidebar'
import { usePathname } from 'next/navigation'

export default function FranqueadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Páginas que NÃO devem mostrar Header/Sidebar
  const publicPages = ['/franqueado/login', '/franqueado/register', '/franqueado/forgot-password']
  const isPublicPage = publicPages.includes(pathname)
  
  return (
    <AuthProvider>
      {isPublicPage ? (
        // Página pública (Login, Register, etc.) - SEM layout
        <div className="min-h-screen bg-gray-900">
          {children}
        </div>
      ) : (
        // Página autenticada - COM Header e Sidebar
        <div className="min-h-screen bg-gray-900">
          <HeaderFranqueado />
          <Sidebar />
          
          {/* Main Content - com padding para não ficar atrás do header/sidebar */}
          <main className="lg:ml-64 pt-16 min-h-screen">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthProvider>
  )
}