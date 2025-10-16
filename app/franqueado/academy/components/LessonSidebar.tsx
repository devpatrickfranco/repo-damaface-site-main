"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  ChevronRight,
  BookOpen,
  ClipboardCheck,
  ChevronDown,
  Lock,
} from "lucide-react";
import { Curso } from "@/types/academy";

interface LessonSidebarProps {
  curso: Curso;
  courseSlug: string;
  currentLessonSlug: string;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

export default function LessonSidebar({
  curso,
  courseSlug,
  currentLessonSlug,
  showSidebar,
  setShowSidebar,
}: LessonSidebarProps) {
  // -- Estado do acordeão dos módulos --
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>(
    () => {
      const activeModuleId =
        curso.modulos.find((m) =>
          m.aulas.some((a) => a.slug === currentLessonSlug)
        )?.id || null;
      return activeModuleId ? { [activeModuleId]: true } : {};
    }
  );

  const [isExtraSectionOpen, setIsExtraSectionOpen] = useState(true);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Correção: `concluida` pode vir em `aula.concluida` ou em `aula.progresso.concluida`
  const todasAulas = curso.modulos.flatMap((m) => m.aulas);
  const aulasConcluidas = todasAulas.filter(
    (a) => a.concluida || a.progresso?.concluida
  ).length;
  const cursoConcluido =
    todasAulas.length > 0 && aulasConcluidas === todasAulas.length;

  // Suporte para quizzes como array
  const quizzes = Array.isArray(curso.quizzes) ? curso.quizzes : [];
  const quiz = quizzes.length > 0 ? quizzes[0] : null;

  return (
    <>
      {/* Overlay para escurecer o fundo */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Container da Sidebar */}
      <div
        className={`fixed top-0 h-full w-96 bg-black/90 backdrop-blur-sm border-l border-white/10 transition-transform duration-300 z-40 flex flex-col
        ${showSidebar ? "right-0" : "-right-96"}`}
      >
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Conteúdo do Curso
          </h3>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo da Sidebar */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Seção 1: Módulos e Aulas */}
          <div className="space-y-4">
            {curso.modulos.map((modulo, moduloIndex) => {
              const isOpen = !!openModules[modulo.id];
              return (
                <div
                  key={modulo.id}
                  className="border border-white/10 rounded-lg overflow-hidden transition-all duration-300"
                >
                  {/* Cabeçalho do módulo */}
                  <button
                    onClick={() => toggleModule(modulo.id)}
                    className="w-full bg-white/5 p-4 flex items-center justify-between text-left hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink font-semibold text-xs flex-shrink-0">
                        {moduloIndex + 1}
                      </div>
                      <h4 className="font-medium text-white text-sm truncate">
                        {modulo.titulo}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {modulo.aulas.length} aulas
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Lista de aulas */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="divide-y divide-white/10 border-t border-white/10">
                      {modulo.aulas.map((aula) => (
                        <Link
                          key={aula.id}
                          href={`/franqueado/academy/cursos/${courseSlug}/${aula.slug}`}
                          className={`block p-3 hover:bg-white/5 transition-colors ${
                            aula.slug === currentLessonSlug
                              ? "bg-brand-pink/10 border-r-2 border-brand-pink"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {aula.concluida || aula.progresso?.concluida ? (
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`font-medium text-sm truncate ${
                                  aula.slug === currentLessonSlug
                                    ? "text-brand-pink"
                                    : "text-white"
                                }`}
                              >
                                {aula.titulo}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {aula.duracao}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seção 2: Avaliação e Materiais */}
          {((curso.materiais?.length ?? 0) > 0 || quiz) && (
            <>
              <hr className="my-6 border-white/10" />
              <div>
                <button
                  onClick={() => setIsExtraSectionOpen(!isExtraSectionOpen)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                    Avaliação e Materiais
                  </h4>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      isExtraSectionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExtraSectionOpen ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <div className="space-y-2">
                    {curso.materiais?.map((material, index) => (
                      <a
                        key={index}
                        href={material.url || material.arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/5 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {material.titulo}
                        </span>
                      </a>
                    ))}

                    {quiz && (
                      <div>
                        {cursoConcluido ? (
                          <Link
                            href={`/franqueado/academy/cursos/${courseSlug}/quiz/${quiz.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white/5 transition-colors"
                          >
                            <ClipboardCheck className="w-4 h-4 text-brand-pink flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">
                                {quiz.titulo}
                              </span>
                              <p className="text-xs text-gray-400">
                                Acerte 75% para concluir.
                              </p>
                            </div>
                          </Link>
                        ) : (
                          <div
                            className="flex items-center gap-3 p-3 rounded-lg text-gray-600 cursor-not-allowed bg-white/5"
                            title="Conclua todas as aulas para liberar o quiz."
                          >
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">
                                {quiz.titulo}
                              </span>
                              <p className="text-xs">
                                Liberado após concluir todas as aulas.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
