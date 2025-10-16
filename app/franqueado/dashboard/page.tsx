'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Sidebar from '../components/Sidebar'
import HeaderDashboard from '../components/HeaderFranqueado'
import CardDashboard from './components/CardDashboard'
import CommuniqueDashboard from './components/CommuniqueDashboard'
import AlertsDashboard from './components/AlertsDashboard'
import ChartDashboard from './components/ChartDashboard'
import RecentActivaitesDashboard from './components/RecentActivaitesDashboard'

export default function Dashboard() {
    const { isAuthenticated, user, loading   } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Se não está carregando e não está autenticado, manda para o login
        if (!loading && !isAuthenticated) {
            router.push('/franqueado');
        }
    }, [isAuthenticated, loading, router]);

    // Mostra um loader enquanto o estado de autenticação está sendo verificado
    if (loading) {
        return <p>Carregando...</p>;
    }

    // Se chegou aqui e não está autenticado, o useEffect já vai redirecionar,
    // mas retornamos null para não "piscar" a página errada.
    if (!isAuthenticated) {
        return null;
    }
    
    const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 0 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 19) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

    return (
    <>
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <HeaderDashboard />
      
      {/* Sidebar */}
      <Sidebar active='dashboard'/>        

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {getGreeting()}, {user?.nome.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400">
              Seja bem-vindo ao painel administrativo da DamaFace
            </p>
          </div>

          {/* Comunicados Rápidos */}
          <CommuniqueDashboard />

          {/* Alertas e Lembretes */}
          <AlertsDashboard />

          {/* Dashboard Cards */}
          <CardDashboard />

          {/* Área para Gráficos Futuros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gráfico de Performance */}
            <ChartDashboard />

            {/* Atividades Recentes */}
            <RecentActivaitesDashboard />
          </div>
        </div>
      </main>
    </div>

    </>
    );
}