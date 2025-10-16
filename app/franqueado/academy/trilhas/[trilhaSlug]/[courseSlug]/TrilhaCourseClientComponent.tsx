"use client"

import Link from 'next/link';
import { cursos } from '@/data/academy/data-cursos';
import { notFound } from 'next/navigation';
import { 
  useAuth 
} from '@/context/AuthContext';
import { 
  useEffect 
} from 'react';
import { 
  useRouter 
} from 'next/navigation';
import { 
  ChevronLeft, 
  BookOpen, 
  Circle, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

// Componentes do Layout
import HeaderFranqueado from "@/app/franqueado/components/HeaderFranqueado";
import Sidebar from "@/app/franqueado/components/Sidebar";

interface CourseInTrailPageComponentProps {
  params: { trilhaSlug: string; courseSlug: string }
}

export default function CourseInTrailPage({ params }: CourseInTrailPageComponentProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado");
    }
  }, [isAuthenticated, authLoading, router]);
  
  const { trilhaSlug, courseSlug } = params;
  const curso = cursos.find((c) => c.slug === courseSlug);

  if (!curso) {
    notFound();
  }

  // Calcula o total de aulas e as concluídas para a barra de progresso
  const totalAulas = curso.modulos.reduce((acc, modulo) => acc + modulo.aulas.length, 0);
  const aulasConcluidas = curso.modulos.reduce((acc, modulo) => 
    acc + modulo.aulas.filter(aula => aula.concluida).length, 0);
  const progressoCurso = totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;

  return (
    // ✅ ESTRUTURA PRINCIPAL DO LAYOUT
    <div className="lg:ml-64 pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <HeaderFranqueado />
      <div className="flex">
        <Sidebar active="academy" />

        <main className="flex-1 p-6 md:p-8">
          {/* ✅ NAVEGAÇÃO E CABEÇALHO */}
          <div className="mb-8">
            <Link
              href={`/franqueado/academy/trilhas/${trilhaSlug}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar para a Trilha
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold">{curso.titulo}</h1>
            <p className="text-lg text-gray-300 mt-2 max-w-3xl">{curso.descricao}</p>

             {/* Barra de Progresso do Curso */}
             <div className="mt-6 max-w-3xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Progresso do Curso</span>
                    <span className="text-sm font-bold text-brand-pink">{Math.round(progressoCurso)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div 
                        className="bg-brand-pink h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressoCurso}%` }}
                    ></div>
                </div>
            </div>
          </div>

          {/* ✅ LISTA DE MÓDULOS E AULAS REESTILIZADA */}
          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-brand-pink" />
              Conteúdo do Curso
            </h2>
            <div className="space-y-6">
              {curso.modulos.map((modulo, moduloIndex) => (
                <div 
                  key={modulo.id} 
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                >
                  {/* Cabeçalho do Módulo */}
                  <div className="bg-white/5 p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink font-semibold">
                          {moduloIndex + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{modulo.titulo}</h3>
                     </div>
                     <span className="text-sm text-gray-400">{modulo.aulas.length} aulas</span>
                  </div>
                  
                  {/* Aulas */}
                  <div className="divide-y divide-white/10">
                    {modulo.aulas.map((aula) => (
                      <Link
                        key={aula.id}
                        href={`/franqueado/academy/cursos/${courseSlug}/${aula.slug}`}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {aula.concluida ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className="font-medium">{aula.titulo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4"/>
                          <span>{aula.duracao}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 