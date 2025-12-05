'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import Logo from '@/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'
import { useRouter } from 'next/navigation'

import useSWR from 'swr'
import { apiBackend } from '@/lib/api-backend'

import {
  Bell,
  User,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  HelpCircle,
  Loader2,
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
  count: number
  next: string | null
  previous: string | null
}

// --- Fetcher ---
const fetcher = (url: string) => apiBackend.get<NotificationResponse>(url)

const HeaderDashboard = () => {
  // --- Estados ---
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const { user, logout } = useAuth()
  const router = useRouter()
  
  // Refs para fechar dropdowns ao clicar fora
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // --- SWR para buscar notificações ---
  const pageSize = 10 // Número de notificações por página
  const { data: notificationData, mutate: mutateNotifications } =
    useSWR<NotificationResponse>(
      `/notificacoes/?page=${currentPage}&page_size=${pageSize}`,
      fetcher,
      {
        refreshInterval: 60000,
        revalidateOnFocus: true,
        onSuccess: (data) => {
          // Quando os dados chegam, atualiza a lista acumulada
          if (currentPage === 1) {
            setAllNotifications(data.results)
          } else {
            setAllNotifications((prev) => [...prev, ...data.results])
          }
          setIsLoadingMore(false)
        },
      },
    )

  const unreadCount = notificationData?.unread_count || 0
  const hasMorePages = notificationData?.next !== null

  // --- Efeito para fechar dropdowns ao clicar fora ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // --- Função para carregar mais notificações ---
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMorePages) {
      setIsLoadingMore(true)
      setCurrentPage((prev) => prev + 1)
    }
  }

  // --- Reset ao abrir notificações ---
  const handleToggleNotifications = () => {
    if (!notificationsOpen) {
      // Ao abrir, reseta para a primeira página
      setCurrentPage(1)
      setAllNotifications([])
    }
    setNotificationsOpen(!notificationsOpen)
  }

  // --- Funções de Interação ---
  const handleMarkAsRead = async (id: number) => {
    // Atualiza localmente
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )

    // Atualiza o contador global via mutate
    mutateNotifications(
      (currentData) => {
        if (!currentData) return undefined
        return {
          ...currentData,
          unread_count: Math.max(0, currentData.unread_count - 1),
        }
      },
      false,
    )

    try {
      await apiBackend.post(`/notificacoes/${id}/marcar-como-lida/`)
      mutateNotifications()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    // Atualiza todas as notificações localmente
    setAllNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

    mutateNotifications(
      (currentData) => {
        if (!currentData) return undefined
        return {
          ...currentData,
          unread_count: 0,
        }
      },
      false,
    )
    setNotificationsOpen(false)

    try {
      await apiBackend.post('/notificacoes/marcar-todas-como-lidas/')
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
      router.push(notification.link)
    }

    setNotificationsOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
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
        {/* Logo desktop */}
        <div className="absolute top-0 left-0 h-16 hidden md:flex items-center pl-4">
          <Image
            src={Logo}
            alt="Logo DamaFace Horizontal"
            className="w-auto h-8 sm:h-10 object-contain"
            priority
          />
        </div>

        {/* Seção esquerda */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
            aria-label="Alternar menu lateral"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Logo mobile centralizada */}
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
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleToggleNotifications}
              className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label={`Abrir notificações (${unreadCount} não lidas)`}
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-gray-750">
                  <h3 className="font-semibold text-white">Notificações</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                {/* Lista de notificações com scroll */}
                <div className="max-h-[calc(100vh-200px)] sm:max-h-96 overflow-y-auto">
                  {!notificationData && currentPage === 1 ? (
                    <div className="px-4 py-8 text-center">
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Carregando...</p>
                    </div>
                  ) : allNotifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Nenhuma notificação nova.
                      </p>
                    </div>
                  ) : (
                    <>
                      {allNotifications.map((notification, index) => (
                        <div
                          key={`${notification.id}-${index}`}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 last:border-b-0"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.unread
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  notification.unread
                                    ? 'font-semibold text-white'
                                    : 'font-normal text-gray-300'
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Botão "Carregar Mais" */}
                      {hasMorePages && (
                        <div className="px-4 py-3 border-t border-gray-700">
                          <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-500 transition-colors flex items-center justify-center space-x-2"
                          >
                            {isLoadingMore ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Carregando...</span>
                              </>
                            ) : (
                              <span>Carregar mais notificações</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Indicador de fim */}
                      {!hasMorePages && allNotifications.length > 5 && (
                        <div className="px-4 py-3 text-center border-t border-gray-700">
                          <p className="text-xs text-gray-500">
                            Todas as notificações foram carregadas
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Abrir menu do perfil"
            >
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

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-white truncate">
                    {user?.nome}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <a
                  href="/franqueado/settings"
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Configurações</span>
                </a>
                <a
                  href="/franqueado/ajuda"
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Ajuda</span>
                </a>
                <hr className="my-2 border-gray-700" />
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 text-red-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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