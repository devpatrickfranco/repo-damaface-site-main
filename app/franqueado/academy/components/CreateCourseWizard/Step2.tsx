"use client"

// components/CreateCourseWizard/Step2.tsx
import type React from "react"
import { Trash2, PlusCircle, CheckCircle } from "lucide-react"

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
    perguntas,
    currentPergunta,
    setCurrentPergunta,
    handleAddPergunta,
    handleRemovePergunta,
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
        <h3 className="text-lg font-semibold text-white mb-3">2. Criar Quiz do Curso (Opcional)</h3>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Título do Quiz (Ex: Teste Final de Conhecimentos)"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
        />
        {/* Formulário para adicionar uma nova pergunta */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 space-y-4">
          <h4 className="font-semibold text-white">Adicionar nova pergunta</h4>
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
          <button
            onClick={handleAddPergunta}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            Adicionar Pergunta à Lista
          </button>
        </div>

        {/* Lista de Perguntas Adicionadas */}
        <div className="mt-6 space-y-3">
          {perguntas.length > 0 && <h4 className="font-semibold text-white">Perguntas do Quiz:</h4>}
          {perguntas.map((p, pIndex) => (
            <div key={p.id} className="bg-gray-800 p-4 rounded-lg animate-fade-in">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-200">
                  {pIndex + 1}. {p.texto}
                </p>
                <button onClick={() => handleRemovePergunta(p.id)} className="text-red-400 hover:text-red-300 ml-4">
                  <Trash2 size={16} />
                </button>
              </div>
              <ul className="mt-2 space-y-1 pl-4">
                {p.opcoes.map((opt) => (
                  <li
                    key={opt.id}
                    className={`flex items-center gap-2 text-sm ${opt.id === p.respostaCorretaId ? "text-green-400 font-bold" : "text-gray-400"}`}
                  >
                    {opt.id === p.respostaCorretaId && <CheckCircle size={14} />}
                    <span>{opt.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Step2
