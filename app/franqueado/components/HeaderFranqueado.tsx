'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Logo from '@/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'
import { useRouter } from 'next/navigation'

// [MODIFICADO] Importa useSWRInfinite para paginação
import useSWRInfinite from 'swr/infinite'
import { apiBackend } from '@/lib/api-backend'

import {
  Bell,
  User,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  HelpCircle,
  PanelLeft,
  Loader2, // Ícone de loading opcional
} from 'lucide-react'

// --- Tipos de dados ---
interface Notification {
  id: number
  title: string
  time: string
  unread: boolean
  link: string | null
}

interface NotificationResponse {
  results: Notification[]
  unread_count: number
  next: string | null
  previous: string | null
  count: number
}

const fetcher = (url: string) => apiBackend.get<NotificationResponse>(url)

interface HeaderDashboardProps {
  onMenuClick: () => void
}

const HeaderDashboard = ({ onMenuClick }: HeaderDashboardProps) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { user, logout } = useAuth()
  const router = useRouter()

  // --- [LÓGICA DE PAGINAÇÃO COM SWR INFINITE] ---

  // Função que define a chave (URL) para cada página
  const getKey = (pageIndex: number, previousPageData: NotificationResponse | null) => {
    // Se chegou ao fim (previousPageData existe mas não tem next), para de buscar
    if (previousPageData && !previousPageData.next) return null

    // Primeira página
    if (pageIndex === 0) return '/notificacoes/'

    // Próximas páginas (usa o parâmetro page)
    return `/notificacoes/?page=${pageIndex + 1}`
  }

  const {
    data,
    mutate,
    size,
    setSize,
    isLoading,
    isValidating
  } = useSWRInfinite<NotificationResponse>(getKey, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  })

  // 1. "Aclana" (Flatten) as páginas em uma única lista de notificações
  const notifications = data ? data.flatMap(page => page.results) : []

  // 2. Pega o contador da primeira página (que é a mais recente)
  const unreadCount = data?.[0]?.unread_count || 0

  // 3. Verifica se tem mais páginas para carregar
  const isEmpty = data?.[0]?.results.length === 0
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.next)

  // --- Ações ---

  const loadMore = () => {
    setSize(size + 1) // Aumenta o número de páginas buscadas
  }

  const handleMarkAsRead = async (id: number) => {
    // Optimistic UI: Remove a notificação da lista e diminui o contador
    mutate(
      (currentData) => {
        if (!currentData) return []

        return currentData.map(page => ({
          ...page,
          unread_count: Math.max(0, page.unread_count - 1),
          // Removemos o item da lista pois o back-end filtra lidos
          results: page.results.filter(n => n.id !== id)
        }))
      },
      false
    )

    try {
      await apiBackend.post(`/notificacoes/${id}/marcar-como-lida/`)
      // Opcional: Revalidar para garantir consistência
      mutate()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
      mutate() // Reverte em caso de erro
    }
  }

  const handleMarkAllAsRead = async () => {
    // Optimistic UI: Limpa tudo (já que a lista só mostra não lidas)
    mutate(
      (currentData) => {
        if (!currentData) return []
        return currentData.map(page => ({
          ...page,
          unread_count: 0,
          results: [] // Limpa a lista visualmente
        }))
      },
      false
    )
    setNotificationsOpen(false)

    try {
      await apiBackend.post('/notificacoes/marcar-todas-como-lidas/')
      mutate() // Revalida para limpar o cache real
    } catch (error) {
      console.error('Erro ao marcar todas:', error)
      mutate()
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Marca como lida (o que vai removê-la da lista)
    handleMarkAsRead(notification.id)

    if (notification.link) {
      router.push(notification.link)
    }
    setNotificationsOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Erro logout:', error)
      setIsLoggingOut(false)
    }
  }

  const imageUrl = user?.imgProfile
    ? `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${user.imgProfile}`
    : null

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 relative">

        {/* ... LADO ESQUERDO E LOGO (MANTIDOS IGUAIS) ... */}
        <div className="absolute top-0 left-0 h-16 hidden md:flex items-center pl-4">
          <Image src={Logo} alt="Logo" className="w-auto h-8 sm:h-10 object-contain" priority />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex md:hidden items-center">
          <Image src={Logo} alt="Logo" className="w-auto h-8 object-contain" priority />
        </div>

        {/* LADO DIREITO */}
        <div className="flex items-center space-x-4 ml-auto">

          {/* --- SINO DE NOTIFICAÇÕES --- */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-700"
              aria-label={`Notificações (${unreadCount})`}
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '+99' : unreadCount}
                </span>
              )}
            </button>

            {/* --- DROPDOWN NOTIFICAÇÕES --- */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in max-h-[80vh] flex flex-col">

                {/* Cabeçalho do Dropdown */}
                <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center shrink-0">
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

                {/* Lista de Notificações com Scroll */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {isLoading && !data ? (
                    <div className="px-4 py-8 text-center text-gray-400 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">
                      Nenhuma notificação nova.
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700/50 last:border-0"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full mt-2 bg-blue-500 shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white break-words">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Botão Carregar Mais */}
                      {!isReachingEnd && (
                        <button
                          onClick={loadMore}
                          disabled={isValidating}
                          className="w-full py-2 text-center text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-700/50 transition-colors flex justify-center items-center gap-2"
                        >
                          {isValidating ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" /> Carregando...
                            </>
                          ) : (
                            "Carregar mais antigas"
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ... PROFILE DROPDOWN (MANTIDO IGUAL) ... */}
          <div className="relative">
            {/* Código do Profile Dropdown mantido idêntico ao original */}
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
            >
              <div className="size-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-700">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Perfil" width={32} height={32} className="object-cover w-full h-full" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-300 hidden sm:block" />
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-white truncate">{user?.nome}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <a href="/franqueado/settings" className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Configurações</span>
                </a>
                <a href="/franqueado/ajuda" className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Ajuda</span>
                </a>
                <hr className="my-2 border-gray-700" />
                <button onClick={handleLogout} disabled={isLoggingOut} className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 text-red-400 disabled:opacity-50">
                  <LogOut className="w-4 h-4" /><span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
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