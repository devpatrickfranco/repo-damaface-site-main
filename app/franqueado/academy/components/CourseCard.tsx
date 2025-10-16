// app/franqueado/academy/components/CourseCard.tsx
'use client';

import Link from 'next/link';
import { PlayCircle, Clock, BookOpen, Star, Trophy } from 'lucide-react';
import type { Curso } from '@/types/academy';

interface CourseCardProps {
  curso: Curso;
  viewMode?: 'grid' | 'list';
}

export default function CourseCard({ curso, viewMode = 'grid' }: CourseCardProps) {
  const isListMode = viewMode === 'list';
  
  return (
    <Link href={`/franqueado/academy/${curso.slug}`} className="group">
      <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-400/30 transition-all h-full ${isListMode ? 'flex' : 'flex-col'}`}>
        <div className={`relative ${isListMode ? 'w-48' : 'w-full h-48'} flex-shrink-0`}>
          <img src={curso.capa} alt={curso.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
          {curso.status === 'Pago' && <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PREMIUM</div>}
          {curso.progresso?.concluida && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center space-x-1"><Trophy className="w-3 h-3" /><span>CONCLUÍDO</span></div>}
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
        </div>
      </div>
    </Link>
  );
}