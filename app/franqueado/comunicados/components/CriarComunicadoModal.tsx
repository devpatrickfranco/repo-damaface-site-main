"use client"

import type React from "react"
import type { DestinatarioOption, ComunicadoFormData } from "@/types/comunicado"

import { useState, Fragment, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Upload, Eye, AlertCircle, Users, User, Calendar } from "lucide-react"
import { apiBackend } from "@/lib/api-backend"

import dynamic from "next/dynamic"

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => <p className="text-gray-400">Carregando editor...</p>,
})

// Tipagem para os props do componente
interface CriarComunicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  comunicadoParaEdicao?: any; // Idealmente, deveria ser ComunicadoType | null
  isEditMode: boolean;
}

export default function CriarComunicadoModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  comunicadoParaEdicao = null,
  isEditMode = false 
}: CriarComunicadoModalProps)  {
  
  const [formData, setFormData] = useState<ComunicadoFormData>({
    titulo: "",
    conteudo: "",
    tipo: "COMUNICADO",
    prioridade: "MEDIA",
    tipoDestino: "TODAS_FRANQUIAS",
    apenasFranqueados: false,
    destinatarios: [],
    data_expiracao: "",
    anexos: [],
  })

  // Efeito para popular o formulário no modo de edição ou resetar
  useEffect(() => {
    if (comunicadoParaEdicao && isOpen && isEditMode) {
      setFormData({
        titulo: comunicadoParaEdicao.titulo || "",
        conteudo: comunicadoParaEdicao.conteudo || "",
        tipo: comunicadoParaEdicao.tipo || "COMUNICADO",
        prioridade: comunicadoParaEdicao.urgente ? "ALTA" : "MEDIA",
        tipoDestino: comunicadoParaEdicao.tipo_destino || "TODAS_FRANQUIAS",
        apenasFranqueados: comunicadoParaEdicao.apenas_franqueados || false,
        destinatarios: comunicadoParaEdicao.destinatarios || [],
        data_expiracao: comunicadoParaEdicao.data_expiracao?.split("T")[0] || "",
        anexos: [],
      });
    } else if (!isOpen) {
      // Resetar o formulário ao fechar o modal
      setFormData({
        titulo: "",
        conteudo: "",
        tipo: "COMUNICADO",
        prioridade: "MEDIA",
        tipoDestino: "TODAS_FRANQUIAS",
        apenasFranqueados: false,
        destinatarios: [],
        data_expiracao: "",
        anexos: [],
      });
    }
  }, [comunicadoParaEdicao, isOpen, isEditMode]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [destinatarioSearch, setDestinatarioSearch] = useState(""); 
  const [destinatarioOptions, setDestinatarioOptions] = useState<DestinatarioOption[]>([]);

  // Efeito para buscar as franquias quando necessário
  useEffect(() => {
    if (isOpen && formData.tipoDestino === 'FRANQUIAS_ESPECIFICAS') {
      const fetchFranquias = async () => {
        try {
          const response = await apiBackend.get("/users/franquias/");
          const franquiasFromApi = response.data; 
          const franchiseOptions: DestinatarioOption[] = franquiasFromApi.map((franquia: any) => ({
            id: franquia.id.toString(),
            nome: franquia.nome,
            tipo: "GRUPO" as const
          }));
          setDestinatarioOptions(franchiseOptions);
        } catch (err) {
          console.error("Falha ao buscar franquias:", err);
          setError("Não foi possível carregar a lista de destinatários.");
        }
      };
      fetchFranquias();
    }
  }, [isOpen, formData.tipoDestino]); 

  const handleInputChange = (field: keyof ComunicadoFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        anexos: [...prev.anexos, ...newFiles],
      }));
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index),
    }));
  }

  const addDestinatario = (destinatario: DestinatarioOption) => {
    if (!formData.destinatarios.find((d) => d.id === destinatario.id)) {
      setFormData((prev) => ({
        ...prev,
        destinatarios: [...prev.destinatarios, destinatario],
      }));
    }
    setDestinatarioSearch("");
  }

  const removeDestinatario = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      destinatarios: prev.destinatarios.filter((d) => d.id !== id),
    }));
  }

  const filteredDestinatarios = destinatarioOptions.filter(
    (d: DestinatarioOption) =>
      d.nome.toLowerCase().includes(destinatarioSearch.toLowerCase()) &&
      !formData.destinatarios.find((selected) => selected.id === d.id),
  );

  const handleSubmit = async (targetStatus: 'RASCUNHO' | 'PENDENTE_APROVACAO') => {
    setLoading(true);
    setError("");

    const submissionData = new FormData();

    submissionData.append("titulo", formData.titulo);
    submissionData.append("conteudo", formData.conteudo);
    submissionData.append("tipo", formData.tipo);
    submissionData.append("status", targetStatus);
    submissionData.append("prioridade", formData.prioridade);

    const destinatariosData = {
      tipo: formData.tipoDestino,
      apenas_franqueados: formData.apenasFranqueados,
      franquias_ids: formData.tipoDestino === 'FRANQUIAS_ESPECIFICAS' 
        ? formData.destinatarios.map(d => parseInt(d.id, 10)).filter(id => !isNaN(id))
        : [],
      usuarios_ids: [],
    };
    submissionData.append("destinatarios_data", JSON.stringify(destinatariosData));

    if (formData.data_expiracao) {
      submissionData.append("data_expiracao", formData.data_expiracao);
    }
    formData.anexos.forEach((file) => {
      submissionData.append("anexos", file, file.name);
    });

    try {
      const endpoint = isEditMode && comunicadoParaEdicao
        ? `/dashboard/comunicados/${comunicadoParaEdicao.id}/`
        : "/dashboard/comunicados/";
      const method = isEditMode ? 'put' : 'post';

      await apiBackend[method](endpoint, submissionData);
      
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(`Erro ao ${isEditMode ? 'editar' : 'criar'} comunicado:`, err);
      const action = isEditMode ? 'editar' : 'criar';
      setError(`Falha ao ${action} comunicado. Verifique os campos e tente novamente.`);
      if (err.response) {
        console.error("Dados do erro:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "ALTA": return "text-red-400";
      case "MEDIA": return "text-yellow-400";
      case "BAIXA": return "text-blue-400";
      default: return "text-gray-400";
    }
  }

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case "ALTA": return "🔴";
      case "MEDIA": return "🟡";
      case "BAIXA": return "🔵";
      default: return "⚪";
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                    {isEditMode ? "Editar Comunicado" : "Criar Novo Comunicado"}
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      {showPreview ? "Editar" : "Preview"}
                    </button>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  {showPreview ? (
                    // MODO PREVIEW
                    <div className="space-y-6">
                      {/* ... (UI de Preview pode ser adicionada aqui) ... */}
                       <p className="text-white">Modo de pré-visualização.</p>
                       <div
                         className="prose prose-invert prose-pink max-w-none"
                         dangerouslySetInnerHTML={{ __html: formData.conteudo }}
                       />
                    </div>
                  ) : (
                    // MODO FORMULÁRIO
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Coluna Esquerda */}
                        <div className="space-y-6">
                          {/* Título */}
                          <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                            <input
                              type="text"
                              value={formData.titulo}
                              onChange={(e) => handleInputChange("titulo", e.target.value)}
                              placeholder="Digite um título claro e direto"
                              maxLength={100}
                              required
                              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                            />
                            <p className="text-xs text-gray-400 mt-1">{formData.titulo.length}/100 caracteres</p>
                          </div>
                          
                          {/* Prioridade */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Prioridade *</label>
                            <div className="flex gap-4">
                              {[{ value: "BAIXA", label: "Baixa", icon: "🔵" }, { value: "MEDIA", label: "Média", icon: "🟡" }, { value: "ALTA", label: "Alta", icon: "🔴" }].map(({ value, label, icon }) => (
                                <label key={value} className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="prioridade" value={value} checked={formData.prioridade === value} onChange={(e) => handleInputChange("prioridade", e.target.value)} className="sr-only" />
                                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${formData.prioridade === value ? "border-pink-500 bg-pink-500/20 text-white" : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"}`}>
                                    <span>{icon}</span>
                                    <span className="text-sm font-medium">{label}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Coluna Direita */}
                        <div className="space-y-6">
                           {/* Tipo de Destino */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Enviar Para *</label>
                            <select
                              value={formData.tipoDestino}
                              onChange={(e) => handleInputChange("tipoDestino", e.target.value)}
                              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                            >
                              <option value="TODAS_FRANQUIAS">Todas as Franquias</option>
                              <option value="FRANQUIAS_ESPECIFICAS">Franquias Específicas</option>
                              <option value="FRANQUEADORA">Apenas Franqueadora</option>
                            </select>
                          </div>

                          {/* Checkbox Apenas Franqueados */}
                          {(formData.tipoDestino === 'TODAS_FRANQUIAS' || formData.tipoDestino === 'FRANQUIAS_ESPECIFICAS') && (
                            <div className="flex items-center">
                              <input type="checkbox" id="apenasFranqueados" checked={formData.apenasFranqueados} onChange={(e) => handleInputChange("apenasFranqueados", e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-500" />
                              <label htmlFor="apenasFranqueados" className="ml-3 block text-sm font-medium text-gray-300">Visível apenas para usuários com perfil "Franqueado"</label>
                            </div>
                          )}

                          {/* Campo de busca de Destinatários */}
                          {formData.tipoDestino === 'FRANQUIAS_ESPECIFICAS' && (
                            <div>
                               <label className="block text-sm font-medium text-gray-300 mb-2">Selecione as Franquias *</label>
                                {formData.destinatarios.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.destinatarios.map((dest) => (
                                      <span key={dest.id} className="inline-flex items-center gap-2 px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">
                                        <Users size={14} />
                                        {dest.nome}
                                        <button type="button" onClick={() => removeDestinatario(dest.id)} className="hover:text-pink-100"><X size={14} /></button>
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <div className="relative">
                                  <input type="text" value={destinatarioSearch} onChange={(e) => setDestinatarioSearch(e.target.value)} placeholder="Buscar franquias..." className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors" />
                                  {destinatarioSearch && filteredDestinatarios.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                      {filteredDestinatarios.map((dest) => (
                                        <button key={dest.id} type="button" onClick={() => addDestinatario(dest)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 text-left transition-colors">
                                          <Users size={16} className="text-blue-400" />
                                          <p className="text-white text-sm">{dest.nome}</p>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Editor de Conteúdo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo *</label>
                        <RichTextEditor content={formData.conteudo} onChange={(content) => handleInputChange("conteudo", content)} />
                      </div>

                      {/* Anexos */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Anexos</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label htmlFor="anexos-input" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
                            <Upload size={16} />
                            Adicionar Anexos
                          </label>
                          <input
                            id="anexos-input"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-400">Todos os tipos de arquivos são aceitos.</p>
                        </div>

                        {formData.anexos.length > 0 && (
                          <ul className="divide-y divide-gray-700 rounded-lg border border-gray-700 overflow-hidden">
                            {formData.anexos.map((file, index) => (
                              <li key={index} className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                <div className="min-w-0 mr-3">
                                  <p className="text-sm text-white truncate">{file.name}</p>
                                  <p className="text-xs text-gray-400">{Math.ceil(file.size / 1024)} KB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                  aria-label="Remover arquivo"
                                >
                                  <X size={16} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                           <AlertCircle size={16} className="text-red-400" />
                           <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Botões de Ação */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">Cancelar</button>
                        <button type="button" onClick={() => handleSubmit('RASCUNHO')} disabled={loading || !formData.titulo} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                           {loading ? "Salvando..." : "Salvar Rascunho"}
                        </button>
                        <button type="button" onClick={() => handleSubmit('PENDENTE_APROVACAO')} disabled={loading || !formData.titulo || !formData.conteudo || (formData.tipoDestino === 'FRANQUIAS_ESPECIFICAS' && formData.destinatarios.length === 0)} className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                           {loading ? "Enviando..." : (isEditMode ? "Salvar e Enviar p/ Aprovação" : "Enviar para Aprovação")}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}