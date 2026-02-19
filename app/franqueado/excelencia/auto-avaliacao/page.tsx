'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminQuestions } from '../components/AdminQuestions'
import { excelenciaApi } from '../api'
import type { Question, Category, AnswerOption, QuestionType } from '../types'

// ─── Answer Input Components ────────────────────────────────────────────────

function RadioGroup({
    name,
    options,
    value,
    onChange,
}: {
    name: string
    options: { label: string; value: number; color?: AnswerOption['color'] }[]
    value: number | undefined
    onChange: (v: number) => void
}) {
    const dotColor: Record<string, string> = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        gray: 'bg-gray-500',
    }
    const ringColor: Record<string, string> = {
        green: 'border-green-500 bg-green-500/20',
        yellow: 'border-yellow-500 bg-yellow-500/20',
        red: 'border-red-500 bg-red-500/20',
        blue: 'border-blue-500 bg-blue-500/20',
        gray: 'border-gray-500 bg-gray-500/20',
    }

    return (
        <div className="flex gap-4 pl-10 flex-wrap">
            {options.map(opt => {
                const selected = value === opt.value
                const color = opt.color ?? 'gray'
                return (
                    <label key={`${name}-${opt.label}`} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selected ? ringColor[color] : 'border-gray-600 group-hover:border-gray-400'}`}>
                            {selected && <div className={`w-2.5 h-2.5 rounded-full ${dotColor[color]}`} />}
                        </div>
                        <input type="radio" name={name} className="hidden" checked={selected} onChange={() => onChange(opt.value)} />
                        <span className={`text-sm ${selected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>{opt.label}</span>
                    </label>
                )
            })}
        </div>
    )
}

function YesNoAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    return (
        <RadioGroup
            name={String(question.id)}
            options={[
                { label: 'Sim', value: 1.0, color: 'green' },
                { label: 'Não', value: 0.0, color: 'red' },
            ]}
            value={value}
            onChange={onChange}
        />
    )
}

function YesPartialNoAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    return (
        <RadioGroup
            name={String(question.id)}
            options={[
                { label: 'Sim', value: 1.0, color: 'green' },
                { label: 'Parcialmente', value: 0.5, color: 'yellow' },
                { label: 'Não', value: 0.0, color: 'red' },
            ]}
            value={value}
            onChange={onChange}
        />
    )
}

function NPSAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    const scores = Array.from({ length: 11 }, (_, i) => i)

    const getStyle = (score: number, selected: boolean) => {
        const base = 'w-9 h-9 rounded-lg border text-sm font-bold transition-all '
        if (selected) {
            if (score <= 6) return base + 'bg-red-500 border-red-500 text-white scale-110'
            if (score <= 8) return base + 'bg-yellow-500 border-yellow-500 text-white scale-110'
            return base + 'bg-green-500 border-green-500 text-white scale-110'
        }
        if (score <= 6) return base + 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
        if (score <= 8) return base + 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
        return base + 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
    }

    return (
        <div className="pl-10 space-y-2">
            <div className="flex gap-1.5 flex-wrap">
                {scores.map(score => (
                    <button key={score} type="button" onClick={() => onChange(score)} className={getStyle(score, value === score)}>
                        {score}
                    </button>
                ))}
            </div>
            <div className="flex gap-12 text-xs text-gray-500">
                <span>😞 Detrator (0–6)</span>
                <span>😐 Passivo (7–8)</span>
                <span>😊 Promotor (9–10)</span>
            </div>
        </div>
    )
}

function NumericAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    return (
        <div className="pl-10 flex items-center gap-3">
            <input
                type="number"
                min={question.numeric_min ?? undefined}
                max={question.numeric_max ?? undefined}
                step="any"
                value={value ?? ''}
                onChange={e => onChange(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm w-44 focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                placeholder={question.numeric_min !== null && question.numeric_max !== null ? `${question.numeric_min} – ${question.numeric_max}` : 'Insira o valor'}
            />
            {question.numeric_unit && <span className="text-gray-400 text-sm font-medium">{question.numeric_unit}</span>}
            {question.numeric_min !== null && question.numeric_max !== null && (
                <span className="text-gray-600 text-xs">intervalo: {question.numeric_min} a {question.numeric_max}</span>
            )}
        </div>
    )
}

function PercentageAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    const pct = value ?? 0

    const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'

    return (
        <div className="pl-10 space-y-3 max-w-sm">
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={question.numeric_min ?? 0}
                    max={question.numeric_max ?? 100}
                    step={1}
                    value={pct}
                    onChange={e => onChange(Number(e.target.value))}
                    className="flex-1 accent-brand-pink"
                />
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 w-16 text-center">
                    <span className="font-bold text-white text-sm">{pct}</span>
                    <span className="text-gray-400 text-xs">%</span>
                </div>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

function CustomAnswer({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    const options = question.custom_options ?? []
    return (
        <RadioGroup
            name={String(question.id)}
            options={options.map(o => ({ label: o.label, value: o.value, color: o.color }))}
            value={value}
            onChange={onChange}
        />
    )
}

function QuestionAnswerInput({ question, value, onChange }: { question: Question; value: number | undefined; onChange: (v: number) => void }) {
    switch (question.question_type) {
        case 'YES_NO': return <YesNoAnswer question={question} value={value} onChange={onChange} />
        case 'YES_PARTIAL_NO': return <YesPartialNoAnswer question={question} value={value} onChange={onChange} />
        case 'NPS': return <NPSAnswer question={question} value={value} onChange={onChange} />
        case 'NUMERIC': return <NumericAnswer question={question} value={value} onChange={onChange} />
        case 'PERCENTAGE': return <PercentageAnswer question={question} value={value} onChange={onChange} />
        case 'CUSTOM': return <CustomAnswer question={question} value={value} onChange={onChange} />
        default: return <YesPartialNoAnswer question={question} value={value} onChange={onChange} />
    }
}

// ─── Type badge ─────────────────────────────────────────────────────────────

const TYPE_PILL: Record<QuestionType, { label: string; className: string }> = {
    YES_NO: { label: 'Sim/Não', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
    YES_PARTIAL_NO: { label: 'Objetiva', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    NPS: { label: 'NPS', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    NUMERIC: { label: 'Numérico', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    PERCENTAGE: { label: 'Percentual', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    CUSTOM: { label: 'Personalizado', className: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AutoAvaliacaoPage() {
    const { user } = useAuth()
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)

    const [questions, setQuestions] = useState<Question[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const CATEGORY_COLOR_MAP: Record<string, string> = {
        pink: 'bg-pink-500', blue: 'bg-blue-500', green: 'bg-green-500',
        yellow: 'bg-yellow-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
        teal: 'bg-teal-500', red: 'bg-red-500',
    }

    // TODO: Fetch real date from backend if available
    const nextAnalysisDate = '15/11/2026'

    useEffect(() => {
        const loadData = async () => {
            // Only load for FRANQUEADO or user's role
            const role = user?.role === 'FRANQUEADO' ? 'FRANQUEADO' : 'FUNCIONARIO'

            try {
                // Fetch categories and questions
                const [cats, qs] = await Promise.all([
                    excelenciaApi.getCategories(),
                    excelenciaApi.getQuestions({ target_role: role, is_active: true })
                ])
                setCategories(cats || [])
                setQuestions(qs || [])
            } catch (error) {
                console.error('Failed to load evaluation data', error)
                toast.error('Erro ao carregar questionário.')
            } finally {
                setLoading(false)
            }
        }

        if (user && user.role !== 'SUPERADMIN') {
            loadData()
        }
    }, [user])

    const handleChange = (questionId: number, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const payload = {
                answers: Object.entries(answers).map(([qId, val]) => ({
                    question: Number(qId),
                    value: val
                }))
            }

            await excelenciaApi.createSubmission(payload)

            setSubmitted(true)
            toast.success('Avaliação enviada com sucesso!')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao enviar avaliação.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!user) return null

    if (user.role === 'SUPERADMIN') return <AdminQuestions />

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
            </div>
        )
    }

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
                <button onClick={() => { setSubmitted(false); setAnswers({}) }} className="text-brand-pink hover:underline mt-4 text-sm">
                    Iniciar nova avaliação
                </button>
            </div>
        )
    }

    const answeredCount = Object.keys(answers).length
    const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

    // Group by category
    const grouped = categories
        .map(cat => ({
            category: cat,
            questions: questions.filter(q => q.category === cat.id),
        }))
        .filter(g => g.questions.length > 0)

    const ungrouped = questions.filter(q => !categories.find(c => c.id === q.category))

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Auto Avaliação</h1>
                    <p className="text-gray-400 mt-1">Responda o questionário referente ao trimestre atual.</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-3">
                    <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">
                        <span className="text-gray-400">Próxima Análise:</span>{' '}
                        <strong className="text-white">{nextAnalysisDate}</strong>
                    </span>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progresso do formulário</span>
                    <span className={`font-semibold ${progress === 100 ? 'text-green-400' : 'text-white'}`}>
                        {answeredCount}/{questions.length} respondidas ({progress}%)
                    </span>
                </div>
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-brand-pink'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {questions.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-8 text-center text-gray-400">
                        Nenhuma pergunta encontrada para o seu perfil. Aguarde a configuração pelo administrador.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {grouped.map(({ category, questions: qs }, gIndex) => {
                        const colorClass = CATEGORY_COLOR_MAP[category.color] ?? 'bg-gray-500'
                        const catAnswered = qs.filter(q => answers[q.id] !== undefined).length
                        return (
                            <div key={category.id} className="space-y-2">
                                {/* Category label */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                                    <h2 className="text-base font-bold text-white">{category.name}</h2>
                                    <span className="text-xs font-bold text-brand-pink">{category.weight_percent}%</span>
                                    <div className="flex-1 h-px bg-gray-800" />
                                    <span className="text-xs text-gray-500">{catAnswered}/{qs.length}</span>
                                </div>

                                <Card className="bg-gray-900 border-gray-800">
                                    <CardContent className="p-6 space-y-8">
                                        {qs.map((q, qIndex) => {
                                            const badge = TYPE_PILL[q.question_type]
                                            const isAnswered = answers[q.id] !== undefined
                                            return (
                                                <div key={q.id} className={`space-y-3 pb-7 border-b border-gray-800 last:border-0 last:pb-0 ${isAnswered ? '' : ''}`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${isAnswered ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                                            {isAnswered ? '✓' : qIndex + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-base text-white leading-snug">{q.text}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>{badge.label}</span>
                                                            <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">
                                                                {q.weight}pts
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <QuestionAnswerInput
                                                        question={q}
                                                        value={answers[q.id]}
                                                        onChange={v => handleChange(q.id, v)}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}

                    {ungrouped.length > 0 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6 space-y-8">
                                {ungrouped.map((q, index) => {
                                    const badge = TYPE_PILL[q.question_type]
                                    const isAnswered = answers[q.id] !== undefined
                                    return (
                                        <div key={q.id} className="space-y-3 pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${isAnswered ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                                    {isAnswered ? '✓' : index + 1}
                                                </div>
                                                <p className="text-base text-white flex-1">{q.text}</p>
                                                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>{badge.label}</span>
                                            </div>
                                            <QuestionAnswerInput question={q} value={answers[q.id]} onChange={v => handleChange(q.id, v)} />
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Submit */}
            {questions.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                    {progress < 100 && (
                        <p className="text-sm text-gray-500">
                            {questions.length - answeredCount} pergunta(s) ainda não respondida(s)
                        </p>
                    )}
                    <div className="ml-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || answeredCount === 0}
                            className="bg-brand-pink hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-pink-900/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                    Enviando...
                                </span>
                            ) : (
                                'Enviar Avaliação'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
