// hooks/useCourseWizard.ts
import { useState, useEffect } from "react";
import type { Curso, Modulo, PerguntaQuiz, materiais } from "@/types/academy";

// Mantendo suas interfaces originais
export interface CourseFormData {
  titulo: string;
  descricao: string;
  instrutor: {
    nome: string;
    avatar: string;
    bio: string;
  };
  categoriaId: number;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  duracao: string;
  capa: string;
  capaFile?: File;
  status: "Livre" | "Pago";
  preco?: number;
  publicado?: boolean;
  destaque?: boolean;
  certificado?: boolean;
  privado_franqueado?: boolean;
}

export interface CurrentPerguntaState {
  texto: string;
  opcoes: { texto: string }[];
  respostaCorretaIndex: number | null;
}

export interface CurrentAulaState {
  titulo: string;
  video_id: string;
  duracao: string;
  moduloId: string;
}

export interface CurrentMaterialState {
  titulo: string;
  tipo: materiais['tipo'];
  url: string;
  arquivoFile?: File;
}

const initialFormData: CourseFormData = {
  titulo: "",
  descricao: "",
  instrutor: {
    nome: "Equipe Dama",
    avatar: "/default-avatar.png",
    bio: "",
  },
  categoriaId: 0,
  nivel: "Iniciante",
  duracao: "",
  capa: "/placeholder-capa.svg",
  status: "Livre",
  preco: undefined,
  publicado: true,
  destaque: false,
  certificado: false,
  privado_franqueado: true,
};

