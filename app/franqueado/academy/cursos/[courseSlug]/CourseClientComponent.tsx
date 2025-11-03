'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCurso } from '@/hooks/useApi';
import CourseDetail from '@/app/franqueado/academy/components/CourseDetail';

interface PageProps {
  params: {
    courseSlug: string;
  };
}

export default function CursoPage({ params }: PageProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: curso, loading: cursoLoading, error } = useCurso(params.courseSlug);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado");
    }
  }, [isAuthenticated, authLoading, router]);

  // Loading state enquanto busca o curso
  if (cursoLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando curso...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Erro ao carregar curso</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Curso não encontrado
  if (!curso) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Curso não encontrado</h2>
          <p className="text-gray-400">O curso solicitado não está disponível.</p>
        </div>
      </div>
    );
  }

  return <CourseDetail cursoSlug={params.courseSlug} />;
}
