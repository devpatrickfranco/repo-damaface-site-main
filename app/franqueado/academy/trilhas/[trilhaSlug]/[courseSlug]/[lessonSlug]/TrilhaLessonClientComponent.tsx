"use client"

import { cursos } from '@/data/academy/data-cursos';
import { notFound } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link';

interface LessonInTrailPagePageComponentProps {
  params: { trilhaSlug: string; courseSlug: string; lessonSlug: string }
}


export default function LessonInTrailPage({ params }: LessonInTrailPagePageComponentProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/franqueado")
      }
    }, [isAuthenticated, authLoading, router])  
  
  
  const { courseSlug, lessonSlug } = params;

  const curso = cursos.find((c) => c.slug === courseSlug);
  const aula = curso?.modulos.flatMap((m) => m.aulas).find((a) => a.slug === lessonSlug);

  if (!curso || !aula) {
    notFound();
  }

  return (
    <>
    <div className="p-6 md:p-8 text-white">
      <div className="mb-6">
        <p className="text-sm text-indigo-400 mb-2">
          <Link href={`/franqueado/academy/trilhas/${params.trilhaSlug}/${params.courseSlug}`} className="hover:underline">
            Voltar para o Curso
          </Link>
        </p>
        <h1 className="text-3xl font-bold">{aula.titulo}</h1>
      </div>

      {/* Área do Player de Vídeo */}
      <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
        <p className="text-gray-500">[ Player de Vídeo da Aula: {aula.titulo} ]</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Detalhes da Aula</h2>
        <p><strong>Duração:</strong> {aula.duracao}</p>
        <p><strong>Status:</strong> {aula.concluida ? "Concluída" : "Pendente"}</p>
      </div>
    </div>
    </>
  );
}