'use client'

import {
  Megaphone,
  X,
  Newspaper,
  Users2,
  Home,
  LifeBuoy,
  GraduationCap,
  BrainCircuit,
  HelpCircle
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname() // ✅ Detecta automaticamente a rota

  const allNavLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, route: '/franqueado/dashboard', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'academy', name: 'Academy', icon: GraduationCap, route: '/franqueado/academy', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'ajuda', name: 'Ajuda', icon: HelpCircle, route: '/franqueado/ajuda', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'suporte', name: 'Suporte', icon: LifeBuoy, route: '/franqueado/suporte', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'comunicados', name: 'Comunicados', icon: Newspaper, route: '/franqueado/comunicados', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'damaai', name: 'Dama.ai', icon: BrainCircuit, route: '/franqueado/damaai', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, route: '/franqueado/marketing', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'usuarios', name: 'Usuarios', icon: Users2, route: '/franqueado/usuarios', roles: ['SUPERADMIN'] }
  ]

  const allowedLinks = user
    ? allNavLinks.filter(link => link.roles.includes(user.role))
    : []

  // ✅ Função para verificar se o link está ativo
  const isActive = (route: string) => {
    // Verifica se a rota atual começa com a rota do link
    // Exemplo: /franqueado/dashboard/stats -> ativa o link /franqueado/dashboard
    return pathname.startsWith(route)
  }

  return (
    <>
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-700 z-30 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto shadow-lg`}>

        {/* Botão fechar mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Links */}
        <nav className="px-4 pb-4">
          <div className="space-y-2">
            {allowedLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.route)
                  onClose()
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive(item.route) // ✅ Usa a função isActive
                    ? 'bg-pink-900/30 text-pink-400 border border-pink-800'
                    : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}

export default Sidebar