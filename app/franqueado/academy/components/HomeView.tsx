// app/franqueado/academy/components/HomeView.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ChevronRight, Clock, BookOpen, Star, PlayCircle } from 'lucide-react';
import { categorias, cursos } from '@/data/academy/data-cursos';

export default function HomeView() {
  const [searchTerm, setSearchTerm] = useState('');
  const cursosDestaque = cursos.filter(c => c.destaque);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Academy de Franquias</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Desenvolva suas habilidades e domine todos os aspectos do seu negócio com nossos cursos especializados
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white"
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((cat) => {
            const Icon = cat.icon as any;
            return (
              <div key={cat.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-400/30 transition-all cursor-pointer group hover:scale-105">
                <div className={`w-12 h-12 ${cat.cor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{cat.nome}</h3>
                <p className="text-sm text-gray-400">{(() => {
                    const qtd = cursos.filter(curso => curso.categoria?.id === cat.id).length;
                    return `${qtd} ${qtd === 1 ? "curso" : "cursos"}`;
                  })()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Cursos em Destaque</h2>
          {/* Este botão pode no futuro levar para a aba 'dashboard' */}
          <span className="text-pink-400 flex items-center space-x-1">
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cursosDestaque.map((curso) => (
             <Link href={`/franqueado/academy/${curso.slug}`} key={curso.id} className="group">
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-400/30 transition-all h-full">
                   {/* ... JSX do card do curso ... */}
                </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  );
}