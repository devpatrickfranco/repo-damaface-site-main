import Link from 'next/link';
import DynamicIcon from '@/app/franqueado/academy/components/DynamicIcon';

import { useState, useEffect } from 'react';
import { apiBackend } from '@/lib/api-backend';
import { useCategorias /*, useTrilhas */, useCursos } from '@/hooks/useApi';

import type { Categoria /*, Trilha */, Curso } from '@/types/academy'

import { 
  Clock, 
  Star, 
  BookOpen, 
  ChevronRight,
  PlayCircle,
  Loader2
} from 'lucide-react';



interface Estatisticas {
  cursosIniciados: number;
  percentualConcluido: number;
  ultimoCurso: string;
  certificados: number;
  horasEstudadas: number;
}

export default function RenderHome() {
  // Estados para dados da API
  const {
    data: categorias = [],
    loading: loadingCategorias,
    error: errorCategorias,
  } = useCategorias({ page_size: 6 });

  // TODO: Trilhas de Formação - Comentado temporariamente
  // const {
  //   data: trilhas = [],
  //   loading: loadingTrilhas,
  //   error: errorTrilhas,
  // } = useTrilhas({ page_size: 6 });

  const { 
    data: cursosDestaque = [],
    loading: loadingCursos,
    error: errorCursos,
  } = useCursos({ destaque: true, page_size: 2 });

  const loading = loadingCategorias /* || loadingTrilhas */ || loadingCursos;
  const error = errorCategorias /* || errorTrilhas */ || errorCursos;

// Estatísticas
const calcularEstatisticas = (cursos: Curso[] = []) => {
  const cursosComProgresso = cursos.filter(c => c.progresso && c.progresso.progresso_percentual > 0);
  const cursosIniciados = cursosComProgresso.length;

  const somaProgresso = cursosComProgresso.reduce((acc, c) => 
    acc + (c.progresso?.progresso_percentual || 0), 0
  );
  const percentualMedio = cursosIniciados > 0 
    ? Math.round(somaProgresso / cursosIniciados) 
    : 0;

  const certificados = cursos.filter(c => 
    c.progresso?.concluida
  ).length;

  // Estimativa de horas estudadas (simplificada)
  const horasEstudadas = cursosComProgresso.reduce((acc, c) => {
    const duracao = parseDuracao(c.duracao);
    const progresso = c.progresso?.progresso_percentual || 0;
    return acc + (duracao * progresso / 100);
  }, 0);

  const ultimoCurso = cursosComProgresso[0]?.titulo || 'Nenhum curso iniciado';

  return {
    cursosIniciados,
    percentualConcluido: percentualMedio,
    ultimoCurso,
    certificados,
    horasEstudadas: Math.round(horasEstudadas * 10) / 10
  };
};
  const estatisticas = calcularEstatisticas(cursosDestaque || []);

  // Função auxiliar para converter duração em horas
  const parseDuracao = (duracao: string): number => {
    const match = duracao.match(/(\d+)h?\s*(\d+)?m?/);
    if (!match) return 0;
    const horas = parseInt(match[1]) || 0;
    const minutos = parseInt(match[2]) || 0;
    return horas + minutos / 60;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => {
            if (errorCategorias) useCategorias({ page_size: 6 }).refetch();
            // if (errorTrilhas) useTrilhas({ page_size: 6 }).refetch();
            if (errorCursos) useCursos({ destaque: true, page_size: 2 }).refetch();
          }}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          DamaFace Academy
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Desenvolva suas habilidades e domine todos os aspectos do seu negócio com nossos cursos especializados
        </p>
      </div>

      {/* Categorias Section */}
      {categorias && categorias.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Categorias</h2>
            <Link
              href="/franqueado/academy/categorias"
              className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map((categoria) => (
              <Link
                key={categoria.slug}
                href={`/franqueado/academy/categorias/${categoria.slug}`}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-400/30 transition-all cursor-pointer group hover:scale-105"
              >
                <div 
                style={{ backgroundColor: categoria.cor }}
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={categoria.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{categoria.nome}</h3>
                <p className="text-sm text-gray-400">
                  Ver cursos
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* TODO: Trilhas de Formação - Comentado temporariamente */}
      {/* Trilhas Section */}
      {/* {trilhas && trilhas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trilhas de Formação</h2>
            <Link
              href="/franqueado/academy/trilhas"
              className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trilhas.map((trilha) => (
              <Link
                key={trilha.slug}
                href={`/franqueado/academy/trilhas/${trilha.slug}`}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-400/30 transition-all cursor-pointer group hover:scale-105"
              >
                <div
                style={ { backgroundColor: trilha.cor}}

                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={trilha.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{trilha.titulo}</h3>
                <p className="text-sm text-gray-400">
                  {trilha.cursos.length} cursos • {trilha.tempoTotal}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )} */}
      {/* Cursos em Destaq  ue Section */}
      {cursosDestaque && cursosDestaque.length > 0 && (
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Cursos em Destaque</h2>
            <Link
              href="/franqueado/academy/cursos"
              className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
            >
              <span> Ver todos</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cursosDestaque.map((curso) => (
              <Link
                key={curso.id}
                href={`/franqueado/academy/cursos/${curso.slug}`}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-400/30 transition-all cursor-pointer group"
              >
                
                <div className="flex">
                  <div className="relative w-48 h-32 flex-shrink-0">
                    <img
                      src={curso.capa}
                      alt={curso.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                    {curso.preco !== undefined && parseFloat(curso.preco) > 0 && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                        PREMIUM 
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white text-lg line-clamp-2 group-hover:text-pink-400 transition-colors">
                        {curso.titulo}  
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {curso.descricao}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{curso.duracao}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{curso.total_aulas} aulas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{curso.rating}</span>
                        </div>
                      </div>
                    </div>
                    {curso.progresso && curso.progresso.percentual > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-pink-400">{curso.progresso.percentual}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${curso.progresso.percentual}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className='flex justify-end'>
        <Link
          href="/franqueado/academy/cursos"
          className="text-pink-400 hover:text-pink-300 flex items-center space-x-1"
        >
          <span>Meus Cursos</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Seu Progresso</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">{estatisticas.cursosIniciados}</div>
            <div className="text-sm text-gray-400">Cursos Iniciados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{estatisticas.percentualConcluido}%</div>
            <div className="text-sm text-gray-400">Concluído</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{estatisticas.certificados}</div>
            <div className="text-sm text-gray-400">Certificados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{estatisticas.horasEstudadas}h</div>
            <div className="text-sm text-gray-400">Horas Estudadas</div>
          </div>
        </div>
      </div>
    </div>
  );
}