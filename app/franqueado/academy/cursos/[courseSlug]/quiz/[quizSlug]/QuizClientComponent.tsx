"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Check, X, Lock, Award, RotateCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCurso, useQuiz, submitQuiz } from "@/hooks/useApi";

interface Opcao {
  id: number;
  texto: string;
  correta: boolean;
}

interface Pergunta {
  id: number;
  texto: string;
  tipo: string;
  ordem: number;
  opcoes: Opcao[];
}

interface QuizData {
  id: number;
  titulo: string;
  descricao: string;
  nota_minima: string;
  tentativas_maximas: number;
  perguntas: Pergunta[];
}

interface QuizClientComponentProps {
  params: { courseSlug: string; quizSlug: string };
}

export default function QuizClientComponent({ params }: QuizClientComponentProps) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Buscar dados do curso e quiz via API
  const { data: curso, loading: cursoLoading, error: cursoError } = useCurso(params.courseSlug);
  const { data: quiz, loading: quizLoading, error: quizError } = useQuiz(params.quizSlug);

  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState<{ [key: number]: number }>({});
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correta" | "incorreta" | null>(null);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [enviandoQuiz, setEnviandoQuiz] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/franqueado");
    }
  }, [isAuthenticated, authLoading, router]);

  // Loading state
  if (authLoading || cursoLoading || quizLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Error handling
  if (cursoError || quizError || !curso || !quiz) {
    console.error("Erro ao carregar dados:", { cursoError, quizError, curso, quiz });
    return notFound();
  }

  // Verificar se o quiz pertence ao curso (convertendo para string para comparação)
  if (String(quiz.id) !== params.quizSlug) {
    console.error("Quiz ID não corresponde:", quiz.id, params.quizSlug);
    return notFound();
  }

  // Verifica se todas as aulas foram concluídas
  const todasAulas = curso.modulos?.flatMap((m: any) => m.aulas) ?? [];
  const aulasConcluidas = todasAulas.filter((a: any) => a.progresso?.concluida).length;
  const cursoConcluido = todasAulas.length > 0 && aulasConcluidas === todasAulas.length;

  if (!cursoConcluido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-8">
        <Lock className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Quiz Bloqueado</h1>
        <p className="text-lg text-gray-300 max-w-md mb-8">
          Você precisa concluir todas as aulas do curso "{curso.titulo}" antes de iniciar a avaliação.
        </p>
        <Link 
          href={`/franqueado/academy/cursos/${params.courseSlug}/${todasAulas[0]?.slug || ''}`}
          className="bg-brand-pink text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-pink/90 transition-colors"
        >
          Voltar para o curso
        </Link>
      </div>
    );
  }

  const perguntaAtual = quiz.perguntas[perguntaAtualIndex];
  const progresso = ((perguntaAtualIndex + 1) / quiz.perguntas.length) * 100;

  // Encontra a resposta correta da pergunta atual
  const respostaCorreta = perguntaAtual.opcoes.find((op: Opcao) => op.correta);

  const handleSelecionarResposta = (opcaoId: number) => {
    setRespostaSelecionada(opcaoId);
  };

  const handleConfirmarResposta = () => {
    if (!respostaSelecionada) return;

    const correta = respostaSelecionada === respostaCorreta?.id;
    setFeedback(correta ? "correta" : "incorreta");
    setRespostasUsuario(prev => ({ ...prev, [perguntaAtual.id]: respostaSelecionada }));
  };

  const finalizarQuiz = async () => {
    setEnviandoQuiz(true);
    
    try {
      // Converter respostas para o formato esperado pela API
      // Formato: { respostas: { "perguntaId": "opcaoId", "perguntaId": "opcaoId" } }
      const respostasFormatadas: Record<string, string> = {};
      Object.entries(respostasUsuario).forEach(([perguntaId, opcaoId]) => {
        respostasFormatadas[String(perguntaId)] = String(opcaoId);
      });
      
      // Enviar respostas para a API
      // A função submitQuiz já envia no formato: { respostas: respostasFormatadas }
      const response = await submitQuiz(String(quiz.id), respostasFormatadas);
      
      // A API deve retornar a nota calculada
      const nota = Number(response.nota) || 0;
      setPontuacao(nota);
      setQuizFinalizado(true);
    } catch (error) {
      console.error("Erro ao enviar quiz:", error);
      
      // Fallback: calcular nota localmente se a API falhar
      let acertos = 0;
      quiz.perguntas.forEach((p: Pergunta) => {
        const respostaCorretaDaPergunta = p.opcoes.find(op => op.correta);
        if (respostasUsuario[p.id] === respostaCorretaDaPergunta?.id) {
          acertos++;
        }
      });
      const nota = (acertos / quiz.perguntas.length) * 100;
      setPontuacao(nota);
      setQuizFinalizado(true);
    } finally {
      setEnviandoQuiz(false);
    }
  };

  const handleAvancar = () => {
    setFeedback(null);
    setRespostaSelecionada(null);
    if (perguntaAtualIndex < quiz.perguntas.length - 1) {
      setPerguntaAtualIndex(perguntaAtualIndex + 1);
    } else {
      finalizarQuiz();
    }
  };

  const handleTentarNovamente = () => {
    setPerguntaAtualIndex(0);
    setRespostasUsuario({});
    setRespostaSelecionada(null);
    setFeedback(null);
    setQuizFinalizado(false);
    setPontuacao(0);
  };

  // Tela de Quiz Finalizado
  if (quizFinalizado) {
    const notaMinima = parseFloat(quiz.nota_minima);
    const pontuacaoNumero = Number(pontuacao) || 0;
    const aprovado = pontuacaoNumero >= notaMinima;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-8">
        <Award className={`w-24 h-24 mb-6 ${aprovado ? 'text-green-400' : 'text-red-400'}`} />
        <h1 className="text-4xl font-bold mb-4">Quiz Finalizado!</h1>
        <p className="text-xl mb-2">Sua pontuação final:</p>
        <p className={`text-6xl font-bold mb-8 ${aprovado ? 'text-green-400' : 'text-red-400'}`}>
          {pontuacaoNumero.toFixed(0)}%
        </p>
        {aprovado ? (
          <p className="text-lg text-gray-300 max-w-md">
            Parabéns! Você foi aprovado e concluiu o curso com sucesso.
          </p>
        ) : (
          <p className="text-lg text-gray-300 max-w-md">
            Você não atingiu a nota mínima de {notaMinima}%. Estude mais um pouco e tente novamente.
          </p>
        )}
        <div className="mt-10 flex gap-4">
          <Link 
            href={`/franqueado/academy/cursos/${curso.slug}`} 
            className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            Voltar ao curso
          </Link>
          {!aprovado && (
            <button 
              onClick={handleTentarNovamente} 
              className="bg-brand-pink text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-pink/90 flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header com barra de progresso */}
      <div className="w-full p-4 border-b border-white/10">
        <div className="w-full max-w-4xl mx-auto">
          <p className="text-brand-pink font-semibold text-sm">{quiz.titulo}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-brand-pink h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progresso}%` }}
              />
            </div>
            <span className="text-sm font-semibold">
              {perguntaAtualIndex + 1}/{quiz.perguntas.length}
            </span>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do Quiz */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {perguntaAtual.texto}
          </h2>
          <div className="space-y-4">
            {perguntaAtual.opcoes.map((opcao: Opcao) => {
              const isSelected = respostaSelecionada === opcao.id;
              const isCorrect = opcao.correta;
              
              let optionClass = "border-gray-700 bg-gray-800 hover:border-brand-pink";
              if (isSelected && !feedback) {
                optionClass = "border-brand-pink bg-brand-pink/10";
              } else if (feedback && isSelected && !isCorrect) {
                optionClass = "border-red-500 bg-red-500/20 text-red-300";
              } else if (feedback && isCorrect) {
                optionClass = "border-green-500 bg-green-500/20 text-green-300";
              }
              
              return (
                <button
                  key={opcao.id}
                  onClick={() => handleSelecionarResposta(opcao.id)}
                  disabled={!!feedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between text-lg ${optionClass} disabled:cursor-not-allowed`}
                >
                  <span>{opcao.texto}</span>
                  {feedback && isCorrect && <Check className="text-green-400" />}
                  {isSelected && !isCorrect && feedback && <X className="text-red-400" />}
                </button>
              );
            })}
          </div>
          <div className="mt-10 h-14 flex justify-end items-center">
            {!feedback ? (
              <button 
                onClick={handleConfirmarResposta} 
                disabled={!respostaSelecionada}
                className="bg-brand-pink text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-pink/90 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button 
                onClick={handleAvancar}
                disabled={enviandoQuiz}
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 animate-pulse disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {enviandoQuiz ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  perguntaAtualIndex < quiz.perguntas.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}