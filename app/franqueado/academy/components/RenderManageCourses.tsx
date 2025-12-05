"use client"

import { useState } from "react";
import { Plus, X, Save, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { useCursos, useCategorias /*, useTrilhas */ } from "@/hooks/useApi";
import { useCourseWizard } from '@/hooks/useCourseWizard';

import { apiBackend } from "@/lib/api-backend";
import type { Curso, Categoria /*, Trilha */ } from "@/types/academy";

import Stats from "@/app/franqueado/academy/components/RenderManageCourses/Stats";
import CategoryManage from "@/app/franqueado/academy/components/RenderManageCourses/CategoryManage";
// import TrilhaManage from "./RenderManageCourses/TrailManage";
import CourseView from "@/app/franqueado/academy/components/RenderManageCourses/CourseView";
import Step1 from "./CreateCourseWizard/Step1";
import Step2 from "./CreateCourseWizard/Step2";
import Step3 from "./CreateCourseWizard/Step3";

export default function RenderManageCourses() {
  const { 
    data: cursosData, 
    loading: loadingCursos, 
    error: errorCursos, 
    refetch: refetchCursos 
  } = useCursos({ page_size: 100 });
  
  const { 
    data: categoriasData, 
    loading: loadingCategorias, 
    error: errorCategorias,
    refetch: refetchCategorias
  } = useCategorias({ page_size: 100 });

  // TODO: Trilhas de Formação - Comentado temporariamente
  // const { 
  //   data: trilhasData, 
  //   loading: loadingTrilhas, 
  //   error: errorTrilhas,
  //   refetch: refetchTrilhas
  // } = useTrilhas({ page_size: 100 });

  // Ajuste para extrair os resultados dos dados retornados pelos hooks
  const cursos = cursosData || [];
  const categorias = categoriasData || [];
  // const trilhas = trilhasData || [];

  const loading = loadingCursos || loadingCategorias; // || loadingTrilhas;
  const error = errorCursos || errorCategorias; // || errorTrilhas;

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "livre" | "pago">("all");
  
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullCourseData, setFullCourseData] = useState<Curso | null>(null);
  const [loadingFullCourse, setLoadingFullCourse] = useState(false);
  const [errorFullCourse, setErrorFullCourse] = useState<string | null>(null);
  
  // Buscar dados completos do curso quando estiver em modo de edição
  const fetchFullCourse = async (slug: string) => {
    if (!slug) return;
    setLoadingFullCourse(true);
    setErrorFullCourse(null);
    try {
      const data = await apiBackend.get<any>(`/academy/cursos/${slug}/`);
      
      // Se o curso tiver quizzes, buscar os dados completos do quiz
      if (data.quizzes && Array.isArray(data.quizzes) && data.quizzes.length > 0) {
        const quizId = data.quizzes[0].id;
        try {
          const quizData = await apiBackend.get<any>(`/academy/quizzes/${quizId}/`);
          
          // Transformar as perguntas para o formato esperado pelo wizard
          const perguntasFormatadas = (quizData.perguntas || []).map((pergunta: any) => {
            // Encontrar a opção correta
            const opcaoCorreta = pergunta.opcoes?.find((op: any) => op.correta === true);
            
            return {
              id: String(pergunta.id), // Preserva o ID da pergunta
              texto: pergunta.texto,
              opcoes: (pergunta.opcoes || []).map((opcao: any) => ({
                id: String(opcao.id), // Preserva o ID da opção
                texto: opcao.texto,
                correta: opcao.correta || false
              })),
              respostaCorretaId: opcaoCorreta ? String(opcaoCorreta.id) : ""
            };
          });
          
          // Mesclar os dados completos do quiz no objeto do curso
          data.quizzes = {
            id: String(quizData.id),
            titulo: quizData.titulo,
            descricao: quizData.descricao || "Avaliação do curso",
            nota_minima: quizData.nota_minima || "70.00",
            tentativas_maximas: quizData.tentativas_maximas || 3,
            perguntas: perguntasFormatadas
          };
          
          // Armazenar quizId no objeto do curso para uso posterior
          data.quizId = quizData.id;
        } catch (quizErr: any) {
          console.warn("Erro ao buscar quiz completo:", quizErr);
          // Continua mesmo se não conseguir buscar o quiz
        }
      }
      
      setFullCourseData(data as Curso);
    } catch (err: any) {
      setErrorFullCourse(err.message || "Erro ao carregar curso");
      console.error("Erro ao buscar curso completo:", err);
    } finally {
      setLoadingFullCourse(false);
    }
  };
  
  const selectedCourse = modalMode === "edit" && fullCourseData ? fullCourseData : null;
  const wizard = useCourseWizard(selectedCourse);

  const handleDeleteQuiz = async () => {
    if (!wizard.quizId) {
      alert("Não há quiz para deletar.");
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar o quiz "${wizard.quizTitle}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await apiBackend.delete(`/academy/quizzes/${wizard.quizId}/`);
      alert("Quiz deletado com sucesso!");
      // Recarregar dados do curso para atualizar estado
      if (selectedCourseSlug) {
        await fetchFullCourse(selectedCourseSlug);
      }
    } catch (err: any) {
      console.error("Erro ao deletar quiz:", err);
      alert(err.response?.data?.message || "Erro ao deletar quiz. Veja o console para mais detalhes.");
    }
  };
  
  // Adicionar handleDeleteQuiz ao wizard object para passar ao Step2
  const wizardWithDelete = {
    ...wizard,
    handleDeleteQuiz,
  };

  const refetchAllData = () => {
    refetchCursos();
    refetchCategorias();
    // refetchTrilhas();
  };

  const openCreateModal = () => {
    setSelectedCourseSlug(null);
    wizard.resetWizard();
    setModalMode("create");
  };

  const openEditModal = async (curso: Curso) => {
    if (!curso.slug) {
      alert("Erro: curso não possui slug válido.");
      return;
    }
    setSelectedCourseSlug(curso.slug);
    setModalMode("edit");
    setFullCourseData(null); // Limpar dados anteriores
    await fetchFullCourse(curso.slug);
  };
  
  const handleSubmit = async () => {
    // ======= VALIDAÇÕES =======
    if (!wizard.formData.titulo || !wizard.formData.categoriaId || !wizard.formData.duracao) {
      alert("Preencha título, categoria e duração.");
      wizard.setStep(1);
      return;
    }
  
    // Validação do quiz
    if (wizard.perguntas.length > 0) {
      if (!wizard.quizTitle.trim()) {
        alert("Título do quiz é obrigatório quando há perguntas.");
        wizard.setStep(2);
        return;
      }
  
      const invalidas = wizard.perguntas.filter(
        p => p.opcoes.filter(opt => opt.correta).length !== 1
      );
      if (invalidas.length > 0) {
        alert("Cada pergunta deve ter exatamente 1 resposta correta.");
        wizard.setStep(2);
        return;
      }
    }
  
    setIsSubmitting(true);
  
    try {
      // Função auxiliar local (Idealmente mover para utils.ts)
      const isValidBackendId = (id: string | number | undefined): boolean => {
        if (!id) return false;
    
        const idNumber = Number(id);
    
        if (isNaN(idNumber)) return false;
    
        if (idNumber > 10000000000) return false; 
    
        return true;
    };

      // ======= FORMATAR MATERIAIS =======
      const materiaisFormatted: any[] = [];
      const materiaisArquivos: { index: number; file: File }[] = [];
  
      wizard.materiaisGerais.forEach((material, idx) => {
        // 🔥 CORREÇÃO CRÍTICA AQUI: Checar se ID é válido antes de enviar
        const baseMaterial = (modalMode === "edit" && isValidBackendId(material.id)) 
            ? { id: Number(material.id) } 
            : {};

        if (material.tipo === "pdf" && material.arquivoFile) {
          materiaisArquivos.push({ index: idx, file: material.arquivoFile });
          materiaisFormatted.push({ ...baseMaterial, titulo: material.titulo, tipo: "pdf" });
        } else {
          materiaisFormatted.push({
            ...baseMaterial,
            titulo: material.titulo,
            tipo: material.tipo,
            url: material.url || ""
          });
        }
      });
  
      // ======= FORMATAR MÓDULOS =======
      const modulosFormatted = wizard.modulos.map((modulo, idxModulo) => {
        const moduloPayload: any = {
          titulo: modulo.titulo,
          ordem: idxModulo + 1,
          aulas: modulo.aulas.map((aula, idxAula) => {
            const aulaPayload: any = {
              titulo: aula.titulo,
              video_id: aula.video_id,
              duracao: aula.duracao,
              ordem: idxAula + 1,
            };
            
            if (modalMode === "edit" && isValidBackendId(aula.id)) {
              aulaPayload.id = Number(aula.id);
            }
            return aulaPayload;
          })
        };
        
        if (modalMode === "edit" && isValidBackendId(modulo.id)) {
          moduloPayload.id = Number(modulo.id);
        }
        return moduloPayload;
      });
  
      // ======= PAYLOAD DO CURSO =======
      const payload: any = {
        titulo: wizard.formData.titulo,
        descricao: wizard.formData.descricao,
        instrutor_nome: wizard.formData.instrutor?.nome || "Instrutor",
        instrutor_bio: wizard.formData.instrutor?.bio || "",
        categoria: wizard.formData.categoriaId,
        nivel: wizard.formData.nivel,
        duracao: wizard.formData.duracao,
        publicado: wizard.formData.publicado ?? true,
        destaque: wizard.formData.destaque ?? false,
        certificado: wizard.formData.certificado ?? false,
        modulos: modulosFormatted,
        materiais: materiaisFormatted,
      };

      if (wizard.formData.status === "Pago") {
        payload.preco = wizard.formData.preco;
      }
  
      // ======= 1) ENVIO DO CURSO =======
      const url = modalMode === "create"
        ? "/academy/cursos/"
        : `/academy/cursos/${selectedCourseSlug}/`;
  
      const method = modalMode === "create" ? "post" : "patch";
  
      let cursoResponse;
      let responseData; // Para pegar o ID independente do wrapper do axios/fetch
  
      // Se houver arquivos → Enviar como FormData
      if (wizard.formData.capaFile || materiaisArquivos.length > 0) {
        const formData = new FormData();
        
        Object.keys(payload).forEach(key => {
          const value = payload[key];
          
          if (key === "materiais" || key === "modulos") {
            formData.append(key, JSON.stringify(value));
          } else {
            // Trata null/undefined para não virar string "null"
            if (value !== null && value !== undefined) {
              // Para booleanos, converte para string "true"/"false" explicitamente
              if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false");
              } else {
                formData.append(key, String(value));
              }
            }
          }
        });
  
        if (wizard.formData.capaFile) {
          formData.append("capa", wizard.formData.capaFile);
        }
  
        materiaisArquivos.forEach(item => {
          formData.append(`material_arquivo_${item.index}`, item.file);
        });
  
        cursoResponse = await apiBackend[method](url, formData);
      } else {
        // Envio JSON simples
        cursoResponse = await apiBackend[method](url, payload);
      }
      
      // Ajuste: Dependendo do seu interceptor, o ID pode estar no root ou em .data
      responseData = cursoResponse.data || cursoResponse; 
      const cursoId = responseData.id; 
  
      // ======= 2) QUIZ =======
      if (wizard.perguntas.length > 0 && cursoId) {
        const quizPayload = {
          curso_id: cursoId,
          titulo: wizard.quizTitle,
          descricao: "Avaliação do curso",
          nota_minima: wizard.notaMinima,
          tentativas_maximas: wizard.tentativasMaximas,
          perguntas: wizard.perguntas.map((p, idx) => {
            const perguntaPayload: any = {
              texto: p.texto,
              tipo: "multipla",
              ordem: idx + 1,
              opcoes: p.opcoes.map(o => {
                const opcaoPayload: any = {
                  texto: o.texto,
                  correta: o.correta,
                };
                if (modalMode === "edit" && isValidBackendId(o.id)) {
                  opcaoPayload.id = Number(o.id);
                }
                return opcaoPayload;
              }),
            };
            if (modalMode === "edit" && isValidBackendId(p.id)) {
              perguntaPayload.id = Number(p.id);
            }
            return perguntaPayload;
          }),
        };
  
        if (modalMode === "edit" && wizard.quizId) {
          await apiBackend.patch(`/academy/quizzes/${wizard.quizId}/`, quizPayload);
        } else {
          await apiBackend.post(`/academy/quizzes/`, quizPayload);
        }
      }
  
      // ======= FINAL =======
      await refetchCursos();
      wizard.resetWizard();
      setModalMode(null);
      setSelectedCourseSlug(null);
      alert("Curso salvo com sucesso!");
  
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar o curso. Verifique o console.");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Garantir que os tipos sejam explícitos
  const filteredCursos = cursos.filter((curso: Curso) =>
    (curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.descricao.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === "all" || curso.categoria?.id === selectedCategory) &&
    (filterStatus === "all" ||
      (filterStatus === "livre" && curso.status === "Livre") ||
      (filterStatus === "pago" && curso.status === "Pago"))
  );

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
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={refetchAllData} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Cursos</h1>
            <p className="text-gray-400">Administre cursos, trilhas e conteúdo da academy</p>
          </div>
          <button onClick={openCreateModal} className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Novo Curso</span>
          </button>
        </div>

        <Stats 
            cursos={cursos} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus} 
            categorias={categorias} 
            filteredCount={filteredCursos.length} 
        />

        <CategoryManage categorias={categorias} refetchCategorias={refetchCategorias} />
        
        {/* TODO: Trilhas de Formação - Comentado temporariamente */}
        {/* <TrilhaManage trilhas={trilhas} refetchTrilhas={refetchTrilhas} /> */}

        <CourseView 
            cursos={filteredCursos} 
            categorias={categorias} 
            onEditCourse={openEditModal} 
            refetchCursos={refetchCursos} 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
        />

        {modalMode && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {modalMode === "create" ? "Criar Novo Curso" : "Editar Curso"}
                  </h2>
                  {modalMode === "edit" && loadingFullCourse && (
                    <p className="text-sm text-gray-400 mt-1">Carregando dados do curso...</p>
                  )}
                  {modalMode === "edit" && errorFullCourse && (
                    <p className="text-sm text-red-400 mt-1">Erro ao carregar curso: {errorFullCourse}</p>
                  )}
                  {isSubmitting && (
                    <p className="text-sm text-blue-400 mt-1 animate-pulse">
                      {modalMode === "create" ? "Criando curso e salvando dados..." : "Salvando alterações..."}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3].map(stepNumber => (
                      <div key={stepNumber} className={`flex items-center ${stepNumber < 3 ? "mr-2" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${ wizard.step === stepNumber ? "bg-pink-500 text-white" : wizard.step > stepNumber ? "bg-green-500 text-white" : "bg-gray-600 text-gray-300" }`}>
                          {stepNumber}
                        </div>
                        {stepNumber < 3 && <div className={`w-8 h-0.5 ${wizard.step > stepNumber ? "bg-green-500" : "bg-gray-600"}`} />}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setModalMode(null); setSelectedCourseSlug(null); setFullCourseData(null); wizard.resetWizard(); }} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {modalMode === "edit" && loadingFullCourse ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                  </div>
                ) : modalMode === "edit" && errorFullCourse ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-400 mb-4">{errorFullCourse}</p>
                    <button onClick={() => { setModalMode(null); setSelectedCourseSlug(null); setFullCourseData(null); }} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                      Fechar
                    </button>
                  </div>
                ) : (
                  <>
                    {wizard.step === 1 && <Step1 formData={wizard.formData} setFormData={wizard.setFormData} categorias={categorias} />}
                    {wizard.step === 2 && <Step2 wizard={wizardWithDelete} />}
                    {wizard.step === 3 && <Step3 wizard={wizard} />}
                  </>
                )}
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-between">
                <div>
                  {wizard.step > 1 && (
                    <button onClick={() => wizard.setStep(wizard.step - 1)} className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 transition-all">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => { setModalMode(null); setSelectedCourseSlug(null); setFullCourseData(null); wizard.resetWizard(); }} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
                    Cancelar
                  </button>
                  {wizard.step < 3 ? (
                    <button onClick={() => wizard.setStep(wizard.step + 1)} className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 transition-all">
                      <span>Próximo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{modalMode === "create" ? "Criando..." : "Salvando..."}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{modalMode === "create" ? "Criar Curso" : "Salvar Alterações"}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}