export function useCourseWizard(initialCourse?: Curso | null) {
  // 🔥 Controle para evitar recarregar e sobrescrever dados locais
  const [loadedCourseId, setLoadedCourseId] = useState<number | string | null>(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [currentModuloName, setCurrentModuloName] = useState("");

  // Quiz states
  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState<number | null>(null);
  const [notaMinima, setNotaMinima] = useState<number>(70);
  const [tentativasMaximas, setTentativasMaximas] = useState<number>(3);
  const [perguntas, setPerguntas] = useState<PerguntaQuiz[]>([]);
  const [editingPerguntaId, setEditingPerguntaId] = useState<string | null>(null);
  const [currentPergunta, setCurrentPergunta] = useState<CurrentPerguntaState>({
    texto: "",
    opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
    respostaCorretaIndex: null,
  });

  // Material e Aula states
  const [materiaisGerais, setMateriaisGerais] = useState<materiais[]>([]);
  const [currentAula, setCurrentAula] = useState<CurrentAulaState>({
    titulo: "", video_id: "", duracao: "", moduloId: "",
  });
  const [editingAulaId, setEditingAulaId] = useState<string | null>(null);
  const [editingModuloId, setEditingModuloId] = useState<string | null>(null);
  const [editingModuloTitulo, setEditingModuloTitulo] = useState<string>("");
  const [currentMaterial, setCurrentMaterial] = useState<CurrentMaterialState>({
    titulo: "", tipo: "pdf", url: "", arquivoFile: undefined,
  });

  // ------------------------------------------------------------------
  // 🟦 EFEITO DE CARREGAMENTO SEGURO
  // ------------------------------------------------------------------
  useEffect(() => {
    // 1. Se não tem curso inicial (Modo Criação), não faz nada.
    if (!initialCourse) return;

    // 2. Extrair ID para verificação
    const courseId = (initialCourse as any).id;

    // 3. Se não tem ID, é inválido ou é apenas um template vazio, ignora.
    if (!courseId) return;

    // 4. 🔥 O PULO DO GATO: Se já carregamos este ID, PARE.
    // Isso impede que re-renders ou atualizações do pai sobrescrevam seu trabalho local.
    if (courseId === loadedCourseId) return;

    // Marca como carregado para não entrar aqui de novo
    setLoadedCourseId(courseId);

    // --- POPULAR DADOS ---
    const { modulos: initModulos, quizzes, avaliacoesAlunos, materiais, ...restOfCursoData } = initialCourse;

    setFormData({
      ...initialFormData, // Garante defaults caso falte algo
      ...restOfCursoData,
      categoriaId: (restOfCursoData.categoria?.id || 0),
    } as CourseFormData);

    // Só define se vier array, senão mantém vazio (mas só roda essa vez)
    setModulos(initModulos || []);
    setMateriaisGerais(materiais || []);

    // Configurar quiz
    if (quizzes) {
      setQuizTitle(quizzes.titulo || "");
      setPerguntas(quizzes.perguntas || []);

      // Lógica de extração de ID do Quiz
      if (typeof quizzes === 'object' && 'id' in quizzes) {
        const id = quizzes.id;
        setQuizId(typeof id === 'string' ? parseInt(id) : (typeof id === 'number' ? id : null));
      }
      if ('quizId' in initialCourse && (initialCourse as any).quizId) {
        const qId = (initialCourse as any).quizId;
        setQuizId(typeof qId === 'string' ? parseInt(qId) : qId);
      }

      // Configs do quiz
      const nota = (quizzes as any).nota_minima;
      setNotaMinima(nota ? Number(nota) : 70);

      const tentativas = (quizzes as any).tentativas_maximas;
      setTentativasMaximas(tentativas ? Number(tentativas) : 3);
    } else {
      // Reset quiz local se não vier nada no initialCourse
      setQuizTitle("");
      setPerguntas([]);
      setQuizId(null);
    }

    setStep(1);

  }, [initialCourse, loadedCourseId]); // Dependências controladas

  // ------------------------------------------------------------------
  // FUNÇÕES DE RESET E HANDLERS
  // ------------------------------------------------------------------

  const resetWizard = () => {
    setLoadedCourseId(null); // 🔥 Importante: Permite carregar um novo curso ou limpar
    setStep(1);
    setFormData(initialFormData);
    setModulos([]);
    setCurrentModuloName("");
    setQuizTitle("");
    setQuizId(null);
    setNotaMinima(70);
    setTentativasMaximas(3);
    setPerguntas([]);
    setEditingPerguntaId(null);
    setEditingAulaId(null);
    setEditingModuloId(null);
    setEditingModuloTitulo("");
    setMateriaisGerais([]);
    setCurrentPergunta({
      texto: "",
      opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
      respostaCorretaIndex: null,
    });
    setCurrentAula({
      titulo: "", video_id: "", duracao: "", moduloId: "",
    });
    setCurrentMaterial({
      titulo: "", tipo: "pdf", url: "", arquivoFile: undefined,
    });
  };

  const handleAddModulo = () => {
    if (!currentModuloName.trim()) return;
    const newModulo: Modulo = {
      id: `mod-${Date.now()}`,
      titulo: currentModuloName,
      aulas: [],
    };
    setModulos(prev => [...prev, newModulo]);
    setCurrentModuloName("");
  };

  const handleRemoveModulo = (id: string) => {
    setModulos(prev => prev.filter(m => m.id !== id));
  };

  const handleAddPergunta = () => {
    if (!currentPergunta.texto.trim() || currentPergunta.opcoes.some(opt => !opt.texto.trim()) || currentPergunta.respostaCorretaIndex === null) {
      alert("Preencha o texto da pergunta, todas as opções e marque a resposta correta.");
      return;
    }
    const newPergunta: PerguntaQuiz = {
      id: `p-${Date.now()}`,
      texto: currentPergunta.texto,
      opcoes: currentPergunta.opcoes.map((opcao, index) => ({
        id: `opt-${Date.now()}-${index}`,
        texto: opcao.texto,
        correta: index === currentPergunta.respostaCorretaIndex,
      })),
      respostaCorretaId: `opt-${Date.now()}-${currentPergunta.respostaCorretaIndex}`,
    };
    setPerguntas(prev => [...prev, newPergunta]);
    setCurrentPergunta({
      texto: "",
      opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
      respostaCorretaIndex: null,
    });
  };

  const handleRemovePergunta = (id: string) => {
    setPerguntas(prev => prev.filter(p => p.id !== id));
    if (editingPerguntaId === id) {
      setEditingPerguntaId(null);
      setCurrentPergunta({
        texto: "",
        opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
        respostaCorretaIndex: null,
      });
    }
  };

  const handleEditPergunta = (id: string) => {
    const pergunta = perguntas.find(p => p.id === id);
    if (!pergunta) return;

    const respostaCorretaIndex = pergunta.opcoes.findIndex(opt => opt.correta === true);

    setEditingPerguntaId(id);
    setCurrentPergunta({
      texto: pergunta.texto,
      opcoes: pergunta.opcoes.map(opt => ({ texto: opt.texto })),
      respostaCorretaIndex: respostaCorretaIndex >= 0 ? respostaCorretaIndex : null,
    });
  };

  const handleUpdatePergunta = () => {
    if (!editingPerguntaId) return;
    if (!currentPergunta.texto.trim() || currentPergunta.opcoes.some(opt => !opt.texto.trim()) || currentPergunta.respostaCorretaIndex === null) {
      alert("Preencha o texto da pergunta, todas as opções e marque a resposta correta.");
      return;
    }

    const updatedPergunta: PerguntaQuiz = {
      id: editingPerguntaId,
      texto: currentPergunta.texto,
      opcoes: currentPergunta.opcoes.map((opcao, index) => ({
        id: `opt-${editingPerguntaId}-${index}`,
        texto: opcao.texto,
        correta: index === currentPergunta.respostaCorretaIndex,
      })),
      respostaCorretaId: `opt-${editingPerguntaId}-${currentPergunta.respostaCorretaIndex}`,
    };

    setPerguntas(prev => prev.map(p => p.id === editingPerguntaId ? updatedPergunta : p));
    setEditingPerguntaId(null);
    setCurrentPergunta({
      texto: "",
      opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
      respostaCorretaIndex: null,
    });
  };

  const handleCancelEditPergunta = () => {
    setEditingPerguntaId(null);
    setCurrentPergunta({
      texto: "",
      opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
      respostaCorretaIndex: null,
    });
  };

  const handleReorderPergunta = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setPerguntas(prev => {
      const newPerguntas = [...prev];
      const [removed] = newPerguntas.splice(fromIndex, 1);
      newPerguntas.splice(toIndex, 0, removed);
      return newPerguntas;
    });
  };

  const handleAddAula = () => {
    console.log("🎬 Tentando adicionar aula:", currentAula);
    console.log("📦 Módulos disponíveis:", modulos);
    console.log("🔍 Tipos:", {
      moduloIdType: typeof currentAula.moduloId,
      moduloIdValue: currentAula.moduloId,
      modulosIds: modulos.map(m => ({ id: m.id, tipo: typeof m.id }))
    });

    if (!currentAula.titulo.trim() || !currentAula.video_id.trim() || !currentAula.moduloId) {
      alert("Preencha todos os campos obrigatórios da aula e selecione um módulo.");
      console.error("❌ Validação falhou:", {
        titulo: currentAula.titulo,
        video_id: currentAula.video_id,
        moduloId: currentAula.moduloId
      });
      return;
    }

    const moduloEncontrado = modulos.find(m => String(m.id) === String(currentAula.moduloId));
    console.log("🔍 Módulo selecionado:", moduloEncontrado);

    if (!moduloEncontrado) {
      alert("Módulo não encontrado! Verifique se o módulo ainda existe.");
      console.error("❌ Módulo não encontrado. Comparação:", {
        procurado: currentAula.moduloId,
        disponiveis: modulos.map(m => m.id)
      });
      return;
    }

    const newAula = {
      id: `aula-${Date.now()}`,
      titulo: currentAula.titulo,
      slug: currentAula.titulo.toLowerCase().replace(/\s+/g, "-"),
      video_id: currentAula.video_id,
      duracao: currentAula.duracao || "0:00",
      concluida: false,
    };

    console.log("✅ Nova aula criada:", newAula);
    setModulos(prev => {
      const novosModulos = prev.map(modulo => {
        // 🔥 CORREÇÃO: Comparar com conversão de tipo
        if (String(modulo.id) === String(currentAula.moduloId)) {
          const moduloAtualizado = {
            ...modulo,
            aulas: [...modulo.aulas, newAula]
          };
          console.log("📝 Módulo atualizado:", moduloAtualizado);
          return moduloAtualizado;
        }
        return modulo;
      });

      console.log("🎯 Estado final dos módulos após adicionar aula:", novosModulos);
      return novosModulos;
    });
    setCurrentAula({
      titulo: "", video_id: "", duracao: "", moduloId: "",
    });
  };

  const handleRemoveAula = (moduloId: string, aulaId: string) => {
    setModulos(prev =>
      prev.map(modulo =>
        modulo.id === moduloId ? { ...modulo, aulas: modulo.aulas.filter(aula => aula.id !== aulaId) } : modulo
      )
    );
    if (editingAulaId === aulaId) {
      setEditingAulaId(null);
      setCurrentAula({
        titulo: "", video_id: "", duracao: "", moduloId: "",
      });
    }
  };

  const handleEditAula = (moduloId: string, aulaId: string) => {
    const modulo = modulos.find(m => m.id === moduloId);
    if (!modulo) return;

    const aula = modulo.aulas.find(a => a.id === aulaId);
    if (!aula) return;

    setEditingAulaId(aulaId);
    setCurrentAula({
      titulo: aula.titulo,
      video_id: aula.video_id || "",
      duracao: aula.duracao || "",
      moduloId: moduloId,
    });
  };

  const handleUpdateAula = () => {
    if (!editingAulaId || !currentAula.titulo.trim() || !currentAula.video_id.trim() || !currentAula.moduloId) {
      alert("Preencha todos os campos obrigatórios da aula.");
      return;
    }

    setModulos(prev =>
      prev.map(modulo =>
        modulo.id === currentAula.moduloId
          ? {
            ...modulo,
            aulas: modulo.aulas.map(aula =>
              aula.id === editingAulaId
                ? {
                  ...aula,
                  titulo: currentAula.titulo,
                  video_id: currentAula.video_id,
                  duracao: currentAula.duracao || "0:00",
                  slug: currentAula.titulo.toLowerCase().replace(/\s+/g, "-"),
                }
                : aula
            ),
          }
          : modulo
      )
    );

    setEditingAulaId(null);
    setCurrentAula({
      titulo: "", video_id: "", duracao: "", moduloId: "",
    });
  };

  const handleCancelEditAula = () => {
    setEditingAulaId(null);
    setCurrentAula({
      titulo: "", video_id: "", duracao: "", moduloId: "",
    });
  };

  const handleEditModulo = (moduloId: string) => {
    const modulo = modulos.find(m => m.id === moduloId);
    if (!modulo) return;

    setEditingModuloId(moduloId);
    setEditingModuloTitulo(modulo.titulo);
  };

  const handleUpdateModulo = () => {
    if (!editingModuloId || !editingModuloTitulo.trim()) {
      alert("O nome do módulo não pode estar vazio.");
      return;
    }

    setModulos(prev =>
      prev.map(modulo =>
        modulo.id === editingModuloId
          ? { ...modulo, titulo: editingModuloTitulo }
          : modulo
      )
    );

    setEditingModuloId(null);
    setEditingModuloTitulo("");
  };

  const handleCancelEditModulo = () => {
    setEditingModuloId(null);
    setEditingModuloTitulo("");
  };

  const handleAddMaterial = () => {
    if (!currentMaterial.titulo.trim() || (!currentMaterial.url.trim() && !currentMaterial.arquivoFile)) {
      alert("Preencha o título e adicione um arquivo ou URL.");
      return;
    }
    const newMaterial: materiais = {
      id: Date.now(),
      titulo: currentMaterial.titulo,
      tipo: currentMaterial.tipo,
      url: currentMaterial.url,
      arquivoFile: currentMaterial.arquivoFile,
      arquivo: currentMaterial.titulo,
    };

    setMateriaisGerais(prev => [...prev, newMaterial]);

    setCurrentMaterial({
      titulo: "",
      tipo: "pdf",
      url: "",
      arquivoFile: undefined,
    });
  };

  const handleRemoveMaterial = (materialIndex: number) => {
    setMateriaisGerais(prev => prev.filter((_, index) => index !== materialIndex));
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    modulos,
    currentModuloName,
    setCurrentModuloName,
    handleAddModulo,
    handleRemoveModulo,
    editingModuloId,
    editingModuloTitulo,
    setEditingModuloTitulo,
    handleEditModulo,
    handleUpdateModulo,
    handleCancelEditModulo,
    quizTitle,
    setQuizTitle,
    quizId,
    notaMinima,
    setNotaMinima,
    tentativasMaximas,
    setTentativasMaximas,
    perguntas,
    editingPerguntaId,
    currentPergunta,
    setCurrentPergunta,
    handleAddPergunta,
    handleEditPergunta,
    handleUpdatePergunta,
    handleCancelEditPergunta,
    handleRemovePergunta,
    handleReorderPergunta,
    materiaisGerais,
    currentAula,
    setCurrentAula,
    editingAulaId,
    handleAddAula,
    handleEditAula,
    handleUpdateAula,
    handleCancelEditAula,
    handleRemoveAula,
    currentMaterial,
    setCurrentMaterial,
    handleAddMaterial,
    handleRemoveMaterial,
    resetWizard,
  };
}