'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

import RenderManageCourses from '@/app/franqueado/academy/components/RenderManageCourses'
import RenderManageStudents from '@/app/franqueado/academy/components/RenderManageStudents'
import RenderHome from '@/app/franqueado/academy/components/RenderHome'



export default function AcademyPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/franqueado")
      }
    }, [isAuthenticated, authLoading, router])

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'gerenciar-cursos' | 'gerenciar-alunos'>('home');  

  return (
    <div className="min-h-screen bg-background">

      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {/* Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveView('home')}
                className={`pb-2 border-b-2 font-medium transition-colors ${
                  activeView === 'home'
                    ? 'border-pink-500 text-pink-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Início
              </button>
              {user?.role === 'SUPERADMIN' && (
                <>
                  <button
                    onClick={() => setActiveView('gerenciar-cursos')}
                    className={`pb-2 border-b-2 font-medium transition-colors ${
                      activeView === 'gerenciar-cursos'
                        ? 'border-pink-500 text-pink-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Gerenciar Cursos
                  </button>
                  <button
                    onClick={() => setActiveView('gerenciar-alunos')}
                    className={`pb-2 border-b-2 font-medium transition-colors ${
                      activeView === 'gerenciar-alunos'
                        ? 'border-pink-500 text-pink-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Gerenciar Alunos
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Content */}
          {activeView === 'home' && <RenderHome />  }
          {activeView === 'gerenciar-cursos' && <RenderManageCourses />}
          {activeView === 'gerenciar-alunos' && <RenderManageStudents />}
        </div>
      </main>
    </div>
  );
}