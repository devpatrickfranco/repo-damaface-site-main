'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { QUESTIONS } from '../mocks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Save, Settings } from 'lucide-react'

export default function AutoAvaliacaoPage() {
    const { user } = useAuth()
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    // Mock Date Logic
    const nextAnalysisDate = '15/11/2023'
    const isWindowOpen = true

    const handleOptionChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleSubmit = () => {
        // Mock submission logic
        console.log('Submitting answers:', answers)
        setSubmitted(true)
    }

    if (!user) return null

    // SUPERADMIN VIEW: Configuração
    if (user.role === 'SUPERADMIN') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Configuração da Auto Avaliação</h1>
                    <button className="bg-brand-pink text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-pink/80 transition-colors">
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                    </button>
                </div>

                <div className="grid gap-4">
                    {QUESTIONS.map((q) => (
                        <Card key={q.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{q.text}</p>
                                    <div className="flex gap-3 mt-2 text-sm text-gray-400">
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Peso: {q.weight}</span>
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Categoria: {q.category}</span>
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Role: {q.role}</span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // FRANQUEADO VIEW: Formulário
    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="bg-green-500/20 p-4 rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Avaliação Enviada com Sucesso!</h2>
                <p className="text-gray-400 max-w-md">
                    Sua auto avaliação foi registrada. Nossa equipe fará a auditoria em breve.
                    Acompanhe o ranking para ver sua pontuação atualizada.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand-pink hover:underline mt-4"
                >
                    Voltar (Debug: Resetar)
                </button>
            </div>
        )
    }

    const filteredQuestions = QUESTIONS.filter(q => q.role === user.role || q.role === 'FRANQUEADO') // Fallback to Franqueado if specific role logic is loose

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Auto Avaliação</h1>
                    <p className="text-gray-400 mt-1">
                        Responda o questionário referente ao trimestre atual.
                    </p>
                </div>
                <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-3">
                    <AlertCircle className="text-yellow-500 w-5 h-5" />
                    <span className="text-sm">
                        <span className="text-gray-400">Próxima Análise:</span> <strong className="text-white">{nextAnalysisDate}</strong>
                    </span>
                </div>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 space-y-8">
                    {filteredQuestions.map((q, index) => (
                        <div key={q.id} className="space-y-3 pb-6 border-b border-gray-800 last:border-0">
                            <div className="flex items-start justify-between gap-4">
                                <span className="text-brand-pink font-bold text-lg">#{index + 1}</span>
                                <p className="text-lg text-white flex-1">{q.text}</p>
                                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">Peso: {q.weight}</span>
                            </div>

                            <div className="flex gap-4 pl-10">
                                {['Sim', 'Parcialmente', 'Não'].map((option) => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                      ${answers[q.id] === option
                                                ? 'border-brand-pink bg-brand-pink/20'
                                                : 'border-gray-600 group-hover:border-gray-400'}
                    `}>
                                            {answers[q.id] === option && <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={option}
                                            className="hidden"
                                            onChange={() => handleOptionChange(q.id, option)}
                                        />
                                        <span className={`${answers[q.id] === option ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-brand-pink hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-pink-900/20 transform hover:-translate-y-1"
                >
                    Enviar Avaliação
                </button>
            </div>
        </div>
    )
}
