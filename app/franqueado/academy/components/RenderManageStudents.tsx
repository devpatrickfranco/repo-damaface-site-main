import { useState, FC, ReactNode, useMemo, useEffect, useCallback } from 'react';

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
  Loader2,
} from 'lucide-react';

// Importando os tipos e dados
import { Aluno, FiltrosAlunos, CursoProgresso, HistoricoAtividade } from '@/types/academy';
import { useAlunoDetalhes, downloadCertificado } from '@/hooks/useApi';
import { apiBackend } from '@/lib/api-backend';
import { gerarPDFRelatorio } from '@/lib/utils';

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



// Interface para a resposta da API de listagem de alunos (apenas dados básicos)
interface AlunoBasico {
  usuario: {
    id: number;
    nome: string;
    email: string;
    role: string;
    imgProfile: string | null;
    franquia: number | null;
    franquia_nome: string | null;
    aluno_id: number;
  };
  id: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  engajamento: 'Alto' | 'Médio' | 'Baixo';
  progressoGeral: number;
  mediaNotas: string | number;
  dataMatricula?: string;
  telefone?: string | null;
  // Estatísticas básicas para exibição na lista (opcional, para compatibilidade)
  estatisticas?: {
    totalCursos: number;
    cursosCompletos: number;
    cursosEmAndamento: number;
    totalHorasEstudadas: number;
    mediaNotas: number;
    streakDias: number;
    ultimoAcesso: string;
    tempoMedioSessao: number;
    diasAtivo: number;
  };
}

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

