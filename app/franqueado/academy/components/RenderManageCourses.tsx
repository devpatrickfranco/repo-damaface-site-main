  "use client"

  import { useState } from "react";
  import { Plus, X, Save, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

  import { useCursos, useCategorias, useTrilhas } from "@/hooks/useApi";
  import { useCourseWizard } from '@/hooks/useCourseWizard';

  import { apiBackend } from "@/lib/api-backend";
  import type { Curso, Categoria, Trilha } from "@/types/academy";

  import Stats from "@/app/franqueado/academy/components/RenderManageCourses/Stats";
  import CategoryManage from "@/app/franqueado/academy/components/RenderManageCourses/CategoryManage";
  import TrilhaManage from "./RenderManageCourses/TrailManage";
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

    const { 
      data: trilhasData, 
      loading: loadingTrilhas, 
      error: errorTrilhas,
      refetch: refetchTrilhas
    } = useTrilhas({ page_size: 100 });

    // Ajuste para extrair os resultados dos dados retornados pelos hooks
    const cursos = cursosData || [];
    const categorias = categoriasData || [];
    const trilhas = trilhasData || [];

    const loading = loadingCursos || loadingCategorias || loadingTrilhas;
    const error = errorCursos || errorCategorias || errorTrilhas;

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
                id: String(pergunta.id),
                texto: pergunta.texto,
                opcoes: (pergunta.opcoes || []).map((opcao: any) => ({
                  id: String(opcao.id),
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
      refetchTrilhas();
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
    if (!wizard.formData.titulo || !wizard.formData.categoriaId || !wizard.formData.duracao) {
      alert("Preencha os campos obrigatórios (*) no Passo 1.\n Preencha o titulo, selecione uma categoria e diga a duração do curso.");
      wizard.setStep(1);
      return;
    }

    // Validações do quiz
    if (wizard.perguntas.length > 0) {
      if (!wizard.quizTitle.trim()) {
        alert("O título do quiz é obrigatório quando há perguntas.");
        wizard.setStep(2);
        return;
      }
      
      // Validar que cada pergunta tem exatamente 1 resposta correta
      const perguntasInvalidas = wizard.perguntas.filter(p => {
        const respostasCorretas = p.opcoes.filter(opt => opt.correta).length;
        return respostasCorretas !== 1;
      });
      
      if (perguntasInvalidas.length > 0) {
        alert(`Cada pergunta deve ter exatamente 1 resposta correta. Verifique as perguntas: ${perguntasInvalidas.map((p, idx) => idx + 1).join(", ")}`);
        wizard.setStep(2);
        return;
      }
      
      // Validar que todas as opções estão preenchidas
      const opcoesVazias = wizard.perguntas.some(p => 
        p.opcoes.some(opt => !opt.texto.trim())
      );
      
      if (opcoesVazias) {
        alert("Todas as opções das perguntas devem estar preenchidas.");
        wizard.setStep(2);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const materiaisFormatted: any[] = [];
      const materiaisArquivos: { index: number; file: File }[] = [];

      wizard.materiaisGerais.forEach((material, idx) => {
        if (material.tipo.toLowerCase() === "pdf" && material.arquivoFile) {
          materiaisArquivos.push({
            index: idx,
            file: material.arquivoFile
          });

          materiaisFormatted.push({
            titulo: material.titulo,
            tipo: "pdf",
            // IMPORTANTE: Não envie null, envie undefined ou string vazia se necessário
            // O backend vai ignorar url se tiver arquivo, mas melhor não mandar null
          });
        } else {
          materiaisFormatted.push({
            titulo: material.titulo,
            tipo: material.tipo.toLowerCase(),
            // GARANTIA: Se url for null ou undefined, manda string vazia
            url: material.url || "" 
          });
        }
      });

      // ---------- Módulos e aulas ----------
      const modulosFormatted = wizard.modulos.map((modulo, idxModulo) => ({
        titulo: modulo.titulo,
        ordem: idxModulo + 1,
        aulas: modulo.aulas.map((aula, idxAula) => ({
          titulo: aula.titulo,
          video_id: aula.video_id || "", 
          duracao: aula.duracao || "",
          ordem: idxAula + 1,
        })),
      }));

      // ---------- Payload base do curso ----------
      const payload: any = {
        titulo: wizard.formData.titulo,
        descricao: wizard.formData.descricao,
        instrutor_nome: wizard.formData.instrutor?.nome || "Instrutor",
        instrutor_bio: wizard.formData.instrutor?.bio || "",
        categoria: wizard.formData.categoriaId,
        nivel: wizard.formData.nivel,
        duracao: wizard.formData.duracao,
        publicado: true,
        destaque: false,
      };

      // Adicionar preço se pago
      if (wizard.formData.status === "Pago" && wizard.formData.preco) {
        payload.preco = wizard.formData.preco;
      }

      // Sempre incluir relacionamentos se houver
      if (materiaisFormatted.length > 0) payload.materiais = materiaisFormatted;
      // Quiz será salvo separadamente via rota /quizzes
      if (modulosFormatted.length > 0) payload.modulos = modulosFormatted;

      // ---------- URL e método ----------
  if (!selectedCourseSlug && modalMode !== 'create') {
    alert('Erro: curso selecionado não possui slug.');
    return;
    }
    const url = modalMode === 'create'
      ? '/academy/cursos/'
      : `/academy/cursos/${selectedCourseSlug}/`;

      const method = modalMode === "create" ? "post" : "patch";

      // ---------- Envio (sempre com FormData se houver arquivos) ----------
      let cursoResponse: any = null;
      if (wizard.formData.capaFile || materiaisArquivos.length > 0) {
        const formData = new FormData();

        formData.append("titulo", payload.titulo);
        formData.append("descricao", payload.descricao);
        formData.append("instrutor_nome", payload.instrutor_nome);
        formData.append("instrutor_bio", payload.instrutor_bio);
        formData.append("categoria", payload.categoria);
        formData.append("nivel", payload.nivel);
        formData.append("duracao", payload.duracao);
        formData.append("publicado", String(payload.publicado));
        formData.append("destaque", String(payload.destaque));

        if (payload.preco) {
          formData.append("preco", String(payload.preco));
        }

        // Adicionar arrays como JSON
        if (payload.modulos) {
          formData.append("modulos", JSON.stringify(payload.modulos));
        }
        if (payload.quizzes) {
          formData.append("quizzes", JSON.stringify(payload.quizzes));
        }
        if (payload.materiais) {
          formData.append("materiais", JSON.stringify(payload.materiais));
        }

        // Adicionar capa se houver
        if (wizard.formData.capaFile) {
          formData.append("capa", wizard.formData.capaFile);
        }

        // Adicionar os arquivos PDF reais
        materiaisArquivos.forEach((item) => {
          formData.append(`material_arquivo_${item.index}`, item.file);
        });

        cursoResponse = await apiBackend[method](url, formData);
        
      } else {
        // Envio simples sem arquivos
        cursoResponse = await apiBackend[method](url, payload);
      }

      // Obter o ID do curso após salvar (da resposta ou do curso existente)
      let cursoId: number | null = null;
      if (modalMode === "edit" && fullCourseData?.id) {
        cursoId = fullCourseData.id;
      } else if (modalMode === "create" && cursoResponse?.id) {
        // Se criou um novo curso, usar o ID da resposta
        cursoId = cursoResponse.id;
      }
      
      // Se ainda não tem cursoId, tentar buscar pelo slug (fallback)
      if (!cursoId && selectedCourseSlug) {
        try {
          const cursoBuscado = await apiBackend.get<any>(`/academy/cursos/${selectedCourseSlug}/`);
          cursoId = cursoBuscado?.id || null;
        } catch (err) {
          console.warn("Não foi possível obter ID do curso:", err);
        }
      }

      // ---------- Salvar Quiz separadamente via rota /quizzes ----------
      if (wizard.perguntas.length > 0 && wizard.quizTitle.trim()) {
        const quizPayload: any = {
          titulo: wizard.quizTitle,
          descricao: "Avaliação do curso",
          nota_minima: wizard.notaMinima.toString(),
          tentativas_maximas: wizard.tentativasMaximas,
          perguntas: wizard.perguntas.map((pergunta, idx) => ({
            texto: pergunta.texto,
            tipo: "multipla",
            ordem: idx + 1,
            opcoes: pergunta.opcoes.map(opcao => ({
              texto: opcao.texto,
              correta: opcao.correta || false,
            })),
          })),
        };

        // Adicionar curso_id ao payload quando criar novo quiz
        if (!wizard.quizId && cursoId) {
          quizPayload.curso = cursoId;
        }

        try {
          if (wizard.quizId) {
            // Atualizar quiz existente
            await apiBackend.patch(`/academy/quizzes/${wizard.quizId}/`, quizPayload);
            console.log("Quiz atualizado com sucesso");
          } else {
            // Criar novo quiz - garantir que tem curso_id
            if (!cursoId) {
              throw new Error("Não foi possível obter o ID do curso para vincular o quiz.");
            }
            await apiBackend.post(`/academy/quizzes/`, quizPayload);
            console.log("Quiz criado e vinculado ao curso com sucesso");
          }
        } catch (quizErr: any) {
          console.error("Erro ao salvar quiz:", quizErr);
          throw new Error(`Erro ao salvar quiz: ${quizErr.response?.data?.message || quizErr.message}`);
        }
      } else if (wizard.quizId && wizard.perguntas.length === 0) {
        // Se tinha quiz mas agora não tem perguntas, deletar o quiz
        try {
          await apiBackend.delete(`/academy/quizzes/${wizard.quizId}/`);
          console.log("Quiz deletado (sem perguntas)");
        } catch (quizErr: any) {
          console.error("Erro ao deletar quiz:", quizErr);
          // Não bloquear o salvamento do curso se falhar ao deletar quiz
        }
      }

      // ---------- Finalização ----------
      refetchCursos();
      setModalMode(null);
      setSelectedCourseSlug(null);
      setFullCourseData(null);
      wizard.resetWizard();
      alert("Curso salvo com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar curso:", err);
      console.error("Detalhes do erro:", err.response);
      alert(err.response || "Erro ao salvar curso. Veja o console para mais detalhes.");
    } finally {
      setIsSubmitting(false);
    }
  };
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
          
          <TrilhaManage trilhas={trilhas} refetchTrilhas={refetchTrilhas} />

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