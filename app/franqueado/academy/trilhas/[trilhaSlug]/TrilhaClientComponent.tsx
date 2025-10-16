"use client"

import Link from 'next/link';
import { trilhas, cursos } from '@/data/academy/data-cursos';
import { notFound } from 'next/navigation';
import { CheckCircle, ChevronLeft, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Componentes do Layout
import HeaderFranqueado from "@/app/franqueado/components/HeaderFranqueado";
import Sidebar from "@/app/franqueado/components/Sidebar";
import DynamicIcon from '@/app/franqueado/academy/components/DynamicIcon'

interface TrilhaPageProps {
  params: { trilhaSlug: string }
}

export default function TrilhaPage({ params }: TrilhaPageProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado");
    }
  }, [isAuthenticated, authLoading, router]);

  const { trilhaSlug } = params;
  const trilha = trilhas.find((t) => t.slug === trilhaSlug);

  if (!trilha) {
    notFound();
  }

  // Filtra os cursos que pertencem a esta trilha (suporta Curso[] ou number[])
  const trilhaCursoIds = trilha.cursos.map((c: any) => (typeof c === 'number' ? c : c.id));
  const cursosDaTrilha = cursos.filter((curso) => trilhaCursoIds.includes(curso.id));

  return (
    // ✅ ESTRUTURA PRINCIPAL DO LAYOUT
    <div className="lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <HeaderFranqueado />
      <div className="flex">
        <Sidebar active="academy" />

        <main className="flex-1 p-6 md:p-8">
          {/* ✅ NAVEGAÇÃO PARA VOLTAR */}
          <div className="mb-8">
            <Link
              href="/franqueado/academy/trilhas"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar para trilhas
            </Link>

            {/* ✅ CABEÇALHO DA TRILHA */}
            <div className="flex items-start gap-6">
              <div className={`inline-block p-4 rounded-xl shadow-lg ${trilha.cor}`}>
                <DynamicIcon name={trilha.icon} className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">{trilha.titulo}</h1>
                <p className="text-lg text-gray-300 max-w-3xl">{trilha.descricao}</p>
              </div>
            </div>
          </div>

          {/* ✅ SEÇÃO DE CURSOS REESTILIZADA */}
          <div className="border-t border-white/10 pt-8">
             <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-brand-pink" />
                Etapas da Trilha
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {cursosDaTrilha.map((curso) => (
                <Link
                  key={curso.id}
                  href={`/franqueado/academy/trilhas/${trilha.slug}/${curso.slug}`}
                  className="block p-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{curso.titulo}</h3>
                      <span className="text-sm font-medium text-gray-400">{curso.aulas} aulas • {curso.duracao}</span>
                    </div>
                    {(typeof curso.progresso === 'number' ? curso.progresso : (curso.progresso?.progresso_percentual ?? 0)) === 100 && (
                      <div className="flex items-center gap-2 text-green-400 ml-4">
                         <CheckCircle className="h-5 w-5" />
                         <span className="text-sm font-bold hidden md:block">Concluído</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Barra de Progresso */}
                  <div className="mt-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                            className="bg-brand-pink h-2 rounded-full transition-all duration-500"
                            style={{ width: `${typeof curso.progresso === 'number' ? curso.progresso : (curso.progresso?.progresso_percentual ?? 0)}%` }}
                        ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}