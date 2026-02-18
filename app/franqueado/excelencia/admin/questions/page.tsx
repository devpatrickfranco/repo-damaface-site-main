'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Plus, Pencil, Trash2, Save } from 'lucide-react'
import { excelenciaApi } from '../../api'
import { Question, QuestionInput } from '../../types'
import { toast } from 'sonner'

export default function AdminQuestionsPage() {
    const { user } = useAuth()
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<QuestionInput>({
        text: '',
        category: 1, // Default ID, needs to be dynamic or handled
        weight: 10,
        target_role: 'FRANQUEADO',
        is_active: true
    })

    // Categories Mock - In real app, fetch from API
    // The user docs mentioned Category model. I'll mock a few options for now or assume simple IDs.
    const CATEGORIES = [
        { id: 1, name: 'Operacional' },
        { id: 2, name: 'Branding' },
        { id: 3, name: 'Atendimento' },
        { id: 4, name: 'Gestão' }
    ]

    useEffect(() => {
        fetchQuestions()
    }, [])

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

    const handleOpenDialog = (question?: Question) => {
        if (question) {
            setEditingId(question.id)
            setFormData({
                text: question.text,
                category: typeof question.category === 'object' ? (question.category as any).id : question.category,
                weight: question.weight,
                target_role: question.target_role,
                is_active: question.is_active
            })
        } else {
            setEditingId(null)
            setFormData({
                text: '',
                category: 1,
                weight: 10,
                target_role: 'FRANQUEADO',
                is_active: true
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await excelenciaApi.updateQuestion(editingId, formData)
                toast.success("Pergunta atualizada!")
            } else {
                await excelenciaApi.createQuestion(formData)
                toast.success("Pergunta criada!")
            }
            setIsDialogOpen(false)
            fetchQuestions()
        } catch (error) {
            console.error("Error saving question:", error)
            toast.error("Erro ao salvar pergunta.")
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return
        try {
            await excelenciaApi.deleteQuestion(id)
            toast.success("Pergunta excluída!")
            fetchQuestions()
        } catch (error) {
            console.error("Error deleting question:", error)
            toast.error("Erro ao excluir pergunta.")
        }
    }

    if (!user || user.role !== 'SUPERADMIN') {
        // Should ideally redirect or show 403, but just returning null for safety based on context
        return <div className="text-white p-8">Acesso restrito.</div>
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-brand-pink" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestão de Perguntas</h1>
                    <p className="text-gray-400 mt-1">Configure o checklist de excelência.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                            <Plus className="w-4 h-4" /> Nova Pergunta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Editar Pergunta' : 'Nova Pergunta'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Texto da Pergunta</Label>
                                <Input
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="bg-gray-800 border-gray-700"
                                    placeholder="Ex: A unidade possui..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select
                                        value={String(formData.category)}
                                        onValueChange={(val) => setFormData({ ...formData, category: Number(val) })}
                                    >
                                        <SelectTrigger className="bg-gray-800 border-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Peso</Label>
                                    <Input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                                        className="bg-gray-800 border-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Público Alvo</Label>
                                <Select
                                    value={formData.target_role}
                                    onValueChange={(val: any) => setFormData({ ...formData, target_role: val })}
                                >
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
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800">Cancelar</Button>
                            <Button onClick={handleSubmit} className="bg-brand-pink hover:bg-pink-700 text-white gap-2">
                                <Save className="w-4 h-4" /> Salvar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-transparent">
                                <TableHead className="text-gray-400">Texto</TableHead>
                                <TableHead className="text-gray-400">Categoria</TableHead>
                                <TableHead className="text-gray-400">Peso</TableHead>
                                <TableHead className="text-gray-400">Role</TableHead>
                                <TableHead className="text-gray-400 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((q) => (
                                <TableRow key={q.id} className="border-gray-800 hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-white">{q.text}</TableCell>
                                    <TableCell className="text-gray-300">
                                        {/* Try to match category name if possible, else show ID */}
                                        {CATEGORIES.find(c => c.id === (typeof q.category === 'object' ? (q.category as any).id : q.category))?.name || q.category}
                                    </TableCell>
                                    <TableCell className="text-gray-300">{q.weight}</TableCell>
                                    <TableCell className="text-gray-300 text-xs font-mono">{q.target_role}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10" onClick={() => handleOpenDialog(q)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(q.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {questions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        Nenhuma pergunta cadastrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
