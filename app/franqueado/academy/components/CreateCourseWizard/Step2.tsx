"use client"

// components/CreateCourseWizard/Step2.tsx
import type React from "react"
import { Trash2, PlusCircle, CheckCircle, Edit2, X, ChevronUp, ChevronDown, Save } from "lucide-react"

import type { useCourseWizard } from "@/hooks/useCourseWizard"

interface Step2Props {
  wizard: ReturnType<typeof useCourseWizard>
}

const Step2: React.FC<Step2Props> = ({ wizard }) => {
  const {
    modulos,
    currentModuloName,
    setCurrentModuloName,
    handleAddModulo,
    handleRemoveModulo,
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
    handleDeleteQuiz,
  } = wizard

  const handleOptionChange = (index: number, value: string) => {
    const updatedOpcoes = [...currentPergunta.opcoes]
    updatedOpcoes[index] = { texto: value }
    setCurrentPergunta((prev) => ({ ...prev, opcoes: updatedOpcoes }))
  }

  const handleCorrectAnswerChange = (index: number) => {
    setCurrentPergunta((prev) => ({ ...prev, respostaCorretaIndex: index }))
  }

  return (
    <div className="space-y-8">
      {/* Seção para adicionar Módulos */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">1. Adicionar Módulos do Curso</h3>
        <p className="text-sm text-gray-400 mb-4">
          Crie as seções que organizarão suas aulas. Ex: "Introdução", "Módulo Avançado".
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={currentModuloName}
            onChange={(e) => setCurrentModuloName(e.target.value)}
            placeholder="Nome do novo módulo"
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <button
            onClick={handleAddModulo}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Adicionar</span>
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {modulos.length > 0 ? (
            modulos.map((m, index) => (
              <div
                key={m.id}
                className="bg-gray-700/50 p-3 rounded-lg text-white flex justify-between items-center animate-fade-in"
              >
                <span>
                  {index + 1}. {m.titulo}
                </span>
                <button onClick={() => handleRemoveModulo(m.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-2">Nenhum módulo adicionado ainda.</p>
          )}
        </div>
      </div>

      {/* Seção para adicionar Quiz */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">
            2. {quizId ? "Editar Quiz do Curso" : "Criar Quiz do Curso"} (Opcional)
          </h3>
          <div className="flex items-center gap-2">
            {quizId && (
              <>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  Quiz ID: {quizId}
                </span>
                {handleDeleteQuiz && (
                  <button
                    onClick={handleDeleteQuiz}
                    className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                    title="Deletar quiz"
                  >
                    Deletar Quiz
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4 mb-4">
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Título do Quiz (Ex: Teste Final de Conhecimentos)"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nota Mínima de Aprovação (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={notaMinima}
                onChange={(e) => setNotaMinima(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tentativas Máximas</label>
              <input
                type="number"
                min="1"
                max="10"
                value={tentativasMaximas}
                onChange={(e) => setTentativasMaximas(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
        {/* Formulário para adicionar/editar uma pergunta */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 space-y-4">
          <h4 className="font-semibold text-white">
            {editingPerguntaId ? "Editar pergunta" : "Adicionar nova pergunta"}
          </h4>
          <textarea
            value={currentPergunta.texto}
            onChange={(e) => setCurrentPergunta((prev) => ({ ...prev, texto: e.target.value }))}
            placeholder="Digite o texto da pergunta aqui..."
            rows={2}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
          />
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Adicione as opções e marque a resposta correta:</p>
            {currentPergunta.opcoes.map((opcao, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentPergunta.respostaCorretaIndex === index}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="form-radio h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 focus:ring-pink-500"
                />
                <input
                  type="text"
                  value={opcao.texto}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {editingPerguntaId ? (
              <>
                <button
                  onClick={handleUpdatePergunta}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
                <button
                  onClick={handleCancelEditPergunta}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={handleAddPergunta}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Adicionar Pergunta à Lista
              </button>
            )}
          </div>
        </div>

        {/* Lista de Perguntas Adicionadas */}
        <div className="mt-6 space-y-3">
          {perguntas.length > 0 && <h4 className="font-semibold text-white">Perguntas do Quiz ({perguntas.length}):</h4>}
          {perguntas.map((p, pIndex) => (
            <div 
              key={p.id} 
              className={`bg-gray-800 p-4 rounded-lg animate-fade-in border-2 ${
                editingPerguntaId === p.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-bold text-pink-400 min-w-[24px]">{pIndex + 1}.</span>
                  <p className="font-semibold text-gray-200 flex-1">{p.texto}</p>
                </div>
                <div className="flex items-center gap-1">
                  {/* Botões de reordenar */}
                  {perguntas.length > 1 && (
                    <>
                      <button
                        onClick={() => handleReorderPergunta(pIndex, Math.max(0, pIndex - 1))}
                        disabled={pIndex === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
                        title="Mover para cima"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleReorderPergunta(pIndex, Math.min(perguntas.length - 1, pIndex + 1))}
                        disabled={pIndex === perguntas.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
                        title="Mover para baixo"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </>
                  )}
                  {/* Botão editar */}
                  <button
                    onClick={() => handleEditPergunta(p.id)}
                    disabled={editingPerguntaId !== null && editingPerguntaId !== p.id}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                    title="Editar pergunta"
                  >
                    <Edit2 size={16} />
                  </button>
                  {/* Botão remover */}
                  <button
                    onClick={() => handleRemovePergunta(p.id)}
                    disabled={editingPerguntaId !== null}
                    className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                    title="Remover pergunta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <ul className="mt-2 space-y-1 pl-6">
                {p.opcoes.map((opt) => (
                  <li
                    key={opt.id}
                    className={`flex items-center gap-2 text-sm ${
                      opt.correta ? "text-green-400 font-bold" : "text-gray-400"
                    }`}
                  >
                    {opt.correta && <CheckCircle size={14} />}
                    <span>{opt.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {perguntas.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Nenhuma pergunta adicionada ainda. Use o formulário acima para adicionar perguntas ao quiz.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2
