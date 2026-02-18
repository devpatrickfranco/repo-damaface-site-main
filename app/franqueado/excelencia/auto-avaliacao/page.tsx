'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Save, Settings, Loader2 } from 'lucide-react'
import { excelenciaApi } from '../api'
import { Question, AnswerInput } from '../types'
import { toast } from 'sonner' // Assuming sonner is used, or alert/console

export default function AutoAvaliacaoPage() {
    const { user } = useAuth()
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState<Record<number, number>>({}) // questionId -> value
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Mock Date Logic - in a real app this might come from backend config or current date
    const nextAnalysisDate = '15/11/2023' // TODO: Get from backend if available

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await excelenciaApi.getQuestions()
                setQuestions(data)
            } catch (error) {
                console.error("Failed to fetch questions:", error)
                toast.error("Erro ao carregar perguntas.")
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchQuestions()
        }
    }, [user])

    const handleOptionChange = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleSubmit = async () => {
        // Validate if all questions are answered (optional, but good UX)
        // For now, we allow partial answers or assume user answers all?
        // Let's validate:
        const answeredIds = Object.keys(answers).map(Number);
        const filteredQuestions = questions.filter(q => q.target_role === user?.role || q.target_role === 'FRANQUEADO')

        // Simple validation: check if number of answers matches filtered questions
        // Note: This logic might need refinement if not all questions are mandatory.

        setSubmitting(true)
        try {
            const payloadItems: AnswerInput[] = Object.entries(answers).map(([qId, val]) => ({
                question: Number(qId),
                value: val
            }))

            await excelenciaApi.createSubmission({ answers: payloadItems })
            setSubmitted(true)
            toast.success("Avaliação enviada com sucesso!")
        } catch (error) {
            console.error("Error submitting evaluation:", error)
            toast.error("Erro ao enviar avaliação.")
        } finally {
            setSubmitting(false)
        }
    }

    if (!user) return null

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-brand-pink" /></div>
    }

    // SUPERADMIN VIEW: Configuração (Read-only for now based on previous code, simplified)
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
                    {questions.map((q) => (
                        <Card key={q.id} className="bg-gray-800 border-gray-700">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{q.text}</p>
                                    <div className="flex gap-3 mt-2 text-sm text-gray-400">
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Peso: {q.weight}</span>
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Categoria: {q.category}</span>
                                        <span className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">Role: {q.target_role}</span>
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
                    onClick={() => {
                        setSubmitted(false);
                        setAnswers({});
                        // Optionally re-fetch questions or reset state
                    }}
                    className="text-brand-pink hover:underline mt-4"
                >
                    Nova Avaliação (Debug: Resetar)
                </button>
            </div>
        )
    }

    // Filter questions based on role. Fallback to FRANQUEADO if role matches or if strictly meant for everyone?
    // The previous code had `q.role === user.role || q.role === 'FRANQUEADO'`.
    const filteredQuestions = questions.filter(q => q.target_role === user.role || q.target_role === 'FRANQUEADO')

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
                    {filteredQuestions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Nenhuma pergunta encontrada para o seu perfil.</p>
                    ) : (
                        filteredQuestions.map((q, index) => (
                            <div key={q.id} className="space-y-3 pb-6 border-b border-gray-800 last:border-0">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-brand-pink font-bold text-lg">#{index + 1}</span>
                                    <p className="text-lg text-white flex-1">{q.text}</p>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">Peso: {q.weight}</span>
                                </div>

                                <div className="flex gap-4 pl-10">
                                    {[
                                        { label: 'Sim', value: 1.0 },
                                        { label: 'Parcialmente', value: 0.5 },
                                        { label: 'Não', value: 0.0 }
                                    ].map((option) => (
                                        <label key={option.label} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                ${answers[q.id] === option.value
                                                    ? 'border-brand-pink bg-brand-pink/20'
                                                    : 'border-gray-600 group-hover:border-gray-400'}
                                            `}>
                                                {answers[q.id] === option.value && <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name={String(q.id)}
                                                value={option.value}
                                                className="hidden"
                                                checked={answers[q.id] === option.value}
                                                onChange={() => handleOptionChange(q.id, option.value)}
                                            />
                                            <span className={`${answers[q.id] === option.value ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || filteredQuestions.length === 0}
                    className="bg-brand-pink hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-pink-900/20 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {submitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Enviando...
                        </div>
                    ) : (
                        "Enviar Avaliação"
                    )}
                </button>
            </div>
        </div>
    )
}

