// app/franqueado/academy/components/DashboardView.tsx
'use client';

import { useState } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { cursos, categorias } from '@/data/academy/data-cursos';
import CourseCard from './CourseCard';

export default function DashboardView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Adicione aqui a lógica de filtros se necessário

  const filteredCursos = cursos.filter(curso =>
    curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Meus Cursos</h1>
        <p className="text-gray-400">Acompanhe seu progresso e continue aprendendo</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar em meus cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1 w-min">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredCursos.map((curso) => (
          <CourseCard key={curso.id} curso={curso} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}