const getEngajamentoFromString = (engajamento: 'Alto' | 'Médio' | 'Baixo'): Engajamento => {
    if (engajamento === 'Alto') return { 
      texto: 'Alto', 
      icon: <TrendingUp className="w-4 h-4 text-green-400" />, 
      cor: 'text-green-400', 
      bg: 'bg-green-500/20' 
    };
    if (engajamento === 'Médio') return { 
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
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<number | null>(null);
  const [abaModal, setAbaModal] = useState<string>('resumo');
  const [exportandoRelatorio, setExportandoRelatorio] = useState<boolean>(false);
  const [baixandoCertificado, setBaixandoCertificado] = useState<string | null>(null);
  
  // Estados para lista de alunos
  const [alunosLista, setAlunosLista] = useState<AlunoBasico[]>([]);
  const [loadingLista, setLoadingLista] = useState<boolean>(true);
  const [errorLista, setErrorLista] = useState<string | null>(null);
  
  // Hook para buscar detalhes do aluno selecionado
  const { data: alunoSelecionado, loading: loadingDetalhes, error: errorDetalhes } = useAlunoDetalhes(
    alunoSelecionadoId,
    alunoSelecionadoId !== null
  );
  
  // Buscar lista de alunos
  const fetchAlunos = useCallback(async () => {
    setLoadingLista(true);
    setErrorLista(null);
    
    try {
      // Tentar buscar de diferentes endpoints possíveis
      let response: AlunoBasico[] = [];
      
      try {
        // Tentar endpoint específico de alunos
        response = await apiBackend.get<AlunoBasico[]>('/academy/alunos/detalhes');
      } catch (err1) {
        try {
          // Se falhar, tentar buscar usuários e filtrar os que são alunos
          const usuarios = await apiBackend.get<any[]>('/users/usuarios/');
          // Filtrar apenas usuários que têm aluno_id
          response = usuarios
            .filter((u: any) => u.aluno_id !== null && u.aluno_id !== undefined)
            .map((u: any) => ({
              usuario: {
                id: u.id,
                nome: u.nome || u.email,
                email: u.email,
                role: u.role,
                imgProfile: u.imgProfile || null,
                franquia: u.franquia || null,
                franquia_nome: u.franquia_nome || null,
                aluno_id: u.aluno_id,
              },
              id: `aluno-${u.aluno_id}`,
              status: u.is_active ? 'ATIVO' : 'INATIVO',
              engajamento: u.engajamento || 'Baixo',
              progressoGeral: u.progressoGeral || 0,
              mediaNotas: u.mediaNotas || 'N/A',
              dataMatricula: u.data_criacao || new Date().toISOString().split('T')[0],
              telefone: u.telefone || null,
            }));
        } catch (err2) {
          throw new Error('Não foi possível carregar a lista de alunos');
        }
      }
      
      setAlunosLista(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setErrorLista(err.message || 'Erro ao carregar lista de alunos');
      setAlunosLista([]);
    } finally {
      setLoadingLista(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  // Função auxiliar para formatar média de notas da API
  const formatarMediaNotas = (mediaNotas: string | number): string => {
    if (typeof mediaNotas === 'string' && mediaNotas === 'N/A') {
      return 'N/A';
    }
    if (typeof mediaNotas === 'number') {
      return mediaNotas.toFixed(1);
    }
    return String(mediaNotas);
  };
  
  const alunosFiltrados = useMemo(() => {
    return alunosLista.filter((aluno: AlunoBasico) => {
      // Filtro de busca
      const searchMatch = aluno.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          aluno.usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de performance (baseado em mediaNotas da API)
      const media = typeof aluno.mediaNotas === 'number' ? aluno.mediaNotas : 
                    (typeof aluno.mediaNotas === 'string' && aluno.mediaNotas !== 'N/A' ? parseFloat(aluno.mediaNotas) : NaN);
      const performanceMatch = performanceFilter === 'all' ||
                              (performanceFilter === 'abaixo70' && !isNaN(media) && media < 70) ||
                              (performanceFilter === 'acima90' && !isNaN(media) && media >= 90);

      // Filtro de status
      const statusMatch = statusFilter === 'all' || aluno.status === statusFilter;

      return searchMatch && performanceMatch && statusMatch;
    });
  }, [searchTerm, cursoFilter, performanceFilter, statusFilter, alunosLista]);
  
  const renderModalDetalhes = () => {
    if (!alunoSelecionadoId) return null;
    
    // Mostrar loading enquanto busca detalhes
    if (loadingDetalhes) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
            <p className="text-white">Carregando detalhes do aluno...</p>
          </div>
        </div>
      );
    }
    
    // Mostrar erro se houver
    if (errorDetalhes) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 flex flex-col items-center gap-4 max-w-md">
            <p className="text-red-400 text-center">{errorDetalhes}</p>
            <button
              onClick={() => setAlunoSelecionadoId(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      );  
    }
    
    // Se não houver dados ainda, não renderizar
    if (!alunoSelecionado) return null;

    const mediaQuizzes = calcularMediaQuizzes(alunoSelecionado);
    const progressoGeral = calcularProgressoGeral(alunoSelecionado);
    const taxaConclusao = alunoSelecionado.estatisticas.totalCursos > 0 
      ? (alunoSelecionado.estatisticas.cursosCompletos / alunoSelecionado.estatisticas.totalCursos) * 100 
      : 0;
    
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
                              {alunoSelecionado.dataMatricula && (
                                <p className="text-xs text-gray-500">
                                  Membro desde: {new Date(alunoSelecionado.dataMatricula).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                {alunoSelecionado.usuario.franquia_nome || 'Franqueadora'}
                              </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setAlunoSelecionadoId(null)} className="text-gray-400 hover:text-white"> 
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
                                    <button 
                                      onClick={async () => {
                                        try {
                                          setBaixandoCertificado(certificado.codigo);
                                          
                                          // Faz o download do PDF usando o código de validação
                                          const blobResponse = await downloadCertificado(certificado.codigo);
                                          
                                          // Cria um link temporário para download
                                          const blob = new Blob([blobResponse], { type: 'application/pdf' });
                                          const url = window.URL.createObjectURL(blob);
                                          const link = document.createElement('a');
                                          link.href = url;
                                          link.download = `certificado-${certificado.cursoTitulo.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                          window.URL.revokeObjectURL(url);
                                          
                                          alert("Certificado baixado com sucesso!");
                                        } catch (error: any) {
                                          console.error("Erro ao baixar certificado:", error);
                                          const errorMessage = error.response?.data?.error || 
                                                              error.response?.data?.detail || 
                                                              "Erro ao baixar certificado. Tente novamente.";
                                          alert(errorMessage);
                                        } finally {
                                          setBaixandoCertificado(null);
                                        }
                                      }}
                                      disabled={baixandoCertificado === certificado.codigo}
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                      {baixandoCertificado === certificado.codigo ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          <span>Baixando...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Download className="w-4 h-4" />
                                          <span>Download</span>
                                        </>
                                      )}
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
                    <button 
                      onClick={async () => {
                        if (!alunoSelecionado) return;
                        
                        try {
                          setExportandoRelatorio(true);
                          await gerarPDFRelatorio(alunoSelecionado);
                        } catch (error: any) {
                          console.error('Erro ao exportar relatório:', error);
                          alert('Erro ao exportar relatório. Tente novamente.');
                        } finally {
                          setExportandoRelatorio(false);
                        }
                      }}
                      disabled={!alunoSelecionado || exportandoRelatorio}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    > 
                      {exportandoRelatorio ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Gerando PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" /> 
                          <span>Exportar Relatório</span>
                        </>
                      )}
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
              {loadingLista ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Carregando alunos...</span>
                    </div>
                  </td>
                </tr>
              ) : errorLista ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-red-400">
                      <p>{errorLista}</p>
                      <button
                        onClick={fetchAlunos}
                        className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  </td>
                </tr>
              ) : alunosFiltrados.length > 0 ? alunosFiltrados.map((aluno: AlunoBasico) => {
                const engajamento = getEngajamentoFromString(aluno.engajamento);
                const mediaQuizzes = formatarMediaNotas(aluno.mediaNotas);
                const progressoGeral = aluno.progressoGeral;

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
                      <div className="text-sm text-gray-300">{aluno.usuario.franquia_nome || 'Franqueadora'}</div>
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
                          setAlunoSelecionadoId(aluno.usuario.aluno_id); 
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
              }) : null}
            </tbody>
          </table>
          {!loadingLista && !errorLista && alunosFiltrados.length === 0 && (
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