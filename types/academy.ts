// types/academy.ts
import type { Usuario } from './users'

export interface materiais {
  id: number;
  titulo: string;
  tipo: "pdf" | "link" | "video";
  url?: string;
  arquivoFile?: File;
  arquivo: string;
}
export interface Aula {
  id: string;
  titulo: string;
  slug: string;
  duracao: string;
  concluida: boolean;
  video_id?: string;
  materiais?: materiais[];
  progresso?: Progresso;
}

export interface Modulo {
  id: string;
  titulo: string;
  aulas: Aula[];
}

export interface OpcaoQuiz {
  id: string;
  texto: string;
  correta?: boolean;
}

export interface PerguntaQuiz {
  id: string;
  texto: string;
  opcoes: OpcaoQuiz[];
  respostaCorretaId: string;
}

export interface Quiz {
  id: string; 
  titulo: string;
  concluido: boolean;
  nota?: number;
  perguntas: PerguntaQuiz[];
} 


export interface AvaliacaoAluno {
  id: number;
  autorId: number;
  aluno: string;
  avatar: string;
  rating: number;
  comentario: string;
  data: string;
}

export interface Progresso {
    concluida: boolean;
    tempo_assistido: number;
    ultima_posicao: number;
    progresso_percentual: number;
}

export interface Curso {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  instrutor: {
    nome: string;
    avatar: string;
    bio: string;
  };
  categoria: Categoria | null;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  duracao: string;
  aulas: number;
  alunos: number;
  rating: number;
  avaliacoes: number;
  capa: string;
  status: "Livre" | "Pago";
  preco?: number;
  progresso?: Progresso; // Adjusted to reflect the expected structure
  destaque?: boolean;
  modulos: Modulo[];
  avaliacoesAlunos: AvaliacaoAluno[];
  materiais?: materiais[];
  quizzes?: Quiz;  
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  icon: string;
  cor: string;
}

export interface Trilha {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  cursos: Curso[];
  progresso: number;
  tempoTotal: string; // Ensure the property name matches the code
  certificacao?: boolean;
  icon: string;
  cor: string;
}

// --- Novos tipos específicos para Academy/Aluno ---

/**
 * Representa uma tentativa de quiz realizada pelo aluno
 */
export interface TentativaQuiz {
  id: string;
  quizId: string;
  nota: number;
  dataRealizacao: string;
  respostas: {
    perguntaId: string;
    opcaoSelecionadaId: string;
    correta: boolean;
  }[];
  tempoGasto?: number; // em minutos
}

/**
 * Representa o progresso de um aluno em um curso específico
 */
export interface CursoProgresso {
  cursoId: string;
  titulo: string;
  progresso: number; // 0-100
  dataInicio: string;
  dataUltimoacesso?: string;
  dataTermino?: string; // quando progresso = 100
  status: 'Não Iniciado' | 'Em Andamento' | 'Concluído' | 'Pausado';
  
  // Progresso por módulo/aula
  modulosProgresso: {
    moduloId: string;
    concluido: boolean;
    aulasAssistidas: string[]; // IDs das aulas assistidas
  }[];

  // Quiz do curso
  quiz?: {
    tentativas: TentativaQuiz[];
    melhorNota: number;
    aprovado: boolean; // se passou da nota mínima
    dataUltimaRealizacao?: string;
  };
}

/**
 * Item do histórico de atividades do aluno
 */
export interface HistoricoAtividade {
  id: string;
  data: string;
  tipo: 'CURSO_INICIADO' | 'AULA_ASSISTIDA' | 'MODULO_CONCLUIDO' | 'CURSO_CONCLUIDO' | 
        'QUIZ_REALIZADO' | 'QUIZ_APROVADO' | 'CERTIFICADO_EMITIDO';
  acao: string; // Descrição da ação realizada
  cursoId?: string;
  aulaId?: string;
  quizId?: string;
  nota?: number; // Para quando for quiz
}

/**
 * Certificado emitido para o aluno
 */
export interface Certificado {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  dataEmissao: string;
  notaFinal: number;
  cargaHoraria: string;
  codigo: string; // Código único para validação
  urlPdf?: string;
}

/**
 * Preferências de aprendizado do aluno
 */
export interface PreferenciasAluno {
  notificacoes: {
    email: boolean;
    push: boolean;
    lembretesEstudo: boolean;
  };
  idioma: 'pt-BR' | 'en' | 'es';
  velocidadeVideo: number; // 0.5, 1, 1.25, 1.5, 2
  qualidadeVideo: 'auto' | '720p' | '1080p';
  temaDarkMode: boolean;
}

/**
 * Estatísticas de aprendizado do aluno
 */
export interface EstatisticasAluno {
  totalCursos: number;
  cursosCompletos: number;
  cursosEmAndamento: number;
  totalHorasEstudadas: number;
  mediaNotas: number;
  streakDias: number; // Dias consecutivos estudando
  ultimoAcesso: string;
  tempoMedioSessao: number; // em minutos
  diasAtivo: number; // Total de dias que acessou a plataforma
}

/**
 * Aluno - extende Usuario com informações específicas da academy
 */
export interface Aluno {
  // Informações básicas do usuário (relacionamento)
  usuario: Usuario;
  
  // Informações específicas da academy
  id: string; // ID específico do aluno na academy (pode ser diferente do Usuario.id)
  dataMatricula: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  telefone?: string;
  
  // Progresso e cursos
  cursosProgresso: CursoProgresso[];
  historicoAtividade: HistoricoAtividade[];
  certificados: Certificado[];
  
  // Configurações e preferências
  preferencias: PreferenciasAluno;
  
  // Estatísticas calculadas
  estatisticas: EstatisticasAluno;
  
  // Campos calculados (não armazenados no DB)
  engajamento?: 'Alto' | 'Médio' | 'Baixo';
  progressoGeral?: number; // 0-100
  mediaQuizzes?: number;
  taxaConclusao?: number;
}

// --- Tipos para filtros e listagens ---

export interface FiltrosAlunos {
  busca?: string;
  cursoId?: string;
  status?: Aluno['status'];
  engajamento?: Aluno['engajamento'];
  franquiaId?: number;
  dataMatriculaInicio?: string;
  dataMatriculaFim?: string;
  mediaNotaMin?: number;
  mediaNotaMax?: number;
}

export interface ListagemAlunos {
  alunos: Aluno[];
  total: number;
  pagina: number;
  totalPaginas: number;
  filtros?: FiltrosAlunos;
}

// --- Tipos para relatórios ---

export interface RelatorioAluno {
  aluno: Aluno;
  periodo: {
    inicio: string;
    fim: string;
  };
  metricas: {
    horasEstudadas: number;
    cursosCompletos: number;
    quizzesRealizados: number;
    mediaGeral: number;
    certificadosObtidos: number;
  };
  atividades: HistoricoAtividade[];
}