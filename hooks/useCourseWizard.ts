// hooks/useCourseWizard.ts
import { useState, useEffect } from "react";
import type { Curso, Modulo, PerguntaQuiz, materiais, OpcaoQuiz } from "@/types/academy";

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
}

export interface CurrentPerguntaState {
  texto: string;
  opcoes: { texto: string }[];
  respostaCorretaIndex: number | null;
}

export interface CurrentAulaState {
  titulo: string;
  videoId: string;
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
};

export function useCourseWizard(initialCourse?: Curso | null) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [currentModuloName, setCurrentModuloName] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [perguntas, setPerguntas] = useState<PerguntaQuiz[]>([]);
  const [currentPergunta, setCurrentPergunta] = useState<CurrentPerguntaState>({
    texto: "",
    opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
    respostaCorretaIndex: null,
  });
  
  const [materiaisGerais, setMateriaisGerais] = useState<materiais[]>([]);
  const [currentAula, setCurrentAula] = useState<CurrentAulaState>({
    titulo: "", videoId: "", duracao: "", moduloId: "",
  });
  const [currentMaterial, setCurrentMaterial] = useState<CurrentMaterialState>({
    titulo: "", tipo: "pdf", url: "", arquivoFile: undefined,
  });

  useEffect(() => {
    if (initialCourse) {
      const { modulos, quizzes, avaliacoesAlunos, materiais, ...restOfCursoData } = initialCourse;
      setFormData({
        ...restOfCursoData,
        categoriaId: (restOfCursoData.categoria?.id),
      } as CourseFormData);
      setModulos(modulos || []);
      setQuizTitle(quizzes?.titulo || "");
      setPerguntas(quizzes?.perguntas || []);
      setMateriaisGerais(materiaisGerais || []);
      setStep(1);
    }
  }, [initialCourse]);

  const resetWizard = () => {
    setStep(1);
    setFormData(initialFormData);
    setModulos([]);
    setCurrentModuloName("");
    setQuizTitle("");
    setPerguntas([]);
    setMateriaisGerais([]);
    setCurrentPergunta({
      texto: "",
      opcoes: [{ texto: "" }, { texto: "" }, { texto: "" }, { texto: "" }],
      respostaCorretaIndex: null,
    });
    setCurrentAula({
      titulo: "", videoId: "", duracao: "", moduloId: "",
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
        correta: index === currentPergunta.respostaCorretaIndex, // ✅ ADICIONAR
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
  };
  
  const handleAddAula = () => {
    if (!currentAula.titulo.trim() || !currentAula.videoId.trim() || !currentAula.moduloId) {
      alert("Preencha todos os campos obrigatórios da aula e selecione um módulo.");
      return;
    }
    const newAula = {
      id: `aula-${Date.now()}`,
      titulo: currentAula.titulo,
      slug: currentAula.titulo.toLowerCase().replace(/\s+/g, "-"),
      videoId: currentAula.videoId,
      duracao: currentAula.duracao || "0:00",
      concluida: false,
    };
    setModulos(prev =>
      prev.map(modulo =>
        modulo.id === currentAula.moduloId ? { ...modulo, aulas: [...modulo.aulas, newAula] } : modulo
      )
    );
    setCurrentAula({
      titulo: "", videoId: "", duracao: "", moduloId: "",
    });
  };

  const handleRemoveAula = (moduloId: string, aulaId: string) => {
    setModulos(prev =>
      prev.map(modulo =>
        modulo.id === moduloId ? { ...modulo, aulas: modulo.aulas.filter(aula => aula.id !== aulaId) } : modulo
      )
    );
  };

  const handleAddMaterial = () => {
    if (!currentMaterial.titulo.trim() || (!currentMaterial.url.trim() && !currentMaterial.arquivoFile)) {
      alert("Preencha o título e adicione um arquivo ou URL.");
      return;
    }
    const newMaterial: materiais = {
      // 👇 ADICIONE UM ID TEMPORÁRIO AQUI
      id: Date.now(), // Usar um timestamp é uma forma simples de garantir um id único no front-end
      titulo: currentMaterial.titulo,
      tipo: currentMaterial.tipo,
      url: currentMaterial.url,
      arquivoFile: currentMaterial.arquivoFile,
      arquivo: currentMaterial.titulo, // Você pode querer o nome do arquivo aqui
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
    quizTitle,
    setQuizTitle,
    perguntas,
    currentPergunta,
    setCurrentPergunta,
    handleAddPergunta,
    handleRemovePergunta,
    materiaisGerais,
    currentAula,
    setCurrentAula,
    handleAddAula,
    handleRemoveAula,
    currentMaterial,
    setCurrentMaterial,
    handleAddMaterial,
    handleRemoveMaterial,
    resetWizard,
  };
}