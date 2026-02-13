// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { apiBackend, getBlob } from '@/lib/api-backend';
import { AxiosError } from 'axios';
import type { Aluno } from '@/types/academy';

interface CertificadoResponse {
  certificado: {
    codigo_validacao: string;
    [key: string]: any;
  };
}

// Hook genérico para chamadas GET
export function useApi<T>(url: string, dependencies: any[] = []) {
  const [state, setState] = useState({
    data: null as T | null,
    loading: true,
    error: null as string | null,
  });

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiBackend.get<T>(url);

      setState({
        data: response,
        loading: false,
        error: null,
      });
    } catch (err) {
      const error = err as AxiosError;
      setState({
        data: null,
        loading: false,
        error: error.message || 'Erro ao carregar dados',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { ...state, refetch: fetchData };
}

// ==================== HOOKS DE CURSOS ====================

export function useCursos(filters?: {
  categoria?: string;
  nivel?: string;
  search?: string;
  gratuito?: boolean;
  page?: number;
  page_size?: number;
  destaque?: boolean;
}) {
  const params = filters ? { ...filters } : {};

  // Transforma objeto em string: "categoria=python&nivel=iniciante"
  const queryString = new URLSearchParams(params as Record<string, string>).toString();

  // Monta a URL final com a interrogação
  const endpoint = `/academy/cursos/${queryString ? `?${queryString}` : ''}`;

  // Passa a URL dinâmica
  return useApi<any[]>(endpoint, [queryString]);
}

export function useCurso(slug: string) {
  return useApi<any>(`/academy/cursos/${slug}/`, [slug]);
}

export function useProgresso(courseSlug: string) {
  return useApi<any>(`/academy/cursos/${courseSlug}/progresso/`, [courseSlug]);
}

// ==================== HOOKS DE CATEGORIAS ====================

export function useCategorias(params?: { page_size?: number }) {
  return useApi<any[]>(`/academy/categorias/`, [JSON.stringify(params)]);
}

export function useCategoria(slug: string) {
  return useApi<any>(`/academy/categorias/${slug}/`, [slug]);
}

// ==================== HOOKS DE TRILHAS ====================

export function useTrilhas(params?: { page_size?: number }) {
  return useApi<any[]>(`/academy/trilhas/`, [JSON.stringify(params)]);
}

export function useTrilha(slug: string) {
  return useApi<any>(`/academy/trilhas/${slug}/`, [slug]);
}

// ==================== HOOKS DE AULAS ====================

export function useAula(slug: string) {
  return useApi<any>(`/academy/aulas/${slug}/`, [slug]);
}

// ==================== HOOKS DE QUIZ ====================

export function useQuiz(id: string) {
  return useApi<any>(`/academy/quizzes/${id}/`, [id]);
}

// ==================== HOOKS DE CERTIFICADOS ====================

/**
 * Hook para buscar certificados do aluno logado
 */
export function useCertificados() {
  return useApi<any[]>('/academy/aluno/me/certificados/');
}

/**
 * Hook para validar certificado por código (público)
 */
export function useValidarCertificado(codigo: string | null) {
  return useApi<any>(
    codigo ? `/academy/certificados/validar/${codigo}/` : '',
    [codigo]
  );
}

// ==================== HOOKS DE ALUNOS ====================

/**
 * Hook para buscar métricas do aluno logado
 */
export function useMetricas() {
  return useApi<{
    cursos_iniciados: string;
    concluidos: string;
    certificados: string;
    horas_estudadas: string;
  }>('/academy/aluno/me/metricas/');
}

/**
 * Hook para buscar cursos do aluno logado (meus cursos)
 */
export function useMeusCursos() {
  return useApi<{
    resumo: {
      total_cursos: number;
      cursos_livres: number;
      cursos_premium: number;
      avaliacao_media: number;
    };
    cursos: Array<{
      id: number;
      slug: string;
      titulo: string;
      capa: string;
      tipo: 'PREMIUM' | 'LIVRE';
      progresso: {
        percentual: number;
        aulas_concluidas: number;
        total_aulas: number;
        ultima_aula: string;
        tempo_assistido: string;
      };
      avaliacao_usuario: number | null;
      privado_franqueado?: boolean;
      data_inscricao: string;
      ultima_visualizacao: string;
    }>;
  }>('/academy/aluno/me/cursos/');
}

/**
 * Hook para buscar detalhes completos de um aluno
 * @param alunoId - ID numérico do aluno (pk)
 * @param enabled - Se false, não faz a requisição (útil para requisições condicionais)
 */
export function useAlunoDetalhes(alunoId: number | null, enabled: boolean = true) {
  const [state, setState] = useState<{
    data: Aluno | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Não faz requisição se alunoId for null ou enabled for false
    if (!alunoId || !enabled) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchDetalhes = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiBackend.get<Aluno>(`/academy/aluno/${alunoId}/detalhes/`);

        setState({
          data: response,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        let errorMessage = 'Erro ao carregar detalhes do aluno';

        // Tratamento de erros específicos
        if (err.message) {
          if (err.message.includes('403')) {
            errorMessage = 'Você não tem permissão para acessar este recurso';
          } else if (err.message.includes('404')) {
            errorMessage = 'Aluno não encontrado';
          } else if (err.message.includes('401')) {
            errorMessage = 'Você precisa estar autenticado para acessar este recurso';
          } else {
            errorMessage = err.message;
          }
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchDetalhes();
  }, [alunoId, enabled]);

  return {
    ...state,
    refetch: () => {
      if (alunoId && enabled) {
        setState(prev => ({ ...prev, loading: true, error: null }));
        apiBackend.get<Aluno>(`/academy/aluno/${alunoId}/detalhes/`)
          .then(response => {
            setState({
              data: response,
              loading: false,
              error: null,
            });
          })
          .catch((err: any) => {
            let errorMessage = 'Erro ao carregar detalhes do aluno';
            if (err.message) {
              if (err.message.includes('403')) {
                errorMessage = 'Você não tem permissão para acessar este recurso';
              } else if (err.message.includes('404')) {
                errorMessage = 'Aluno não encontrado';
              } else if (err.message.includes('401')) {
                errorMessage = 'Você precisa estar autenticado para acessar este recurso';
              } else {
                errorMessage = err.message;
              }
            }
            setState({
              data: null,
              loading: false,
              error: errorMessage,
            });
          });
      }
    },
  };
}

// ==================== MUTATIONS - CURSOS ====================

export async function enrollCourse(slug: string) {
  return apiBackend.post(`/academy/cursos/${slug}/enroll/`);
}

// ==================== MUTATIONS - AULAS ====================

export async function completeLesson(slug: string) {
  return apiBackend.post(`/academy/aulas/${slug}/complete/`);
}

export async function updateLessonProgress(slug: string, tempoAssistido: number) {
  return apiBackend.post(`/academy/aulas/${slug}/update_progress/`, {
    tempo_assistido: tempoAssistido,
  });
}

// ==================== MUTATIONS - QUIZ ====================

export async function submitQuiz(id: string, respostas: Record<string, string>) {
  return apiBackend.post(`/academy/quizzes/${id}/submit/`, { respostas });
}

// ==================== MUTATIONS - AVALIAÇÕES ====================

export async function postAvaliacao(data: {
  curso: number;
  tipo: 'AVALIACAO' | 'COMENTARIO';
  nota?: number;
  comentario: string;
}) {
  return apiBackend.post('/academy/avaliacoes/', data);
}

export async function updateAvaliacao(id: number, data: {
  nota?: number;
  comentario: string;
}) {
  return apiBackend.patch(`/academy/avaliacoes/${id}/`, data);
}

export async function deleteAvaliacao(id: number) {
  return apiBackend.delete(`/academy/avaliacoes/${id}/`);
}

// ==================== MUTATIONS - MATERIAIS ====================

export async function downloadMaterial(id: string) {
  return getBlob(`/academy/materiais/${id}/download/`);
}

// ==================== MUTATIONS - CERTIFICADOS ====================

/**
 * Gera certificado para uma inscrição
 */
export async function gerarCertificado(inscricaoId: number): Promise<CertificadoResponse> {
  return apiBackend.post<CertificadoResponse>(`/academy/inscricoes/${inscricaoId}/gerar-certificado/`);
}

/**
 * Download do PDF do certificado
 */
export async function downloadCertificado(codigoValidacao: string) {
  return getBlob(`/academy/certificados/${codigoValidacao}/download/`);
}

/**
 * Validar certificado público (sem autenticação)
 */
export async function validarCertificado(codigo: string) {
  return apiBackend.get(`/academy/certificados/validar/${codigo}/`);
}