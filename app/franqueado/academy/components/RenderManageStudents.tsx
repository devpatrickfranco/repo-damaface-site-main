import { useState, FC, ReactNode, useMemo } from 'react';

// Ícones da biblioteca lucide-react
import {
  Search,
  Download,
  Eye,
  X,
  TrendingUp,
  Activity,
  Calendar,
  User,
  BookOpen,
  Award,
} from 'lucide-react';

// Importando os tipos e dados
import { Aluno, FiltrosAlunos, CursoProgresso, HistoricoAtividade } from '@/types/academy';

// --- Tipos para Filtros ---
interface CursoParaFiltro {
    id: number;
    titulo: string;
}

interface Engajamento {
    texto: 'Alto' | 'Médio' | 'Baixo';
    icon: ReactNode;
    cor: string;
    bg: string;
}



const alunosData: Aluno[] = [
  {
    usuario: {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      role: 'FUNCIONARIO',
      imgProfile: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
      franquia: 1,
      franquia_nome: 'Franquia Centro',
      aluno_id: 1
    },
    id: 'aluno-1',
    dataMatricula: '2025-01-15',
    status: 'ATIVO',
    telefone: '(11) 99999-9999',
    cursosProgresso: [
      {
        cursoId: '1',
        titulo: 'Fundamentos do Marketing Digital para Franquias',
        progresso: 100,
        dataInicio: '2025-01-20',
        dataUltimoacesso: '2025-09-24',
        dataTermino: '2025-09-20',
        status: 'Concluído',
        modulosProgresso: [
          { moduloId: '1-1', concluido: true, aulasAssistidas: ['1-1-1', '1-1-2', '1-1-3'] },
          { moduloId: '1-2', concluido: true, aulasAssistidas: ['1-2-1', '1-2-2'] }
        ],
        quiz: {
          tentativas: [
            {
              id: 't1-1',
              quizId: 'q1',
              nota: 95,
              dataRealizacao: '2025-09-20',
              respostas: [],
              tempoGasto: 15
            }
          ],
          melhorNota: 95,
          aprovado: true,
          dataUltimaRealizacao: '2025-09-20'
        }
      },
      {
        cursoId: '2',
        titulo: 'Procedimentos Operacionais Padrão (POPs)',
        progresso: 75,
        dataInicio: '2025-09-18',
        dataUltimoacesso: '2025-09-24',
        status: 'Em Andamento',
        modulosProgresso: [
          { moduloId: '2-1', concluido: true, aulasAssistidas: ['2-1-1'] }
        ],
        quiz: {
          tentativas: [
            {
              id: 't1-2a',
              quizId: 'q2',
              nota: 65,
              dataRealizacao: '2025-09-21',
              respostas: [],
              tempoGasto: 12
            },
            {
              id: 't1-2b',
              quizId: 'q2',
              nota: 75,
              dataRealizacao: '2025-09-22',
              respostas: [],
              tempoGasto: 10
            },
            {
              id: 't1-2c',
              quizId: 'q2',
              nota: 80,
              dataRealizacao: '2025-09-23',
              respostas: [],
              tempoGasto: 8
            }
          ],
          melhorNota: 80,
          aprovado: true,
          dataUltimaRealizacao: '2025-09-23'
        }
      }
    ],
    historicoAtividade: [
      { id: 'h1-1', data: '2025-09-24', tipo: 'AULA_ASSISTIDA', acao: 'Assistiu a aula "Implementação de POPs"', cursoId: '2' },
      { id: 'h1-2', data: '2025-09-23', tipo: 'QUIZ_APROVADO', acao: 'Aprovado no quiz de POPs com 80% (3ª tentativa)', cursoId: '2', nota: 80 },
      { id: 'h1-3', data: '2025-09-20', tipo: 'CURSO_CONCLUIDO', acao: 'Concluiu "Fundamentos do Marketing Digital para Franquias"', cursoId: '1' }
    ],
    certificados: [
      {
        id: 'cert-1',
        cursoId: '1',
        cursoTitulo: 'Fundamentos do Marketing Digital para Franquias',
        dataEmissao: '2025-09-20',
        notaFinal: 95,
        cargaHoraria: '4h 30min',
        codigo: 'CERT-2025-001'
      }
    ],
    preferencias: {
      notificacoes: { email: true, push: true, lembretesEstudo: true },
      idioma: 'pt-BR',
      velocidadeVideo: 1.25,
      qualidadeVideo: 'auto',
      temaDarkMode: true
    },
    estatisticas: {
      totalCursos: 2,
      cursosCompletos: 1,
      cursosEmAndamento: 1,
      totalHorasEstudadas: 12.5,
      mediaNotas: 87.5,
      streakDias: 15,
      ultimoAcesso: '2025-09-24',
      tempoMedioSessao: 45,
      diasAtivo: 28
    }
  },
  {
    usuario: {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      role: 'FRANQUEADO',
      imgProfile: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg',
      franquia: 2,
      franquia_nome: 'Franquia Norte',
      aluno_id: 2
    },
    id: 'aluno-2',
    dataMatricula: '2025-02-01',
    status: 'ATIVO',
    telefone: '(11) 88888-8888',
    cursosProgresso: [
      {
        cursoId: '1',
        titulo: 'Fundamentos do Marketing Digital para Franquias',
        progresso: 100,
        dataInicio: '2025-02-05',
        dataUltimoacesso: '2025-09-10',
        dataTermino: '2025-09-10',
        status: 'Concluído',
        modulosProgresso: [
          { moduloId: '1-1', concluido: true, aulasAssistidas: ['1-1-1', '1-1-2', '1-1-3'] },
          { moduloId: '1-2', concluido: true, aulasAssistidas: ['1-2-1', '1-2-2'] }
        ],
        quiz: {
          tentativas: [
            {
              id: 't2-1',
              quizId: 'q1',
              nota: 100,
              dataRealizacao: '2025-09-10',
              respostas: [],
              tempoGasto: 12
            }
          ],
          melhorNota: 100,
          aprovado: true,
          dataUltimaRealizacao: '2025-09-10'
        }
      },
      {
        cursoId: '3',
        titulo: 'Excelência no Atendimento ao Cliente',
        progresso: 100,
        dataInicio: '2025-09-05',
        dataUltimoacesso: '2025-09-15',
        dataTermino: '2025-09-15',
        status: 'Concluído',
        modulosProgresso: [],
        quiz: {
          tentativas: [
            {
              id: 't2-3a',
              quizId: 'q3',
              nota: 85,
              dataRealizacao: '2025-09-14',
              respostas: [],
              tempoGasto: 18
            },
            {
              id: 't2-3b',
              quizId: 'q3',
              nota: 92,
              dataRealizacao: '2025-09-15',
              respostas: [],
              tempoGasto: 14
            }
          ],
          melhorNota: 92,
          aprovado: true,
          dataUltimaRealizacao: '2025-09-15'
        }
      }
    ],
    historicoAtividade: [
      { id: 'h2-1', data: '2025-09-15', tipo: 'CURSO_CONCLUIDO', acao: 'Concluiu "Excelência no Atendimento ao Cliente"', cursoId: '3' },
      { id: 'h2-2', data: '2025-09-15', tipo: 'CERTIFICADO_EMITIDO', acao: 'Certificado emitido para "Excelência no Atendimento ao Cliente"', cursoId: '3' },
      { id: 'h2-3', data: '2025-09-10', tipo: 'QUIZ_APROVADO', acao: 'Aprovado no quiz de Marketing Digital com 100%', cursoId: '1', nota: 100 }
    ],
    certificados: [
      {
        id: 'cert-2',
        cursoId: '1',
        cursoTitulo: 'Fundamentos do Marketing Digital para Franquias',
        dataEmissao: '2025-09-10',
        notaFinal: 100,
        cargaHoraria: '4h 30min',
        codigo: 'CERT-2025-002'
      },
      {
        id: 'cert-3',
        cursoId: '3',
        cursoTitulo: 'Excelência no Atendimento ao Cliente',
        dataEmissao: '2025-09-15',
        notaFinal: 92,
        cargaHoraria: '5h 45min',
        codigo: 'CERT-2025-003'
      }
    ],
    preferencias: {
      notificacoes: { email: true, push: false, lembretesEstudo: false },
      idioma: 'pt-BR',
      velocidadeVideo: 1,
      qualidadeVideo: '1080p',
      temaDarkMode: false
    },
    estatisticas: {
      totalCursos: 2,
      cursosCompletos: 2,
      cursosEmAndamento: 0,
      totalHorasEstudadas: 18.2,
      mediaNotas: 96,
      streakDias: 5,
      ultimoAcesso: '2025-09-15',
      tempoMedioSessao: 38,
      diasAtivo: 35
    }
  },
  {
    usuario: {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@email.com',
      role: 'FUNCIONARIO',
      imgProfile: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      franquia: 1,
      franquia_nome: 'Franquia Centro',
      aluno_id: 3
    },
    id: 'aluno-3',
    dataMatricula: '2025-01-20',
    status: 'INATIVO',
    telefone: '(11) 77777-7777',
    cursosProgresso: [
      {
        cursoId: '1',
        titulo: 'Fundamentos do Marketing Digital para Franquias',
        progresso: 30,
        dataInicio: '2025-08-08',
        dataUltimoacesso: '2025-08-10',
        status: 'Em Andamento',
        modulosProgresso: [
          { moduloId: '1-1', concluido: false, aulasAssistidas: ['1-1-1'] }
        ]
      }
    ],
    historicoAtividade: [
      { id: 'h3-1', data: '2025-08-10', tipo: 'AULA_ASSISTIDA', acao: 'Assistiu a aula "O que é Marketing Digital"', cursoId: '1' },
      { id: 'h3-2', data: '2025-08-08', tipo: 'CURSO_INICIADO', acao: 'Iniciou o curso "Fundamentos do Marketing Digital para Franquias"', cursoId: '1' }
    ],
    certificados: [],
    preferencias: {
      notificacoes: { email: true, push: true, lembretesEstudo: true },
      idioma: 'pt-BR',
      velocidadeVideo: 1,
      qualidadeVideo: 'auto',
      temaDarkMode: true
    },
    estatisticas: {
      totalCursos: 1,
      cursosCompletos: 0,
      cursosEmAndamento: 1,
      totalHorasEstudadas: 2.5,
      mediaNotas: 0,
      streakDias: 0,
      ultimoAcesso: '2025-08-10',
      tempoMedioSessao: 25,
      diasAtivo: 3
    }
  }
];

