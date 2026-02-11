'use client'

import { AuthProvider } from '@/context/AuthContext'
import { useState } from 'react'
import HeaderFranqueado from './components/HeaderFranqueado'
import Sidebar from './components/Sidebar'
import { usePathname } from 'next/navigation'

export default function FranqueadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Páginas que NÃO devem mostrar Header/Sidebar
  const publicPages = ['/franqueado', '/franqueado/reset_password']
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
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <HeaderFranqueado />
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Main Content - com padding para não ficar atrás do header/sidebar */}
          <main
            className={`pt-16 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
              }`}
          >
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthProvider>
  )
}