'use client'

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'
import Logo from '@/public/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png'

import { 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';

const HeaderDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const notifications = [
    { id: 1, title: 'Nova atualização disponível', time: '2h', unread: true },
    { id: 2, title: 'Relatório mensal pronto', time: '4h', unread: true },
    { id: 3, title: 'Reunião agendada para amanhã', time: '1d', unread: false }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 relative">

        {/* Logo desktop canto esquerdo */}
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
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Logo centralizada no mobile */}
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
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-700"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.filter(n => n.unread).length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="font-semibold text-white">Notificações</h3>
                </div>
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
            >
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-300 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-white">{user?.nome}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>    
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Configurações</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Ajuda</span>
                </button>
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