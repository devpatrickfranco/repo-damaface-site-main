// app/franqueado/academy/components/CourseDetailView.tsx
'use client';

import { useState } from 'react';
import type { Curso } from '@/types/academy';
import { Clock, Users, Star, BookOpen, CheckCircle, PlayCircle, Heart, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CourseDetailViewProps {
  curso: Curso;
}

export default function CourseDetailView({ curso }: CourseDetailViewProps) {
    const [activeTab, setActiveTab] = useState<'visao-geral' | 'curriculo' | 'instrutor' | 'avaliacoes'>('visao-geral');
    const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
    const [activeView, setActiveView] = useState<'home' | 'curso' | 'dashboard' | 'trilhas' | 'aula'>('home');
    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    // ... (Cole aqui todo o JSX da sua função `renderCurso` original)
    // Lembre-se de ajustar as chamadas de função e estado para usar props.
    // Ex: `selectedCourse.titulo` vira `curso.titulo`.
    // A navegação para a aula deve usar Link:
    // <Link href={`/franqueado/academy/${curso.slug}/${aula.slug}`}>...</Link>

    const renderCurso = () => {
    if (!selectedCourse) return null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setActiveView('home')}
          className="text-gray-400 hover:text-white flex items-center space-x-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Voltar</span>
        </button>

        {/* Course Banner */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img
              src={selectedCourse.capa}
              alt={selectedCourse.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {selectedCourse.categoria?.id}
                </span>
                <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                  {selectedCourse.nivel}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {selectedCourse.titulo}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedCourse.duracao}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{selectedCourse.aulas} aulas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{selectedCourse.alunos} alunos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{selectedCourse.rating} ({selectedCourse.avaliacoes})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'visao-geral', label: 'Visão Geral' },
                    { id: 'curriculo', label: 'Currículo' },
                    { id: 'instrutor', label: 'Instrutor' },
                    { id: 'avaliacoes', label: 'Avaliações' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-pink-500 text-pink-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'visao-geral' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Sobre este curso</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedCourse.descricao}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">O que você vai aprender</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Estratégias de marketing digital específicas para franquias</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Como criar campanhas eficazes de conversão</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Técnicas de retenção e fidelização de clientes</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Requisitos</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Conhecimento básico de internet</li>
                          <li>• Acesso a computador ou smartphone</li>
                          <li>• Vontade de aprender e aplicar</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculo' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Conteúdo do curso</h3>
                    <div className="space-y-4">
                      {selectedCourse.modulos.map((modulo, index) => (
                        <div key={modulo.id} className="bg-gray-700/30 rounded-lg border border-gray-600">
                          <div className="p-4 border-b border-gray-600">
                            <h4 className="font-medium text-white">
                              Módulo {index + 1}: {modulo.titulo}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {modulo.aulas.length} aulas
                            </p>
                          </div>
                          <div className="p-4 space-y-3">
                            {modulo.aulas.map((aula, aulaIndex) => (
                              <div
                                key={aula.id}
                                onClick={() => {
                                  setSelectedLesson(aula);
                                  setActiveView('aula');
                                }}
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  {aula.concluida ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <PlayCircle className="w-5 h-5 text-gray-400" />
                                  )}
                                  <div>
                                    <p className="text-white font-medium">
                                      {aulaIndex + 1}. {aula.titulo}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span>{aula.duracao}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instrutor' && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={selectedCourse.instrutor.avatar}
                        alt={selectedCourse.instrutor.nome}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {selectedCourse.instrutor.nome}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedCourse.instrutor.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'avaliacoes' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{selectedCourse.rating}</div>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= selectedCourse.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {selectedCourse.avaliacoes} avaliações
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedCourse.avaliacoesAlunos.map((avaliacao) => (
                        <div key={avaliacao.id} className="bg-gray-700/30 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={avaliacao.avatar}
                              alt={avaliacao.aluno}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-white">{avaliacao.aluno}</h4>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= avaliacao.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-400'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm">{avaliacao.comentario}</p>
                              <p className="text-gray-400 text-xs mt-2">{avaliacao.data}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCourse.status === 'Livre' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCourse.status}
                  </span>
                </div>
                
                {selectedCourse.status === 'Pago' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Preço</span>
                    <span className="text-2xl font-bold text-white">
                      R$ {selectedCourse.preco}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Aulas</span>
                  <span className="text-white">{selectedCourse.aulas}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Nível</span>
                  <span className="text-white">{selectedCourse.nivel}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Acesso</span>
                  <span className="text-white">Vitalício</span>
                </div>

                {(typeof selectedCourse.progresso === 'number' && selectedCourse.progresso > 0) && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-pink-400">{selectedCourse.progresso}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${selectedCourse.progresso}%` }}
                      />
                    </div>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                  {(typeof selectedCourse.progresso === 'number' && selectedCourse.progresso > 0) ? 'Continuar' : 'Comece agora'}
                </button>

                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-700">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                    <Heart className="w-4 h-4" />
                    <span>Favoritar</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

    return (
        <div className="space-y-6">
            {/* Banner do Curso */}
            {/* Abas de Navegação */}
            {/* Conteúdo das Abas */}
        </div>
    )
}