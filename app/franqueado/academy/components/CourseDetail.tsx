"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCurso } from "@/hooks/useApi";
import type { Curso, Modulo, Aula, materiais, AvaliacaoAluno } from "@/types/academy";

import { format } from 'date-fns'

import Link from "next/link";
import Image from "next/image";
import Avatar from '@/app/franqueado/components/Avatar';
import { enrollCourse, postAvaliacao, updateAvaliacao, deleteAvaliacao, gerarCertificado, downloadCertificado } from "@/hooks/useApi";

import { Play, Clock, Users, Star, BookOpen, Award, CheckCircle, Circle, FileText, ChevronRight, Trash2, Edit2, Send, X, Download, AlertCircle } from 'lucide-react';

interface CourseDetailProps {
  cursoSlug: string;
}

export default function CourseDetail({ cursoSlug }: CourseDetailProps) {
  const { user } = useAuth();
  const { data: curso, loading: cursoLoading, error: cursoError, refetch } = useCurso(cursoSlug);

  // Estados para avaliações
  const [novaAvaliacao, setNovaAvaliacao] = useState({ nota: 0, comentario: "" });
  const [editandoAvaliacaoId, setEditandoAvaliacaoId] = useState<number | null>(null);
  const [editandoAvaliacao, setEditandoAvaliacao] = useState({ nota: 0, comentario: "" });
  const [submitingAvaliacao, setSubmitingAvaliacao] = useState(false);

  // Estados para comentários
  const [novoComentario, setNovoComentario] = useState("");
  const [editandoComentarioId, setEditandoComentarioId] = useState<number | null>(null);
  const [comentarioEditando, setComentarioEditando] = useState("");
  const [submitingComentario, setSubmitingComentario] = useState(false);

  // Estados para inscrição
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Estado para download de certificado
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  // Função para inscrever no curso
  const handleEnrollCourse = async () => {
    if (!user) {
      alert("Você precisa estar logado para se inscrever no curso.");
      return;
    }

    try {
      setEnrolling(true);
      setEnrollError(null);
      
      await enrollCourse(cursoSlug);
      await refetch();
      
      alert("Inscrição realizada com sucesso! Você agora é um aluno deste curso.");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erro ao se inscrever no curso. Tente novamente.";
      setEnrollError(errorMessage);
      alert(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  // Função para baixar certificado
const handleDownloadCertificado = async () => {
  if (!curso || !curso.progresso?.inscricao_id) {
    alert("Não foi possível encontrar sua inscrição.");
    return;
  }

  try {
    setDownloadingCertificate(true);

    // Gera o certificado usando o inscricao_id do progresso
    const response = await gerarCertificado(curso.progresso.inscricao_id);
    
    // Extrai o ID do certificado da resposta
    const certificadoUuid = response.certificado.codigo_validacao;

    // Faz o download do PDF
    const blobResponse = await downloadCertificado(certificadoUuid);
    
    // Cria um link temporário para download
    const blob = new Blob([blobResponse], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-${curso.titulo.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Recarrega o curso para atualizar o status do certificado
    await refetch();
    
    alert("Certificado baixado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao baixar certificado:", error);
    
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.detail || 
                        "Erro ao baixar certificado. Tente novamente.";
    alert(errorMessage);
  } finally {
    setDownloadingCertificate(false);
  }
};

  // Loading state
  if (cursoLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <main className="flex-1 p-6">
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Carregando curso...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (cursoError || !curso) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <main className="flex-1 p-6">
            <div className="text-center py-20">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-red-400 mb-2">Curso não encontrado</h1>
                <p className="text-gray-400">O curso solicitado não existe ou foi removido.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Usar o progresso da API
  const progresso = curso.progresso?.percentual || 0;
  const cursoCompleto = curso.progresso?.concluido || false;
  const quizConcluido = curso.progresso?.quiz_conclido || false;
  const totalAulas = curso.total_aulas || 0;

  // Calcular aulas completas baseado no progresso percentual
  const aulasCompletas = Math.round((progresso / 100) * totalAulas);

  const categoria = curso.categoria;

  // Filtrar avaliações e comentários
  const avaliacoes = curso.avaliacoes?.filter((av: any) => av.tipo === 'AVALIACAO') || [];
  const comentarios = curso.avaliacoes?.filter((av: any) => av.tipo === 'COMENTARIO') || [];

  // Verificar se o usuário já tem avaliação ou comentário
  const minhaAvaliacao = avaliacoes.find((av: any) => av.aluno_id === user?.aluno_id);
  const meuComentario = comentarios.find((com: any) => com.aluno_id === user?.aluno_id);

  const getProximaAula = () => {
    if (!curso.modulos || curso.modulos.length === 0) return null;
    
    // Se há ultima_aula_id no progresso, buscar a próxima
    if (curso.progresso?.ultima_aula_id) {
      let encontrouUltima = false;
      for (const modulo of curso.modulos) {
        for (const aula of modulo.aulas) {
          if (encontrouUltima) return aula;
          if (aula.id === curso.progresso.ultima_aula_id) {
            encontrouUltima = true;
          }
        }
      }
    }
    
    // Buscar primeira aula não concluída
    for (const modulo of curso.modulos) {
      const aulaIncompleta = modulo.aulas.find((aula: Aula) => !aula.concluida);
      if (aulaIncompleta) return aulaIncompleta;
    }
    
    // Retornar primeira aula se nenhuma incompleta for encontrada
    return curso.modulos[0]?.aulas[0] || null;
  };

  const proximaAula = getProximaAula();

  // Funções para comentários
  const handleAddComentario = async () => {
    if (!novoComentario.trim() || !user) return;

    try {
      setSubmitingComentario(true);
      
      await postAvaliacao({
        curso: curso.id,
        tipo: "COMENTARIO",
        comentario: novoComentario
      });

      setNovoComentario("");
      await refetch();
      alert("Comentário adicionado com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.comentario?.[0] || "Erro ao adicionar comentário!";
      alert(errorMessage);
    } finally {
      setSubmitingComentario(false);
    }
  };

  const handleDeleteComentario = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar seu comentário?")) return;

    try {
      await deleteAvaliacao(id);
      await refetch();
      alert("Comentário apagado com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erro ao apagar comentário!";
      alert(errorMessage);
    }
  };

  const handleEditComentario = (comentario: any) => {
    setEditandoComentarioId(comentario.id);
    setComentarioEditando(comentario.comentario);
  };

  const handleSaveEditComentario = async (id: number) => {
    if (!comentarioEditando.trim()) {
      alert("O comentário não pode estar vazio.");
      return;
    }

    try {
      await updateAvaliacao(id, {
        comentario: comentarioEditando
      });

      setEditandoComentarioId(null);
      setComentarioEditando("");
      await refetch();
      alert("Comentário atualizado com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erro ao atualizar comentário!";
      alert(errorMessage);
    }
  };

  // Funções para avaliações
  async function handleAddAvaliacao() {
    if (!user) return;
    
    if (novaAvaliacao.nota === 0) {
      alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!novaAvaliacao.comentario.trim()) {
      alert("Por favor, escreva um comentário sobre o curso.");
      return;
    }

    try {
      setSubmitingAvaliacao(true);
      
      await postAvaliacao({
        curso: curso.id,
        tipo: "AVALIACAO",
        nota: novaAvaliacao.nota,
        comentario: novaAvaliacao.comentario
      });

      setNovaAvaliacao({ nota: 0, comentario: "" });
      await refetch();
      alert("Avaliação enviada com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.nota?.[0] || "Erro ao enviar avaliação!";
      alert(errorMessage);
    } finally {
      setSubmitingAvaliacao(false);
    }
  }

  const handleEditAvaliacao = (avaliacao: any) => {
    setEditandoAvaliacaoId(avaliacao.id);
    setEditandoAvaliacao({ nota: avaliacao.rating || avaliacao.nota, comentario: avaliacao.comentario });
  };

  const handleSaveEditAvaliacao = async (id: number) => {
    if (editandoAvaliacao.nota === 0 || !editandoAvaliacao.comentario.trim()) {
      alert("Por favor, mantenha a nota e o comentário preenchidos.");
      return;
    }

    try {
      await updateAvaliacao(id, {
        nota: editandoAvaliacao.nota,
        comentario: editandoAvaliacao.comentario
      });

      setEditandoAvaliacaoId(null);
      await refetch();
      alert("Avaliação atualizada com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erro ao atualizar avaliação!";
      alert(errorMessage);
    }
  };

  const handleDeleteAvaliacao = async (id: number) => {
    if (!confirm("Tem certeza que deseja apagar sua avaliação?")) return;

    try {
      await deleteAvaliacao(id);
      await refetch();
      alert("Avaliação apagada com sucesso!");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Erro ao apagar avaliação!";
      alert(errorMessage);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onStarClick && onStarClick(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const imageUrl =
  user && user.imgProfile
    ? `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${user.imgProfile}`
    : null

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex">
        <main className="flex-1 p-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-pink/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            <div className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                    <Link href="/franqueado/academy" className="hover:text-white transition-colors">Academy</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/franqueado/academy/cursos" className="hover:text-white transition-colors">Cursos</Link>
                    <ChevronRight className="w-4 h-4" />
                    {categoria && (
                      <>
                        <Link
                          href={`/franqueado/academy/categorias/${categoria.slug}`}
                          className="text-brand-pink hover:text-brand-pink/80 transition-colors"
                        >
                          {categoria.nome}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                    <span className="text-white">{curso.titulo}</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">{curso.titulo}</h1>
                  <p className="whitespace-pre-wrap text-xl text-gray-300 mb-6 text-pretty">{curso.descricao}</p>
                  
                  {/* Course Stats */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-5 h-5 text-brand-pink" />
                      <span>{curso.duracao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <span>{totalAulas} aulas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5 text-green-400" />
                      <span>{curso.alunos?.toLocaleString() || 0} alunos</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span>{curso.rating || "5.0"} ({avaliacoes.length} avaliações)</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {!curso.is_enrolled && (
                      <button
                        onClick={handleEnrollCourse}
                        disabled={enrolling}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500/90 hover:to-green-600/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <BookOpen className="w-5 h-5" />
                        {enrolling ? "Inscrevendo..." : "Inscrever-se no Curso"}
                      </button>
                    )}
                    {curso.is_enrolled && proximaAula && (
                      <Link href={`/franqueado/academy/cursos/${curso.slug}/${proximaAula.slug}`}>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pink/90 hover:to-pink-600/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-pink/25">
                          <Play className="w-5 h-5" />
                          {progresso === 0
                            ? "Iniciar Curso"
                            : cursoCompleto
                            ? "Revisar Curso"
                            : "Continuar Curso"}
                        </button>
                      </Link>
                    )}
                    {curso.status === "Pago" && curso.preco && (
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold">R$ {curso.preco}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Course Image */}
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                    {curso.capa ? (
                      <img
                        src={curso.capa || "/placeholder.svg"}
                        alt={curso.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-pink/20 to-purple-600/20" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      {proximaAula && (
                        <Link href={`/franqueado/academy/cursos/${curso.slug}/${proximaAula.slug}`}>
                          <button className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo e Sidebar */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Section */}
              {curso.is_enrolled && progresso > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  {cursoCompleto ? (
                    <div>
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                          <h3 className="text-2xl font-semibold text-green-400">Curso Concluído!</h3>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 w-full" />
                        </div>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-300 mb-6">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span>Parabéns! Você concluiu todas as {totalAulas} aulas</span>
                          </div>
                        </div>
                        
                        {/* Seção de Certificado - Condicional baseada no quiz */}
                        {quizConcluido ? (
                          <button
                            onClick={handleDownloadCertificado}
                            disabled={downloadingCertificate}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500/90 hover:to-yellow-600/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {downloadingCertificate ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Gerando certificado...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-5 h-5" />
                                <span>Baixar Certificado</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 max-w-md mx-auto">
                            <div className="flex items-center gap-3 text-yellow-400">
                              <AlertCircle className="w-6 h-6 flex-shrink-0" />
                              <p className="text-sm font-medium">
                                Faça o quiz para obter seu certificado
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Seção de Avaliação do Curso */}
                      {!minhaAvaliacao && (
                        <div className="border-t border-white/10 pt-6 mt-6">
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Avalie este curso
                          </h4>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sua nota:
                              </label>
                              {renderStars(novaAvaliacao.nota, true, (rating: number) =>
                                setNovaAvaliacao(prev => ({ ...prev, nota: rating }))
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Seu comentário:
                              </label>
                              <textarea
                                value={novaAvaliacao.comentario}
                                onChange={(e) =>
                                  setNovaAvaliacao(prev => ({
                                    ...prev,
                                    comentario: e.target.value,
                                  }))
                                }
                                placeholder="Conte-nos o que achou do curso..."
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 resize-none h-24"
                              />
                            </div>

                            <button
                              onClick={handleAddAvaliacao}
                              disabled={submitingAvaliacao}
                              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500/90 hover:to-yellow-600/90 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Star className="w-4 h-4" />
                              {submitingAvaliacao ? "Enviando..." : "Enviar Avaliação"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Seu Progresso</h3>
                        <span className="text-brand-pink font-semibold">{progresso}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div
                          className="bg-gradient-to-r from-brand-pink to-pink-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>{aulasCompletas} de {totalAulas} aulas concluídas</span>
                        <span>•</span>
                        <span>Nível: {curso.nivel}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Seção quando não há progresso */}
              {curso.is_enrolled && progresso === 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <BookOpen className="w-8 h-8 text-brand-pink" />
                      <h3 className="text-2xl font-semibold text-white">Pronto para Começar?</h3>
                    </div>
                    <p className="text-gray-300 mb-6">
                      {totalAulas > 0
                        ? `Este curso possui ${totalAulas} aulas esperando por você. Comece agora sua jornada de aprendizado!`
                        : `Este curso contém ${curso.materiais?.length || 0} materiais de apoio.`}
                    </p>
                    {proximaAula && (
                      <Link href={`/franqueado/academy/cursos/${curso.slug}/${proximaAula.slug}`}>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pink/90 hover:to-pink-600/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-pink/25 mx-auto">
                          <Play className="w-5 h-5" />
                          Iniciar Curso
                        </button>
                      </Link>
                    )}
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4" />
                        <span>{curso.duracao}</span>
                      </div>
                      {totalAulas > 0 ? (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{totalAulas} aulas</span>
                        </div>
                      ) : (curso.materiais?.length ?? 0) > 0 ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span>{curso.materiais?.length ?? 0} materiais</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>Nível: {curso.nivel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Se usuario não está inscrito */}
              {!curso.is_enrolled && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-brand-pink" />
                    <h3 className="text-2xl font-semibold text-white">Inscreva-se para começar!</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Faça sua inscrição para desbloquear o acesso às aulas e materiais deste curso.
                  </p>
                  <button
                    onClick={handleEnrollCourse}
                    disabled={enrolling}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500/90 hover:to-green-600/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                  >
                    <BookOpen className="w-5 h-5" />
                    {enrolling ? "Inscrevendo..." : "Inscrever-se no Curso"}
                  </button>
                </div>
              )}
  
              {/* Course Modules */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Conteúdo do Curso</h3>

                {curso.modulos && curso.modulos.length > 0 ? (
                  <div className="space-y-4">
                    {curso.modulos.map((modulo: Modulo, index: number) => (
                      <div key={modulo.id} className="border border-white/10 rounded-lg overflow-hidden">
                        <div className="bg-white/5 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink font-semibold text-sm">{index + 1}</div>
                            <h4 className="font-semibold text-white">{modulo.titulo}</h4>
                          </div>
                          <span className="text-sm text-gray-400">{modulo.aulas.length} aulas</span>
                        </div>
                        <div className="divide-y divide-white/10">
                          {modulo.aulas.map((aula) => (
                            <Link
                              key={aula.id}
                              href={`/franqueado/academy/cursos/${curso.slug}/${aula.slug}`}
                              className="block"
                            >
                              <div className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                                {"progresso" in aula && aula.progresso ? (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <div className="flex-1">
                                  <h5 className="text-white font-medium hover:text-brand-pink transition-colors">{aula.titulo}</h5>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm text-gray-400 flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {aula.duracao}
                                    </span>
                                  </div>
                                </div>
                                <Play className="w-4 h-4 text-brand-pink" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (curso.materiais?.length ?? 0) > 0 ? (
                  <div className="divide-y divide-white/10 border border-white/10 rounded-lg overflow-hidden">
                    {(curso.materiais ?? []).map((material: materiais) => (
                      <a 
                        key={material.id} 
                        href={material.arquivo || material.url || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div className="flex-1">
                            <h5 className="text-white font-medium hover:text-brand-pink transition-colors">{material.titulo}</h5>
                            <span className="text-xs text-gray-400 uppercase">{material.tipo}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Esse curso ainda não está disponível :(</p>
                  </div>
                )}
              </div>

              {/* Student Reviews */}
              {avaliacoes.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6">Avaliações dos Alunos</h3>
                  <div className="space-y-6">
                    {avaliacoes.map((avaliacao: AvaliacaoAluno) => (
                      <div key={avaliacao.id} className="flex gap-4">
                        {avaliacao.avatar && avaliacao.avatar !== "" ? (
                          <img
                            src={avaliacao.avatar || "/placeholder.svg"}
                            alt={avaliacao.aluno}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <Avatar />
                        )}
                        <div className="flex-1">
                          {editandoAvaliacaoId === avaliacao.id ? (
                            // Modo de edição
                            <div className="space-y-3">
                              <div>
                                {renderStars(editandoAvaliacao.nota, true, (rating: number) =>
                                  setEditandoAvaliacao(prev => ({ ...prev, nota: rating }))
                                )}
                              </div>
                              <textarea
                                value={editandoAvaliacao.comentario}
                                onChange={(e) =>
                                  setEditandoAvaliacao(prev => ({
                                    ...prev,
                                    comentario: e.target.value,
                                  }))
                                }
                                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white resize-none h-24"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEditAvaliacao(avaliacao.id)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                                >
                                  Salvar
                                </button>
                                <button
                                  onClick={() => setEditandoAvaliacaoId(null)}
                                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Modo de visualização
                            <>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-white">{avaliacao.aluno}</h4>
                                {renderStars(avaliacao.rating || avaliacao.rating)}
                                <span className="text-sm text-gray-400">
                                  {format(new Date(avaliacao.data || avaliacao.data), 'dd/MM/yyyy')}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-3">{avaliacao.comentario}</p>
                              
                              {/* Botões só aparecem para o autor */}
                              {user && avaliacao.autorId === user.aluno_id && (
                                <div className="flex gap-3 text-sm">
                                  <button
                                    onClick={() => handleEditAvaliacao(avaliacao)}
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                  >
                                    <Edit2 className="w-4 h-4" /> Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAvaliacao(avaliacao.id)}
                                    className="flex items-center gap-1 text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-4 h-4" /> Apagar
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comentários */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Comentários</h3>

                {/* Formulário para adicionar comentário - só aparece se não tiver comentário */}
                {user && !meuComentario && (
                  <div className="flex gap-3 mb-6">
                    {imageUrl ? (
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={user.nome}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar />
                    )}
                    <div className="flex-1">
                      <textarea
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 resize-none"
                        rows={3}
                      />
                      <button
                        onClick={handleAddComentario}
                        disabled={submitingComentario}
                        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-pink hover:bg-brand-pink/90 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" /> 
                        {submitingComentario ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {comentarios.map((coment: AvaliacaoAluno) => (
                    <div key={coment.id} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                      {coment.avatar && coment.avatar !== "" ? (
                        <img
                          src={coment.avatar || "/placeholder.svg"}
                          alt={coment.aluno}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-white">{coment.aluno}</span>
                          <span className="text-xs text-gray-400">
                            {format(new Date(coment.data), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        {editandoComentarioId === coment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={comentarioEditando}
                              onChange={(e) => setComentarioEditando(e.target.value)}
                              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleSaveEditComentario(coment.id)} 
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                              >
                                Salvar
                              </button>
                              <button 
                                onClick={() => {
                                  setEditandoComentarioId(null);
                                  setComentarioEditando("");
                                }} 
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300">{coment.comentario}</p>
                        )}

                        {user && coment.autorId === user.aluno_id && editandoComentarioId !== coment.id && (
                          <div className="flex gap-3 mt-2 text-sm">
                            <button 
                              onClick={() => handleEditComentario(coment)} 
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 className="w-4 h-4" /> Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteComentario(coment.id)} 
                              className="flex items-center gap-1 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" /> Apagar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {comentarios.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Nenhum comentário ainda. Seja o primeiro!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor Info */}
              {curso.instrutor && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Instrutor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {curso.instrutor.avatar ? (
                      <img
                        src={curso.instrutor.avatar || "/placeholder.svg"}
                        alt={curso.instrutor.nome}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-brand-pink/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand-pink">
                          {curso.instrutor.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">{curso.instrutor.nome}</h4>
                      <p className="text-sm text-gray-400">Instrutor</p>
                    </div>
                  </div>
                  {curso.instrutor.bio && (
                    <p className="text-gray-300 text-sm">{curso.instrutor.bio}</p>
                  )}
                </div>
              )}

              {/* Course Info */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Informações do Curso</h3>
                <div className="space-y-3">
                  {categoria && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Categoria</span>
                      <span className="text-white">{categoria.nome}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Nível</span>
                    <span className="text-white">{curso.nivel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duração</span>
                    <span className="text-white">{curso.duracao}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Aulas</span>
                    <span className="text-white">{totalAulas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Alunos</span>
                    <span className="text-white">{curso.alunos?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        curso.status === "Livre" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {curso.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-pink">{curso.rating || "5.0"}</div>
                    <div className="text-sm text-gray-400">Avaliação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{avaliacoes.length}</div>
                    <div className="text-sm text-gray-400">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}