// --- Funções Auxiliares ---
const calcularMediaQuizzes = (aluno: Aluno): string => {
  const quizzesCompletos = aluno.cursosProgresso.filter(curso => 
    curso.quiz && curso.quiz.melhorNota > 0
  );
  
  if (quizzesCompletos.length === 0) return 'N/A';
  
  const totalNotas = quizzesCompletos.reduce((acc, curso) => 
    acc + (curso.quiz?.melhorNota || 0), 0
  );
  
  return (totalNotas / quizzesCompletos.length).toFixed(1);
};

const calcularProgressoGeral = (aluno: Aluno): number => {
  if (aluno.cursosProgresso.length === 0) return 0;
  
  const totalProgresso = aluno.cursosProgresso.reduce((acc, curso) => 
    acc + curso.progresso, 0
  );
  
  return totalProgresso / aluno.cursosProgresso.length;
};

const getEngajamento = (ultimoAcesso: string): Engajamento => {
    const hoje = new Date();
    const dataAcesso = new Date(ultimoAcesso);
    const diffTime = Math.abs(hoje.getTime() - dataAcesso.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return { 
      texto: 'Alto', 
      icon: <TrendingUp className="w-4 h-4 text-green-400" />, 
      cor: 'text-green-400', 
      bg: 'bg-green-500/20' 
    };
    if (diffDays <= 30) return { 
      texto: 'Médio', 
      icon: <Activity className="w-4 h-4 text-yellow-400" />, 
      cor: 'text-yellow-400', 
      bg: 'bg-yellow-500/20' 
    };
    return { 
      texto: 'Baixo', 
      icon: <TrendingUp className="w-4 h-4 text-red-400 transform -scale-y-100" />, 
      cor: 'text-red-400', 
      bg: 'bg-red-500/20' 
    };
};

const RenderManageStudents: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cursoFilter, setCursoFilter] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [abaModal, setAbaModal] = useState<string>('resumo');

  const alunosFiltrados = useMemo(() => {
    return alunosData.filter((aluno: Aluno) => {
      // Filtro de busca
      const searchMatch = aluno.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          aluno.usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de curso
      const cursoMatch = cursoFilter === 'all' || 
                        aluno.cursosProgresso.some(curso => curso.cursoId === cursoFilter);

      // Filtro de performance
      const media = parseFloat(calcularMediaQuizzes(aluno));
      const performanceMatch = performanceFilter === 'all' ||
                              (performanceFilter === 'abaixo70' && !isNaN(media) && media < 70) ||
                              (performanceFilter === 'acima90' && !isNaN(media) && media >= 90);

      // Filtro de status
      const statusMatch = statusFilter === 'all' || aluno.status === statusFilter;

      return searchMatch && cursoMatch && performanceMatch && statusMatch;
    });
  }, [searchTerm, cursoFilter, performanceFilter, statusFilter]);
  
  const renderModalDetalhes = () => {
    if (!alunoSelecionado) return null;

    const mediaQuizzes = calcularMediaQuizzes(alunoSelecionado);
    const progressoGeral = calcularProgressoGeral(alunoSelecionado);
    const taxaConclusao = alunoSelecionado.estatisticas.cursosCompletos / alunoSelecionado.estatisticas.totalCursos * 100;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="flex items-start justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-4">
                        <img 
                          src={alunoSelecionado.usuario.imgProfile || '/default-avatar.png'} 
                          alt={alunoSelecionado.usuario.nome} 
                          className="w-16 h-16 rounded-full object-cover" 
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{alunoSelecionado.usuario.nome}</h2>
                            <p className="text-gray-400">{alunoSelecionado.usuario.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-sm text-gray-400">{alunoSelecionado.telefone}</p>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                alunoSelecionado.status === 'ATIVO' ? 'bg-green-500/20 text-green-400' :
                                alunoSelecionado.status === 'INATIVO' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {alunoSelecionado.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-xs text-gray-500">
                                Membro desde: {new Date(alunoSelecionado.dataMatricula).toLocaleDateString('pt-BR')}
                              </p>
                              {alunoSelecionado.usuario.franquia_nome && (
                                <p className="text-xs text-gray-500">
                                  {alunoSelecionado.usuario.franquia_nome}
                                </p>
                              )}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setAlunoSelecionado(null)} className="text-gray-400 hover:text-white"> 
                      <X className="w-6 h-6" /> 
                    </button>
                </div>
                
                <div className="flex border-b border-gray-700 px-6">
                    <button 
                      onClick={() => setAbaModal('resumo')} 
                      className={`py-4 px-4 text-sm font-medium transition-colors ${
                        abaModal === 'resumo' 
                          ? 'text-pink-400 border-b-2 border-pink-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Resumo
                    </button>
                    <button 
                      onClick={() => setAbaModal('desempenho')} 
                      className={`py-4 px-4 text-sm font-medium transition-colors ${
                        abaModal === 'desempenho' 
                          ? 'text-pink-400 border-b-2 border-pink-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Desempenho Detalhado
                    </button>
                    <button 
                      onClick={() => setAbaModal('historico')} 
                      className={`py-4 px-4 text-sm font-medium transition-colors ${
                        abaModal === 'historico' 
                          ? 'text-pink-400 border-b-2 border-pink-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Histórico
                    </button>
                    <button 
                      onClick={() => setAbaModal('certificados')} 
                      className={`py-4 px-4 text-sm font-medium transition-colors ${
                        abaModal === 'certificados' 
                          ? 'text-pink-400 border-b-2 border-pink-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Certificados ({alunoSelecionado.certificados.length})
                    </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto">
                    {abaModal === 'resumo' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-4 h-4 text-pink-400" />
                                    <p className="text-gray-400 text-sm">Média nos Quizzes</p>
                                  </div>
                                  <p className="text-xl font-bold text-white">{mediaQuizzes}{mediaQuizzes !== 'N/A' && '%'}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <p className="text-gray-400 text-sm">Taxa de Conclusão</p>
                                  </div>
                                  <p className="text-xl font-bold text-white">{taxaConclusao.toFixed(0)}%</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
                                    <p className="text-gray-400 text-sm">Cursos Matriculados</p>
                                  </div>
                                  <p className="text-xl font-bold text-white">{alunoSelecionado.estatisticas.totalCursos}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-orange-400" />
                                    <p className="text-gray-400 text-sm">Horas Estudadas</p>
                                  </div>
                                  <p className="text-xl font-bold text-white">{alunoSelecionado.estatisticas.totalHorasEstudadas}h</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Gerais</h3>
                                <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Progresso Geral:</span>
                                    <span className="text-white font-medium">{progressoGeral.toFixed(0)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Streak de Dias:</span>
                                    <span className="text-white font-medium">{alunoSelecionado.estatisticas.streakDias} dias</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Tempo Médio/Sessão:</span>
                                    <span className="text-white font-medium">{alunoSelecionado.estatisticas.tempoMedioSessao}min</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Dias Ativos:</span>
                                    <span className="text-white font-medium">{alunoSelecionado.estatisticas.diasAtivo} dias</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                  <div className="space-y-3">
                                    {alunoSelecionado.historicoAtividade.slice(0, 5).map((item: HistoricoAtividade, index: number) => (
                                      <div key={item.id} className="flex items-start gap-3">
                                        <div className="bg-gray-700 rounded-full p-2 mt-1 flex-shrink-0">
                                          <Calendar className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div>
                                          <p className="text-sm text-white">{item.acao}</p>
                                          <p className="text-xs text-gray-500">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    )}

                    {abaModal === 'desempenho' && (
                        <div className="space-y-4">
                            {alunoSelecionado.cursosProgresso.map((curso: CursoProgresso) => (
                                <div key={curso.cursoId} className="bg-gray-900/50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-bold text-white">{curso.titulo}</h4>
                                      <span className={`px-2 py-1 text-xs rounded-full ${
                                        curso.status === 'Concluído' ? 'bg-green-500/20 text-green-400' :
                                        curso.status === 'Em Andamento' ? 'bg-blue-500/20 text-blue-400' :
                                        curso.status === 'Pausado' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-500/20 text-gray-400'
                                      }`}>
                                        {curso.status}
                                      </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <p className="text-sm text-gray-400">Progresso do Curso</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                              className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                                              style={{ width: `${curso.progresso}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-pink-400 text-sm font-medium">{curso.progresso}%</span>
                                        </div>
                                      </div>

                                      {curso.quiz && (
                                        <div>
                                          <p className="text-sm text-gray-400">Performance no Quiz</p>
                                          <div className="mt-1">
                                            <p className="text-white font-semibold">
                                              Melhor nota: {curso.quiz.melhorNota}%
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {curso.quiz.tentativas.length} {curso.quiz.tentativas.length > 1 ? 'tentativas' : 'tentativa'}
                                              {curso.quiz.aprovado ? ' • Aprovado' : ' • Reprovado'}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="text-sm text-gray-400">
                                      <div className="flex items-center gap-4">
                                        <span>Início: {new Date(curso.dataInicio).toLocaleDateString('pt-BR')}</span>
                                        {curso.dataUltimoacesso && (
                                          <span>Último acesso: {new Date(curso.dataUltimoacesso).toLocaleDateString('pt-BR')}</span>
                                        )}
                                        {curso.dataTermino && (
                                          <span>Concluído: {new Date(curso.dataTermino).toLocaleDateString('pt-BR')}</span>
                                        )}
                                      </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {abaModal === 'historico' && (
                        <div>
                          <ul className="space-y-3">
                              {alunoSelecionado.historicoAtividade.map((item: HistoricoAtividade) => (
                                  <li key={item.id} className="flex items-start gap-3">
                                      <div className={`rounded-full p-2 mt-1 flex-shrink-0 ${
                                        item.tipo === 'CURSO_CONCLUIDO' ? 'bg-green-500/20' :
                                        item.tipo === 'QUIZ_APROVADO' ? 'bg-blue-500/20' :
                                        item.tipo === 'CERTIFICADO_EMITIDO' ? 'bg-yellow-500/20' :
                                        'bg-gray-700'
                                      }`}>
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                      </div>
                                      <div>
                                          <p className="text-sm text-white">{item.acao}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-gray-500">
                                              {new Date(item.data).toLocaleDateString('pt-BR')}
                                            </p>
                                            {item.nota && (
                                              <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                                Nota: {item.nota}%
                                              </span>
                                            )}
                                          </div>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                        </div>
                    )}

                    {abaModal === 'certificados' && (
                        <div className="space-y-4">
                          {alunoSelecionado.certificados.length > 0 ? (
                            alunoSelecionado.certificados.map((certificado) => (
                              <div key={certificado.id} className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-yellow-500">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-bold text-white">{certificado.cursoTitulo}</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-400">
                                      <p>Nota Final: <span className="text-white font-medium">{certificado.notaFinal}%</span></p>
                                      <p>Carga Horária: <span className="text-white">{certificado.cargaHoraria}</span></p>
                                      <p>Código: <span className="text-white font-mono">{certificado.codigo}</span></p>
                                      <p>Emitido em: <span className="text-white">{new Date(certificado.dataEmissao).toLocaleDateString('pt-BR')}</span></p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors">
                                      Download
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Award className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                              <p>Nenhum certificado emitido ainda.</p>
                              <p className="text-xs">Complete os cursos para receber os certificados.</p>
                            </div>
                          )}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-end p-4 border-t border-gray-700 mt-auto">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"> 
                      <Download className="w-4 h-4" /> 
                      <span>Exportar Relatório</span> 
                    </button>
                </div>
            </div>
        </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gerenciar Alunos</h1>
          <p className="text-gray-400">Acompanhe o progresso e desempenho dos alunos</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {alunosFiltrados.length} {alunosFiltrados.length === 1 ? 'aluno' : 'alunos'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar alunos..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
          />
        </div>
        

        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)} 
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
        >
          <option value="all">Todos os status</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
          <option value="SUSPENSO">Suspensos</option>
        </select>
        
        <select 
          value={performanceFilter} 
          onChange={e => setPerformanceFilter(e.target.value)} 
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
        >
          <option value="all">Toda a performance</option>
          <option value="acima90">Média acima de 90%</option>
          <option value="abaixo70">Média abaixo de 70%</option>
        </select>
      </div>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Franquia</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Engajamento</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progresso</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Média</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {alunosFiltrados.length > 0 && alunosFiltrados.map((aluno: Aluno) => {
                const engajamento = getEngajamento(aluno.estatisticas.ultimoAcesso);
                const mediaQuizzes = calcularMediaQuizzes(aluno);
                const progressoGeral = calcularProgressoGeral(aluno);

                return (
                  <tr key={aluno.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={aluno.usuario.imgProfile || '/default-avatar.png'} 
                          alt={aluno.usuario.nome} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{aluno.usuario.nome}</div>
                          <div className="text-sm text-gray-400">{aluno.usuario.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{aluno.usuario.franquia_nome || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        aluno.status === 'ATIVO' ? 'bg-green-500/20 text-green-400' :
                        aluno.status === 'INATIVO' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${engajamento.bg}`}>
                        {engajamento.icon}
                        <span className={engajamento.cor}>{engajamento.texto}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                           <div 
                             className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                             style={{ width: `${progressoGeral}%` }}
                           ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{progressoGeral.toFixed(0)}%</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        {mediaQuizzes}{mediaQuizzes !== 'N/A' && '%'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => { 
                          setAlunoSelecionado(aluno); 
                          setAbaModal('resumo'); 
                        }} 
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-500/10 transition-colors"
                        title="Ver detalhes do aluno"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {alunosFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>Nenhum aluno encontrado.</p>
              <p className="text-xs mt-1">Tente ajustar os filtros ou o termo de busca.</p>
            </div>
          )}
        </div>
      </div>
      {renderModalDetalhes()}
    </div>
  );
}

export default RenderManageStudents;