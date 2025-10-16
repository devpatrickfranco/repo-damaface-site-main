'use client'

import { 
  ShoppingCart,
  Award,
  Megaphone,
  BarChart3,
  X,
  Newspaper,
  Users2,
  Home, 
  LifeBuoy,
  GraduationCap,
  Rocket,
  BrainCircuit
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps { 
  active?: string;
}

const Sidebar = ({ active }: SidebarProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const allNavLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, route: '/franqueado/dashboard', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'suporte', name: 'Suporte', icon: LifeBuoy, route: '/franqueado/suporte', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'academy', name: 'Academy', icon: GraduationCap, route: '/franqueado/academy', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'comunicados', name: 'Comunicados', icon: Newspaper, route: '/franqueado/comunicados', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'damaai', name: 'Dama.ai', icon: BrainCircuit, route: '/franqueado/damaai', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },

    { id: 'compras', name: 'Compras', icon: ShoppingCart, route: '/franqueado/compras', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'qualidade', name: 'Qualidade', icon: Award, route: '/franqueado/qualidade', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, route: '/franqueado/marketing', roles: ['SUPERADMIN', 'ADMIN', 'FRANQUEADO', 'FUNCIONARIO'] },

    { id: 'bi', name: 'BI', icon: BarChart3, route: '/franqueado/bi', roles: ['SUPERADMIN', 'ADMIN'] },
    { id: 'implantacao', name: 'Implantação', icon: Rocket, route: '/franqueado/implantacao', roles: ['SUPERADMIN', 'ADMIN'] },
    { id: 'usuarios', name: 'Usuarios', icon: Users2, route: '/franqueado/usuarios', roles: ['SUPERADMIN'] }
  ];

  const allowedLinks = user
    ? allNavLinks.filter(link => link.roles.includes(user.role))
    : [];

  return (
    <>
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-700 z-30 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto shadow-lg`}>
        
        {/* Botão fechar mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-700"
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
                  router.push(item.route);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                  (active ? active === item.id : pathname.startsWith(item.route))
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

        {/* Scrollbar custom */}
        <style jsx>{`
          aside::-webkit-scrollbar {
            width: 6px;
          }
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          aside::-webkit-scrollbar-thumb {
            background-color: #475569; /* slate-600 */
            border-radius: 9999px;
          }
          aside::-webkit-scrollbar-thumb:hover {
            background-color: #64748b; /* slate-500 */
          }

          aside {
            scrollbar-width: thin;
            scrollbar-color: #475569 transparent;
          }
        `}</style>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar;
