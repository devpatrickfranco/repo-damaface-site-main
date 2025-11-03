'use client';


import Link from 'next/link';

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trilhas, cursos } from '@/data/academy/data-cursos';
import DynamicIcon from '@/app/franqueado/academy/components/DynamicIcon'
import { 
  Search, 
  Grid3X3,
  List,
  Clock,
  BookOpen,
  Users,
  Star,
  PlayCircle,
  TrendingUp,
  ChevronRight,
  Target,
  ArrowLeft
} from 'lucide-react';

export default function TrilhasPage() {
    const { user, loading: authLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push("/franqueado")
      }
    }, [isAuthenticated, authLoading, router])  
  
    const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'titulo' | 'cursos' | 'popularidade'>('titulo');

  // Calcula estatísticas para cada trilha
  const trilhasWithStats = trilhas.map(trilha => {
    // A lógica de filtro: suportar `trilha.cursos` como number[] ou Curso[]
    const trilhaCursoIds = trilha.cursos.map((c: any) => (typeof c === 'number' ? c : c.id));
    const cursosDaTrilha = cursos.filter(curso => trilhaCursoIds.includes(curso.id));
    const totalAlunos = cursosDaTrilha.reduce((acc, curso) => acc + curso.alunos, 0);
    const mediaRating = cursosDaTrilha.length > 0 
      ? cursosDaTrilha.reduce((acc, curso) => acc + curso.rating, 0) / cursosDaTrilha.length 
      : 0;
    
    return {
      ...trilha,
      totalCursos: cursosDaTrilha.length,
      totalAlunos,
      mediaRating: Number(mediaRating.toFixed(1)),
      cursos: cursosDaTrilha // Armazena os objetos completos dos cursos para fácil acesso
    };
  });

  // Filtra e ordena as trilhas
  const filteredTrilhas = trilhasWithStats
    .filter(trilha => 
      trilha.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'cursos':
          return b.totalCursos - a.totalCursos;
        case 'popularidade':
          return b.totalAlunos - a.totalAlunos;
        default: // 'titulo'
          return a.titulo.localeCompare(b.titulo);
      }
    });

  // Estatísticas gerais
  const estatisticas = {
    totalTrilhas: trilhas.length,
    totalCursos: cursos.length,
    totalAlunos: cursos.reduce((acc, curso) => acc + curso.alunos, 0),
    mediaRating: Number((cursos.reduce((acc, curso) => acc + curso.rating, 0) / cursos.length).toFixed(1))
  };

  // Função para renderizar o card de uma trilha
  const renderTrilhaCard = (trilha: any) => {
    return (
      <Link
        key={trilha.id}
        // Lembre-se de usar o caminho absoluto com o prefixo
        href={`/franqueado/academy/trilhas/${trilha.slug}`}
        className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-400/30 transition-all cursor-pointer group hover:scale-105 ${
          viewMode === 'list' ? 'flex items-center' : ''
        }`}
      >
        {/* Ícone e Header da Trilha */}
        <div className={`${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'w-full h-32'} ${trilha.cor} flex items-center justify-center relative overflow-hidden`}>
          <DynamicIcon name={trilha.icon} className={`${viewMode === 'list' ? 'w-8 h-8' : 'w-12 h-12'} text-white group-hover:scale-110 transition-transform`} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
        
        <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-white text-xl group-hover:text-pink-400 transition-colors">
              {trilha.titulo}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            {trilha.totalCursos} {trilha.totalCursos === 1 ? 'curso' : 'cursos'} nesta trilha
          </p>
          
          {/* Estatísticas */}
          <div className={`${viewMode === 'list' ? 'flex items-center space-x-6' : 'grid grid-cols-2 gap-4'} text-sm text-gray-400 mb-4`}>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{trilha.totalAlunos.toLocaleString()} alunos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{trilha.tempoTotal}</span>
            </div>
            {trilha.mediaRating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{trilha.mediaRating}</span>
              </div>
            )}
             <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${trilha.progresso > 0 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span>{trilha.progresso}% concluída</span>
              </div>
          </div>
          
          {/* Preview dos Cursos (apenas no modo grid) */}
          {viewMode === 'grid' && trilha.cursos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">CURSOS INCLUSOS:</p>
              <div className="space-y-1">
                {trilha.cursos.slice(0, 2).map((curso: any) => (
                  <div key={curso.id} className="flex items-center space-x-2 text-xs text-gray-400">
                    <PlayCircle className="w-3 h-3" />
                    <span className="truncate">{curso.titulo}</span>
                  </div>
                ))}
                {trilha.cursos.length > 2 && (
                  <p className="text-xs text-pink-400">+{trilha.cursos.length - 2} mais</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
      <>
        <div className="p-2">
          <Link href="/franqueado/academy">
            <ArrowLeft className="text-white hover:text-pink-500 cursor-pointer" />
          </Link>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Trilhas de Formação
                </h1>
                <p className="text-gray-400 text-lg">
                  Siga roteiros de estudo guiados para dominar áreas do negócio
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Trilhas</p>
                    <p className="text-2xl font-bold text-white">{estatisticas.totalTrilhas}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
              </div>
              
              {/* Os outros cards de estatísticas são globais e podem ser mantidos */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-gray-400 text-sm">Total de Cursos</p>
                     <p className="text-2xl font-bold text-white">{estatisticas.totalCursos}</p>
                   </div>
                   <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                     <BookOpen className="w-5 h-5 text-blue-500" />
                   </div>
                 </div>
               </div>
               <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-gray-400 text-sm">Total de Alunos</p>
                     <p className="text-2xl font-bold text-white">{estatisticas.totalAlunos.toLocaleString()}</p>
                   </div>
                   <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                     <Users className="w-5 h-5 text-green-500" />
                   </div>
                 </div>
               </div>
               <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-gray-400 text-sm">Avaliação Média</p>
                     <p className="text-2xl font-bold text-white">{estatisticas.mediaRating}</p>
                   </div>
                   <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                     <Star className="w-5 h-5 text-yellow-500" />
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar trilhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="titulo">Ordenar por nome</option>
                  <option value="cursos">Mais cursos</option>
                  <option value="popularidade">Mais populares</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400">
              Mostrando {filteredTrilhas.length} de {trilhas.length} trilhas
            </div>
          </div>

          {filteredTrilhas.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredTrilhas.map(renderTrilhaCard)}
            </div>
          ) : (
            <div className="text-center py-12">
               <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search className="w-12 h-12 text-gray-600" />
               </div>
               <h3 className="text-xl font-semibold text-white mb-2">Nenhuma trilha encontrada</h3>
               <p className="text-gray-400 mb-6">Tente ajustar seus termos de busca</p>
               <button
                 onClick={() => setSearchTerm('')}
                 className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
               >
                 Limpar busca
               </button>
             </div>
          )}

          {/* Seção de Trilhas Mais Populares */}
          <div className="mt-12">
             <h2 className="text-2xl font-bold text-white mb-6">Trilhas Mais Populares</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {trilhasWithStats
                 .sort((a, b) => b.totalAlunos - a.totalAlunos)
                 .slice(0, 3)
                 .map((trilha) => (
                   <Link
                     key={`popular-${trilha.id}`}
                     href={`/franqueado/academy/trilhas/${trilha.slug}`}
                     className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 p-6 hover:border-pink-400/30 transition-all cursor-pointer group"
                   >
                    {/* ... (conteúdo do card popular, similar ao de categorias) ... */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 ${trilha.cor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <DynamicIcon name={trilha.icon} className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg group-hover:text-pink-400 transition-colors">
                          {trilha.titulo}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {trilha.totalAlunos.toLocaleString()} alunos inscritos
                        </p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-pink-400" />
                    </div>
                   </Link>
                 ))}
             </div>
           </div>
        </div>
    </>
  );
}