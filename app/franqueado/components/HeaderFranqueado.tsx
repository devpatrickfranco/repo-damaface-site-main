'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Logo from '@/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'

// [ADICIONADO] Imports para SWR e sua API
import useSWR from 'swr'
import { apiBackend } from '@/lib/api-backend' // Verifique se este é o path correto

import {
  Bell,
  User,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react'

// [ADICIONADO] Tipos de dados que esperamos da nossa API
interface Notification {
  id: number
  title: string
  time: string
  unread: boolean
  link: string | null
}
interface UnreadCount {
  count: number
}

// [ADICIONADO] O fetcher que usa o seu apiBackend
const fetcher = (url: string) => apiBackend.get(url)

const HeaderDashboard = () => {
  // --- Estados Originais (Mantidos) ---
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { user, logout } = useAuth()

  // [REMOVIDO] O array de 'notifications' mocadas foi removido

  // --- [ADICIONADO] Lógica de busca de dados com SWR ---
  const { data: notifications, mutate: mutateNotifications } = useSWR<
    Notification[]
  >(
    '/notificacoes/', // O path base é '/api' conforme definimos no urls.py
    fetcher,
    {
      refreshInterval: 60000, // Atualiza a cada 60 segundos
      revalidateOnFocus: true, // Revalida quando o usuário volta para a aba
    },
  )

  const { data: unreadData, mutate: mutateCount } = useSWR<UnreadCount>(
    '/notificacoes/unread-count/',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    },
  )

  const unreadCount = unreadData?.count || 0
  // --- Fim da Lógica SWR ---

  // --- [ADICIONADO] Funções para interagir com a API ---
  const handleMarkAsRead = async (id: number) => {
    try {
      // Usa seu helper para fazer o POST
      await apiBackend.post(`/notificacoes/${id}/marcar-como-lida/`)
      
      // Diz ao SWR para buscar os dados novamente
      mutateNotifications()
      mutateCount()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await apiBackend.post('/notificacoes/marcar-todas-como-lidas/')
      mutateNotifications()
      mutateCount()
      setNotificationsOpen(false) // Fecha o dropdown
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // 1. Marca como lida se estiver não lida
    if (notification.unread) {
      handleMarkAsRead(notification.id)
    }
    
    // 2. Redireciona se tiver um link
    if (notification.link) {
      // Idealmente, use o useRouter do Next.js para rotas internas
      window.location.href = notification.link
    }
    
    setNotificationsOpen(false)
  }
  // --- Fim das Funções de Interação ---

  // --- Lógica Original da Imagem (Mantida) ---
  const imageUrl =
    user && user.imgProfile
      ? `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${user.imgProfile}`
      : null

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 relative">
        {/* Logo desktop canto esquerdo (Original - Mantido) */}
        <div className="absolute top-0 left-0 h-16 hidden md:flex items-center pl-4">
          <Image
            src={Logo}
            alt="Logo DamaFace Horizontal"
            className="w-auto h-8 sm:h-10 object-contain"
            priority
          />
        </div>

        {/* Seção esquerda (Original - Mantido) */}
        <div className="flex items-center space-x-4">
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Logo centralizada no mobile (Original - Mantido) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex md:hidden items-center">
          <Image
            src={Logo}
            alt="Logo DamaFace"
            className="w-auto h-8 object-contain"
            priority
          />
        </div>

        {/* Lado direito */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Notifications [BLOCO MODIFICADO] */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-700"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {/* [MODIFICADO] Mostra o badge apenas se for > 0 */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown [BLOCO MODIFICADO] */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in">
                {/* [MODIFICADO] Cabeçalho com "Marcar todas como lidas" */}
                <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-white">Notificações</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                
                {/* [MODIFICADO] Lógica de renderização (Carregando, Vazio, Lista) */}
                {!notifications ? (
                  // Estado de Carregamento
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    Carregando...
                  </div>
                ) : notifications.length === 0 ? (
                  // Estado Vazio (Fallback)
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    Nenhuma notificação nova.
                  </div>
                ) : (
                  // Lista de Notificações
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown (Original - Mantido) */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
            >
              {/* --- Bloco de Imagem/Ícone (Original - Mantido) --- */}
              <div className="size-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-700">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Foto de Perfil"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-pink-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-300 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu (Original - Mantido) */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-white">{user?.nome}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <a
                  href="/franqueado/settings"
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Configurações</span>
                </a>
                <a  
                  href='/franqueado/ajuda'
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Ajuda</span>
                </a>
                <hr className="my-2 border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderDashboard