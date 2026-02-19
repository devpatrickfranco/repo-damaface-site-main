'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Loader2, Plus, Pencil, Trash2, Save, Tag, HelpCircle,
    ToggleLeft, Hash, Star, BarChart2, BookTemplate, X, GripVertical,
    ChevronDown, ChevronUp, Check, Copy, Bookmark
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ─────────────────────────────────────────────────────────────────

export type QuestionType = 'YES_NO' | 'YES_PARTIAL_NO' | 'NPS' | 'NUMERIC' | 'PERCENTAGE' | 'CUSTOM'

export interface AnswerOption {
    id: string
    label: string
    value: number
    color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
}

export interface AnswerTemplate {
    id: string
    name: string
    options: AnswerOption[]
    createdAt: string
}

export interface Category {
    id: string
    name: string
    description: string
    weightPercent: number
    color: string
    createdAt: string
}

export interface Question {
    id: string
    text: string
    categoryId: string
    questionType: QuestionType
    weight: number
    targetRole: 'FRANQUEADO' | 'FUNCIONARIO' | 'ADMIN'
    isActive: boolean
    // For NUMERIC
    numericMin?: number
    numericMax?: number
    numericUnit?: string
    // For CUSTOM
    customTemplateId?: string
    customOptions?: AnswerOption[]
    createdAt: string
}

// ─── Constants ──────────────────────────────────────────────────────────────

export const QUESTION_TYPES: { value: QuestionType; label: string; description: string; icon: React.ReactNode }[] = [
    { value: 'YES_NO', label: 'Sim / Não', description: 'Resposta binária', icon: <ToggleLeft className="w-4 h-4" /> },
    { value: 'YES_PARTIAL_NO', label: 'Sim / Parcialmente / Não', description: 'Resposta com opção intermediária', icon: <ToggleLeft className="w-4 h-4" /> },
    { value: 'NPS', label: 'NPS (0–10)', description: 'Escala Net Promoter Score', icon: <Star className="w-4 h-4" /> },
    { value: 'NUMERIC', label: 'Numérico', description: 'Valor numérico com intervalo opcional', icon: <Hash className="w-4 h-4" /> },
    { value: 'PERCENTAGE', label: 'Percentual (%)', description: 'Valor de 0% a 100%', icon: <BarChart2 className="w-4 h-4" /> },
    { value: 'CUSTOM', label: 'Personalizado', description: 'Opções customizadas com valores próprios', icon: <BookTemplate className="w-4 h-4" /> },
]

const TYPE_BADGE: Record<QuestionType, { label: string; className: string }> = {
    YES_NO: { label: 'Sim/Não', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    YES_PARTIAL_NO: { label: 'Sim/Parc./Não', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    NPS: { label: 'NPS', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    NUMERIC: { label: 'Numérico', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    PERCENTAGE: { label: 'Percentual', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    CUSTOM: { label: 'Personalizado', className: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
}

const CATEGORY_COLORS = [
    { value: 'pink', label: 'Rosa', class: 'bg-pink-500' },
    { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
    { value: 'green', label: 'Verde', class: 'bg-green-500' },
    { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
    { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
    { value: 'orange', label: 'Laranja', class: 'bg-orange-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
    { value: 'red', label: 'Vermelho', class: 'bg-red-500' },
]

const OPTION_COLORS: { value: AnswerOption['color']; label: string; dot: string; text: string }[] = [
    { value: 'green', label: 'Verde', dot: 'bg-green-500', text: 'text-green-400' },
    { value: 'yellow', label: 'Amarelo', dot: 'bg-yellow-500', text: 'text-yellow-400' },
    { value: 'red', label: 'Vermelho', dot: 'bg-red-500', text: 'text-red-400' },
    { value: 'blue', label: 'Azul', dot: 'bg-blue-500', text: 'text-blue-400' },
    { value: 'gray', label: 'Cinza', dot: 'bg-gray-500', text: 'text-gray-400' },
]

// ─── Local Storage Helpers ──────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key)
            return stored ? JSON.parse(stored) : initial
        } catch {
            return initial
        }
    })

    const set = useCallback((val: T | ((prev: T) => T)) => {
        setValue(prev => {
            const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val
            localStorage.setItem(key, JSON.stringify(next))
            return next
        })
    }, [key])

    return [value, set] as const
}

function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// ─── Answer Templates Tab ───────────────────────────────────────────────────

function AnswerTemplatesTab({
    templates,
    setTemplates,
}: {
    templates: AnswerTemplate[]
    setTemplates: (fn: (prev: AnswerTemplate[]) => AnswerTemplate[]) => void
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [options, setOptions] = useState<AnswerOption[]>([
        { id: uid(), label: '', value: 1, color: 'green' },
    ])

    const openNew = () => {
        setEditingId(null)
        setName('')
        setOptions([{ id: uid(), label: '', value: 1, color: 'green' }])
        setIsDialogOpen(true)
    }

    const openEdit = (t: AnswerTemplate) => {
        setEditingId(t.id)
        setName(t.name)
        setOptions(t.options.map(o => ({ ...o })))
        setIsDialogOpen(true)
    }

    const addOption = () => {
        setOptions(prev => [...prev, { id: uid(), label: '', value: 0, color: 'gray' }])
    }

    const removeOption = (id: string) => {
        setOptions(prev => prev.filter(o => o.id !== id))
    }

    const updateOption = (id: string, field: keyof AnswerOption, value: any) => {
        setOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
    }

    const handleSave = () => {
        if (!name.trim()) { toast.error('Nome do modelo é obrigatório.'); return }
        if (options.some(o => !o.label.trim())) { toast.error('Todas as opções precisam ter um rótulo.'); return }

        if (editingId) {
            setTemplates(prev => prev.map(t => t.id === editingId ? { ...t, name, options } : t))
            toast.success('Modelo atualizado!')
        } else {
            const newTemplate: AnswerTemplate = { id: uid(), name, options, createdAt: new Date().toISOString() }
            setTemplates(prev => [...prev, newTemplate])
            toast.success('Modelo criado!')
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        if (!confirm('Excluir este modelo?')) return
        setTemplates(prev => prev.filter(t => t.id !== id))
        toast.success('Modelo excluído!')
    }

    const handleDuplicate = (t: AnswerTemplate) => {
        const copy: AnswerTemplate = {
            ...t,
            id: uid(),
            name: `${t.name} (cópia)`,
            createdAt: new Date().toISOString(),
        }
        setTemplates(prev => [...prev, copy])
        toast.success('Modelo duplicado!')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    Crie modelos de respostas reutilizáveis para perguntas personalizadas.
                </p>
                <Button onClick={openNew} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Novo Modelo
                </Button>
            </div>

            {/* Pre-built system templates info */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Modelos do Sistema (embutidos)</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { name: 'Sim / Não', options: ['Sim (1.0)', 'Não (0.0)'] },
                        { name: 'Sim / Parcialmente / Não', options: ['Sim (1.0)', 'Parcialmente (0.5)', 'Não (0.0)'] },
                        { name: 'NPS 0–10', options: ['Escala numérica'] },
                        { name: 'Numérico', options: ['Valor livre'] },
                        { name: 'Percentual', options: ['0% a 100%'] },
                    ].map(m => (
                        <div key={m.name} className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2">
                            <p className="text-xs font-medium text-gray-300">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.options.join(' • ')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom templates */}
            {templates.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="py-12 text-center">
                        <BookTemplate className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhum modelo personalizado criado ainda.</p>
                        <p className="text-gray-600 text-sm mt-1">Crie modelos para reutilizar em perguntas do tipo "Personalizado".</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(t => (
                        <Card key={t.id} className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="w-4 h-4 text-brand-pink flex-shrink-0" />
                                        <span className="font-medium text-white">{t.name}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-700" onClick={() => handleDuplicate(t)}>
                                            <Copy className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => openEdit(t)}>
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(t.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {t.options.map(o => {
                                        const colorCfg = OPTION_COLORS.find(c => c.value === o.color)
                                        return (
                                            <div key={o.id} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-md px-2 py-1">
                                                <div className={`w-2 h-2 rounded-full ${colorCfg?.dot ?? 'bg-gray-500'}`} />
                                                <span className="text-xs text-gray-300">{o.label}</span>
                                                <span className="text-xs text-gray-500">({o.value})</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookTemplate className="w-5 h-5 text-brand-pink" />
                            {editingId ? 'Editar Modelo' : 'Novo Modelo de Respostas'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nome do Modelo *</Label>
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="bg-gray-800 border-gray-700"
                                placeholder="Ex: Escala de Conformidade"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Opções de Resposta *</Label>
                                <Button size="sm" variant="ghost" onClick={addOption} className="h-7 text-xs text-brand-pink hover:text-pink-400 hover:bg-brand-pink/10 gap-1">
                                    <Plus className="w-3 h-3" /> Adicionar opção
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {options.map((opt, i) => (
                                    <div key={opt.id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-3">
                                        <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div>
                                                <Input
                                                    value={opt.label}
                                                    onChange={e => updateOption(opt.id, 'label', e.target.value)}
                                                    className="bg-gray-700 border-gray-600 h-8 text-sm"
                                                    placeholder={`Rótulo opção ${i + 1}`}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min={0}
                                                    max={10}
                                                    value={opt.value}
                                                    onChange={e => updateOption(opt.id, 'value', Number(e.target.value))}
                                                    className="bg-gray-700 border-gray-600 h-8 text-sm w-20"
                                                    placeholder="Valor"
                                                />
                                                <Select value={opt.color} onValueChange={v => updateOption(opt.id, 'color', v)}>
                                                    <SelectTrigger className="bg-gray-700 border-gray-600 h-8 w-28">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700">
                                                        {OPTION_COLORS.map(c => (
                                                            <SelectItem key={c.value} value={c.value!}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                                                                    <span className="text-xs">{c.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-500/10 flex-shrink-0" onClick={() => removeOption(opt.id)} disabled={options.length <= 1}>
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                O "Valor" é o peso numérico da opção (ex: 1.0 = Sim, 0.5 = Parcialmente, 0.0 = Não).
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</Button>
                        <Button onClick={handleSave} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                            <Save className="w-4 h-4" /> Salvar Modelo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ─── Category Tab ───────────────────────────────────────────────────────────

function CategoryTab({
    categories,
    setCategories,
    questions,
}: {
    categories: Category[]
    setCategories: (fn: (prev: Category[]) => Category[]) => void
    questions: Question[]
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', description: '', weightPercent: 10, color: 'pink' })

    const totalWeight = categories.reduce((s, c) => s + c.weightPercent, 0)

    const openNew = () => {
        setEditingId(null)
        setForm({ name: '', description: '', weightPercent: 10, color: 'pink' })
        setIsDialogOpen(true)
    }

    const openEdit = (c: Category) => {
        setEditingId(c.id)
        setForm({ name: c.name, description: c.description, weightPercent: c.weightPercent, color: c.color })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!form.name.trim()) { toast.error('Nome é obrigatório.'); return }
        if (editingId) {
            setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c))
            toast.success('Categoria atualizada!')
        } else {
            setCategories(prev => [...prev, { id: uid(), ...form, createdAt: new Date().toISOString() }])
            toast.success('Categoria criada!')
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        const hasQuestions = questions.some(q => q.categoryId === id)
        if (hasQuestions) { toast.error('Remova as perguntas desta categoria antes de excluí-la.'); return }
        if (!confirm('Excluir categoria?')) return
        setCategories(prev => prev.filter(c => c.id !== id))
        toast.success('Categoria excluída!')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-400">
                        Peso total:{' '}
                        <span className={`font-bold ${totalWeight === 100 ? 'text-green-400' : 'text-yellow-400'}`}>{totalWeight}%</span>
                        {totalWeight !== 100 && <span className="text-yellow-500 text-xs ml-1">(deve somar 100%)</span>}
                    </p>
                </div>
                <Button onClick={openNew} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Nova Categoria
                </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-transparent">
                                <TableHead className="text-gray-400">Categoria</TableHead>
                                <TableHead className="text-gray-400">Descrição</TableHead>
                                <TableHead className="text-gray-400 text-center">Peso</TableHead>
                                <TableHead className="text-gray-400 text-center">Perguntas</TableHead>
                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map(cat => {
                                const colorCfg = CATEGORY_COLORS.find(c => c.value === cat.color)
                                const qCount = questions.filter(q => q.categoryId === cat.id).length
                                return (
                                    <TableRow key={cat.id} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${colorCfg?.class ?? 'bg-gray-500'}`} />
                                                <span className="font-medium text-white">{cat.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm">{cat.description || '—'}</TableCell>
                                        <TableCell className="text-center font-bold text-brand-pink">{cat.weightPercent}%</TableCell>
                                        <TableCell className="text-center text-gray-300">{qCount}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => openEdit(cat)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(cat.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                        Nenhuma categoria cadastrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-brand-pink" />
                            {editingId ? 'Editar Categoria' : 'Nova Categoria'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-800 border-gray-700" placeholder="Ex: Gestão Comercial" />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-gray-800 border-gray-700" placeholder="Breve descrição" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Peso no Score (%)</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" min={1} max={100} value={form.weightPercent} onChange={e => setForm({ ...form, weightPercent: Number(e.target.value) })} className="bg-gray-800 border-gray-700" />
                                    <span className="text-gray-400">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Cor</Label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {CATEGORY_COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, color: c.value })}
                                            className={`w-7 h-7 rounded-full ${c.class} flex items-center justify-center transition-transform ${form.color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-105'}`}
                                        >
                                            {form.color === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</Button>
                        <Button onClick={handleSave} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                            <Save className="w-4 h-4" /> Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ─── Question Form Dialog ───────────────────────────────────────────────────

function QuestionDialog({
    open,
    onOpenChange,
    onSave,
    editingQuestion,
    categories,
    templates,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSave: (q: Question) => void
    editingQuestion: Question | null
    categories: Category[]
    templates: AnswerTemplate[]
}) {
    const defaultForm = (): Omit<Question, 'id' | 'createdAt'> => ({
        text: '',
        categoryId: categories[0]?.id ?? '',
        questionType: 'YES_NO',
        weight: 10,
        targetRole: 'FRANQUEADO',
        isActive: true,
    })

    const [form, setForm] = useState<Omit<Question, 'id' | 'createdAt'>>(defaultForm())
    const [customOptions, setCustomOptions] = useState<AnswerOption[]>([
        { id: uid(), label: '', value: 1, color: 'green' },
    ])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) {
            if (editingQuestion) {
                setForm({
                    text: editingQuestion.text,
                    categoryId: editingQuestion.categoryId,
                    questionType: editingQuestion.questionType,
                    weight: editingQuestion.weight,
                    targetRole: editingQuestion.targetRole,
                    isActive: editingQuestion.isActive,
                    numericMin: editingQuestion.numericMin,
                    numericMax: editingQuestion.numericMax,
                    numericUnit: editingQuestion.numericUnit,
                    customTemplateId: editingQuestion.customTemplateId,
                    customOptions: editingQuestion.customOptions,
                })
                setCustomOptions(editingQuestion.customOptions ? editingQuestion.customOptions.map(o => ({ ...o })) : [{ id: uid(), label: '', value: 1, color: 'green' }])
                setSelectedTemplateId(editingQuestion.customTemplateId ?? '')
            } else {
                setForm(defaultForm())
                setCustomOptions([{ id: uid(), label: '', value: 1, color: 'green' }])
                setSelectedTemplateId('')
            }
        }
    }, [open, editingQuestion, categories])

    const applyTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId)
        const tpl = templates.find(t => t.id === templateId)
        if (tpl) {
            setCustomOptions(tpl.options.map(o => ({ ...o, id: uid() })))
            setForm(f => ({ ...f, customTemplateId: templateId }))
        }
    }

    const addCustomOption = () => setCustomOptions(prev => [...prev, { id: uid(), label: '', value: 0, color: 'gray' }])
    const removeCustomOption = (id: string) => setCustomOptions(prev => prev.filter(o => o.id !== id))
    const updateCustomOption = (id: string, field: keyof AnswerOption, value: any) => {
        setCustomOptions(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
    }

    const handleSave = () => {
        if (!form.text.trim()) { toast.error('Texto da pergunta é obrigatório.'); return }
        if (!form.categoryId) { toast.error('Selecione uma categoria.'); return }
        if (form.questionType === 'CUSTOM' && customOptions.some(o => !o.label.trim())) {
            toast.error('Todas as opções personalizadas precisam ter rótulo.'); return
        }
        setSaving(true)
        setTimeout(() => {
            const question: Question = {
                id: editingQuestion?.id ?? uid(),
                createdAt: editingQuestion?.createdAt ?? new Date().toISOString(),
                ...form,
                customOptions: form.questionType === 'CUSTOM' ? customOptions : undefined,
                customTemplateId: form.questionType === 'CUSTOM' ? selectedTemplateId : undefined,
            }
            onSave(question)
            setSaving(false)
            onOpenChange(false)
        }, 200)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[92vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-brand-pink" />
                        {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Text */}
                    <div className="space-y-2">
                        <Label>Texto da Pergunta *</Label>
                        <textarea
                            value={form.text}
                            onChange={e => setForm({ ...form, text: e.target.value })}
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                            placeholder="Ex: A clínica atingiu a meta de faturamento mensal nos últimos 3 meses?"
                        />
                    </div>

                    {/* Category + Weight + Role */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2 col-span-1">
                            <Label>Categoria *</Label>
                            <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v })}>
                                <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {categories.map(cat => {
                                        const cc = CATEGORY_COLORS.find(c => c.value === cat.color)
                                        return (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${cc?.class ?? 'bg-gray-500'}`} />
                                                    {cat.name}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Peso (pts)</Label>
                            <Input type="number" min={1} max={100} value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} className="bg-gray-800 border-gray-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Público Alvo</Label>
                            <Select value={form.targetRole} onValueChange={(v: any) => setForm({ ...form, targetRole: v })}>
                                <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    <SelectItem value="FRANQUEADO">Franqueado</SelectItem>
                                    <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Question Type */}
                    <div className="space-y-2">
                        <Label>Tipo de Resposta *</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {QUESTION_TYPES.map(type => (
                                <label
                                    key={type.value}
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.questionType === type.value ? 'border-brand-pink bg-brand-pink/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'}`}
                                >
                                    <input type="radio" className="hidden" checked={form.questionType === type.value} onChange={() => setForm({ ...form, questionType: type.value })} />
                                    <div className={`mt-0.5 ${form.questionType === type.value ? 'text-brand-pink' : 'text-gray-500'}`}>{type.icon}</div>
                                    <div>
                                        <p className={`text-sm font-medium ${form.questionType === type.value ? 'text-white' : 'text-gray-300'}`}>{type.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Numeric config */}
                    {(form.questionType === 'NUMERIC' || form.questionType === 'PERCENTAGE') && (
                        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Mínimo</Label>
                                <Input type="number" value={form.numericMin ?? ''} onChange={e => setForm({ ...form, numericMin: e.target.value === '' ? undefined : Number(e.target.value) })} className="bg-gray-700 border-gray-600 h-8 text-sm" placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Máximo</Label>
                                <Input type="number" value={form.numericMax ?? ''} onChange={e => setForm({ ...form, numericMax: e.target.value === '' ? undefined : Number(e.target.value) })} className="bg-gray-700 border-gray-600 h-8 text-sm" placeholder="100" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Unidade</Label>
                                <Input value={form.numericUnit ?? ''} onChange={e => setForm({ ...form, numericUnit: e.target.value })} className="bg-gray-700 border-gray-600 h-8 text-sm" placeholder="%, R$, min..." />
                            </div>
                        </div>
                    )}

                    {/* Custom options */}
                    {form.questionType === 'CUSTOM' && (
                        <div className="space-y-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                            {/* Load from template */}
                            {templates.length > 0 && (
                                <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                                    <Bookmark className="w-4 h-4 text-brand-pink flex-shrink-0" />
                                    <div className="flex-1">
                                        <Select value={selectedTemplateId} onValueChange={applyTemplate}>
                                            <SelectTrigger className="bg-gray-700 border-gray-600 h-8 text-sm">
                                                <SelectValue placeholder="Carregar de um modelo salvo..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {templates.map(t => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">ou edite abaixo</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Opções de Resposta *</Label>
                                <Button size="sm" variant="ghost" onClick={addCustomOption} className="h-7 text-xs text-brand-pink hover:text-pink-400 hover:bg-brand-pink/10 gap-1">
                                    <Plus className="w-3 h-3" /> Adicionar
                                </Button>
                            </div>
                            {customOptions.map((opt, i) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                    <Input value={opt.label} onChange={e => updateCustomOption(opt.id, 'label', e.target.value)} className="bg-gray-700 border-gray-600 h-8 text-sm flex-1" placeholder={`Rótulo ${i + 1}`} />
                                    <Input type="number" step="0.1" min={0} value={opt.value} onChange={e => updateCustomOption(opt.id, 'value', Number(e.target.value))} className="bg-gray-700 border-gray-600 h-8 text-sm w-20" />
                                    <Select value={opt.color} onValueChange={v => updateCustomOption(opt.id, 'color', v)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 h-8 w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            {OPTION_COLORS.map(c => (
                                                <SelectItem key={c.value} value={c.value!}>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                                                        <span className="text-xs">{c.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-500/10 flex-shrink-0" onClick={() => removeCustomOption(opt.id)} disabled={customOptions.length <= 1}>
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar Pergunta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Questions Tab ──────────────────────────────────────────────────────────

function QuestionsTab({
    questions,
    setQuestions,
    categories,
    templates,
}: {
    questions: Question[]
    setQuestions: (fn: (prev: Question[]) => Question[]) => void
    categories: Category[]
    templates: AnswerTemplate[]
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [filterCategory, setFilterCategory] = useState('ALL')
    const [filterType, setFilterType] = useState('ALL')
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

    const openNew = () => { setEditingQuestion(null); setIsDialogOpen(true) }
    const openEdit = (q: Question) => { setEditingQuestion(q); setIsDialogOpen(true) }

    const handleSave = (q: Question) => {
        if (editingQuestion) {
            setQuestions(prev => prev.map(x => x.id === q.id ? q : x))
            toast.success('Pergunta atualizada!')
        } else {
            setQuestions(prev => [...prev, q])
            toast.success('Pergunta criada!')
        }
    }

    const handleDelete = (id: string) => {
        if (!confirm('Excluir esta pergunta?')) return
        setQuestions(prev => prev.filter(q => q.id !== id))
        toast.success('Pergunta excluída!')
    }

    const filtered = questions.filter(q => {
        const catOk = filterCategory === 'ALL' || q.categoryId === filterCategory
        const typeOk = filterType === 'ALL' || q.questionType === filterType
        return catOk && typeOk
    })

    // Group by category
    const grouped = categories.map(cat => ({
        category: cat,
        questions: filtered.filter(q => q.categoryId === cat.id),
    })).filter(g => g.questions.length > 0)

    const ungrouped = filtered.filter(q => !categories.find(c => c.id === q.categoryId))

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 w-52 h-9 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="ALL">Todas as categorias</SelectItem>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 w-44 h-9 text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="ALL">Todos os tipos</SelectItem>
                            {QUESTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="text-xs text-gray-500">{filtered.length} pergunta(s)</span>
                </div>
                <Button onClick={openNew} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Nova Pergunta
                </Button>
            </div>

            {/* Grouped by category */}
            {grouped.length === 0 && ungrouped.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="py-12 text-center">
                        <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhuma pergunta cadastrada.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {grouped.map(({ category, questions: qs }) => {
                        const colorCfg = CATEGORY_COLORS.find(c => c.value === category.color)
                        const isExpanded = expandedCategory === category.id || expandedCategory === null
                        return (
                            <Card key={category.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors text-left"
                                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${colorCfg?.class ?? 'bg-gray-500'}`} />
                                        <span className="font-semibold text-white">{category.name}</span>
                                        <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full">{qs.length} pergunta(s)</span>
                                        <span className="text-xs font-bold text-brand-pink">{category.weightPercent}%</span>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-gray-800">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-800 hover:bg-transparent">
                                                    <TableHead className="text-gray-400 pl-6">Pergunta</TableHead>
                                                    <TableHead className="text-gray-400">Tipo</TableHead>
                                                    <TableHead className="text-gray-400 text-center">Peso</TableHead>
                                                    <TableHead className="text-gray-400">Role</TableHead>
                                                    <TableHead className="text-gray-400 text-right pr-6">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {qs.map(q => {
                                                    const badge = TYPE_BADGE[q.questionType]
                                                    return (
                                                        <TableRow key={q.id} className="border-gray-800 hover:bg-gray-800/50">
                                                            <TableCell className="pl-6 max-w-xs">
                                                                <span className="text-white text-sm line-clamp-2">{q.text}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>{badge.label}</span>
                                                            </TableCell>
                                                            <TableCell className="text-center font-bold text-brand-pink">{q.weight}</TableCell>
                                                            <TableCell className="text-gray-400 text-xs font-mono">{q.targetRole}</TableCell>
                                                            <TableCell className="text-right pr-6">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => openEdit(q)}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(q.id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                    {ungrouped.length > 0 && (
                        <Card className="bg-gray-900 border-gray-800">
                            <div className="p-4 border-b border-gray-800">
                                <span className="text-gray-400 text-sm">Sem categoria ({ungrouped.length})</span>
                            </div>
                            <Table>
                                <TableBody>
                                    {ungrouped.map(q => {
                                        const badge = TYPE_BADGE[q.questionType]
                                        return (
                                            <TableRow key={q.id} className="border-gray-800 hover:bg-gray-800/50">
                                                <TableCell className="pl-6 max-w-xs">
                                                    <span className="text-white text-sm line-clamp-2">{q.text}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${badge.className}`}>{badge.label}</span>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-brand-pink">{q.weight}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => openEdit(q)}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(q.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </div>
            )}

            <QuestionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSave}
                editingQuestion={editingQuestion}
                categories={categories}
                templates={templates}
            />
        </div>
    )
}

// ─── Main AdminQuestions ────────────────────────────────────────────────────

export function AdminQuestions() {
    const [categories, setCategories] = useLocalStorage<Category[]>('excelencia_categories', [])
    const [questions, setQuestions] = useLocalStorage<Question[]>('excelencia_questions', [])
    const [templates, setTemplates] = useLocalStorage<AnswerTemplate[]>('excelencia_answer_templates', [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Gestão de Avaliação</h1>
                <p className="text-gray-400 mt-1">Configure categorias, perguntas e modelos de respostas para o checklist de excelência.</p>
            </div>

            <Tabs defaultValue="questions" className="space-y-4">
                <TabsList className="bg-gray-800 border border-gray-700">
                    <TabsTrigger value="questions" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white gap-2">
                        <HelpCircle className="w-4 h-4" /> Perguntas
                        {questions.length > 0 && <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{questions.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white gap-2">
                        <Tag className="w-4 h-4" /> Categorias
                        {categories.length > 0 && <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{categories.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white gap-2">
                        <BookTemplate className="w-4 h-4" /> Modelos de Respostas
                        {templates.length > 0 && <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{templates.length}</span>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="questions">
                    {categories.length === 0 ? (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="py-12 text-center space-y-3">
                                <Tag className="w-12 h-12 text-gray-600 mx-auto" />
                                <p className="text-gray-400">Crie pelo menos uma categoria antes de adicionar perguntas.</p>
                                <p className="text-gray-500 text-sm">Vá para a aba "Categorias" para começar.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <QuestionsTab questions={questions} setQuestions={setQuestions} categories={categories} templates={templates} />
                    )}
                </TabsContent>

                <TabsContent value="categories">
                    <CategoryTab categories={categories} setCategories={setCategories} questions={questions} />
                </TabsContent>

                <TabsContent value="templates">
                    <AnswerTemplatesTab templates={templates} setTemplates={setTemplates} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
