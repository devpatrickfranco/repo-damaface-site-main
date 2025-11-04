'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Logo from '@/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'
import { useRouter } from 'next/navigation' // [MODIFICADO] Importa o useRouter

// [MODIFICADO] Imports para SWR e sua API
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

// --- [MODIFICADO] Tipos de dados ---
interface Notification {
  id: number
  title: string
  time: string
  unread: boolean
  link: string | null
}
// Novo tipo para a resposta combinada da API
interface NotificationResponse {
  results: Notification[]
  unread_count: number
  // (inclui campos de paginação como 'count', 'next', 'previous')
}

// --- Fetcher (Mantido) ---
// O fetcher agora espera receber a resposta combinada
const fetcher = (url: string) =>
  apiBackend.get<NotificationResponse>(url)

const HeaderDashboard = () => {
  // --- Estados (Mantido) ---
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter() // [ADICIONADO] Hook do Next.js para navegação

  // --- [MODIFICADO] Lógica de busca de dados com SWR ---
  // Agora temos UM SÓ HOOK para buscar TUDO de notificações
  const { data: notificationData, mutate: mutateNotifications } =
    useSWR<NotificationResponse>(
      '/notificacoes/', // Endpoint único
      fetcher,
      {
        refreshInterval: 60000, // Atualiza a cada 60 segundos
        revalidateOnFocus: true, // Revalida quando o usuário volta para a aba
      },
    )

  // Extrai os dados do hook único
  const notifications = notificationData?.results
  const unreadCount = notificationData?.unread_count || 0
  // --- Fim da Lógica SWR ---

  // --- [MODIFICADO] Funções de Interação (Mutações Otimistas) ---

  const handleMarkAsRead = async (id: number) => {
    // 1. Atualiza a UI local instantaneamente (Optimistic UI)
    mutateNotifications(
      (currentData) => {
        if (!currentData) return undefined // Segurança
        
        // Retorna a nova estrutura de dados completa
        return {
          ...currentData,
          unread_count: Math.max(0, currentData.unread_count - 1),
          results: currentData.results.map((n) =>
            n.id === id ? { ...n, unread: false } : n,
          ),
        }
      },
      false, // 'false' = não revalidar ainda
    )

    // 2. Tenta a chamada de API em segundo plano
    try {
      await apiBackend.post(`/notificacoes/${id}/marcar-como-lida/`)
      // Opcional: Revalida para garantir sincronia (bom, mas não obrigatório)
      mutateNotifications()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
      // Se falhar, o SWR reverte os dados na próxima revalidação
    }
  }

  const handleMarkAllAsRead = async () => {
    // 1. Atualiza a UI local instantaneamente (Optimistic UI)
    mutateNotifications(
      (currentData) => {
        if (!currentData) return undefined
        return {
          ...currentData,
          unread_count: 0,
          results: currentData.results.map((n) => ({ ...n, unread: false })),
        }
      },
      false,
    )
    setNotificationsOpen(false) // Fecha o dropdown

    // 2. Tenta a chamada de API em segundo plano
    try {
      await apiBackend.post('/notificacoes/marcar-todas-como-lidas/')
      // Revalida para garantir
      mutateNotifications()
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.unread) {
      handleMarkAsRead(notification.id)
    }
    
    if (notification.link) {
      router.push(notification.link) // Usa o router
    }
    
    setNotificationsOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true) // Define o estado para "saindo..."
    try {
      // Chama a função logout original do seu AuthContext
      await logout()
      
      // Se o logout for bem-sucedido, o usuário será redirecionado
      // e o componente desmontado, então não precisamos redefinir o estado.
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Se o logout falhar, redefina o botão para o estado normal
      setIsLoggingOut(false)
    }
  }

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
            aria-label="Alternar menu lateral" // [ADICIONADO] Acessibilidade
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
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-700"
              aria-label={`Abrir notificações (${unreadCount} não lidas)`} // [ADICIONADO] Acessibilidade
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {/* [MODIFICADO] Lê do 'unreadCount' que vem do hook único */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in">
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
                
                {/* [MODIFICADO] Lógica de renderização agora checa 'notifications' (que está dentro de 'notificationData') */}
                {!notificationData ? ( // Checa 'notificationData' (a resposta inteira)
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    Carregando...
                  </div>
                ) : notifications && notifications.length === 0 ? ( // Checa 'notifications' (a lista interna)
                  <div className="px-4 py-3 text-center text-sm text-gray-400">
                    Nenhuma notificação nova.
                  </div>
                ) : (
                  notifications && notifications.map((notification) => ( // Checa 'notifications'
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* ... (Renderização da notificação - Sem mudanças) ... */}
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
              aria-label="Abrir menu do perfil" // [ADICIONADO] Acessibilidade
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
                  href="/franqueado/ajuda"
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Ajuda</span>
                </a>
                <hr className="my-2 border-gray-700" />
                <button
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 text-red-400 disabled:opacity-70 disabled:cursor-not-allowed" // <--- ADICIONADO (disabled styles)
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">
                      {isLoggingOut ? 'Saindo...' : 'Sair'} 
                    </span>
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