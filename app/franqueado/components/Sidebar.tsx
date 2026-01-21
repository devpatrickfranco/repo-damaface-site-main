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
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Image,
  TrendingUp
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface SubModule {
  id: string
  name: string
  icon: any
  route: string
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [marketingExpanded, setMarketingExpanded] = useState(false)

  const marketingSubModules: SubModule[] = [
    { id: 'gerar-imagem', name: 'Gerar Imagem', icon: Image, route: '/franqueado/marketing/gerar-imagem' },
    { id: 'trafego', name: 'Tráfego', icon: TrendingUp, route: '/franqueado/marketing/trafego' }
  ]

  const allNavLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, route: '/franqueado/dashboard', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'academy', name: 'Academy', icon: GraduationCap, route: '/franqueado/academy', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'ajuda', name: 'Ajuda', icon: HelpCircle, route: '/franqueado/ajuda', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'suporte', name: 'Suporte', icon: LifeBuoy, route: '/franqueado/suporte', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'comunicados', name: 'Comunicados', icon: Newspaper, route: '/franqueado/comunicados', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'damaai', name: 'Dama.ai', icon: BrainCircuit, route: '/franqueado/damaai', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, route: '/franqueado/marketing', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'], hasSubModules: true },
    { id: 'usuarios', name: 'Usuarios', icon: Users2, route: '/franqueado/usuarios', roles: ['SUPERADMIN'] }
  ]

  const allowedLinks = user
    ? allNavLinks.filter(link => link.roles.includes(user.role))
    : []

  // ✅ Função para verificar se o link está ativo
  const isActive = (route: string) => {
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
              <div key={item.id}>
                {/* Link principal */}
                <button
                  onClick={() => {
                    if (item.hasSubModules) {
                      setMarketingExpanded(!marketingExpanded)
                    } else {
                      router.push(item.route)
                      onClose()
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${isActive(item.route) && !item.hasSubModules
                      ? 'bg-pink-900/30 text-pink-400 border border-pink-800'
                      : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.hasSubModules && (
                    marketingExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </button>

                {/* Submódulos */}
                {item.hasSubModules && marketingExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {marketingSubModules.map((subModule) => (
                      <button
                        key={subModule.id}
                        onClick={() => {
                          router.push(subModule.route)
                          onClose()
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-colors text-sm ${isActive(subModule.route)
                            ? 'bg-pink-900/20 text-pink-400 border border-pink-800/50'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                          }`}
                      >
                        <subModule.icon className="w-4 h-4" />
                        <span className="font-medium">{subModule.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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