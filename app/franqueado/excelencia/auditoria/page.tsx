'use client'

import { useAuth } from '@/context/AuthContext'
import { SUBMISSIONS } from '../mocks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, CheckCircle2, Clock, FileText } from 'lucide-react'

export default function AuditoriaPage() {
    const { user } = useAuth()

    // Restrict access (though Sidebar handles this navigation-wise, robust auth check is good)
    if (!user || (user.role !== 'SUPERADMIN' && user.role !== 'ADMIN')) {
        return <div className="p-8 text-center text-gray-400">Acesso Restrito</div>
    }

    // Mock Aggregations
    const totalSubmissions = SUBMISSIONS.length
    const pendingSubmissions = SUBMISSIONS.filter(s => s.status === 'Pendente').length
    const averageScore = Math.round(SUBMISSIONS.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Auditoria de Excelência</h1>
                <p className="text-gray-400 mt-1">
                    Acompanhe as submissões e o desempenho das unidades.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-blue-500/20">
                            <FileText className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Total de Submissões</p>
                            <h3 className="text-3xl font-bold text-white">{totalSubmissions}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-yellow-500/20">
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Pendentes de Revisão</p>
                            <h3 className="text-3xl font-bold text-white">{pendingSubmissions}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 rounded-full bg-green-500/20">
                            <BarChart3 className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Média Geral</p>
                            <h3 className="text-3xl font-bold text-white">{averageScore} pontos</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Submissions List */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Submissões Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Unidade</th>
                                    <th scope="col" className="px-6 py-3">Data</th>
                                    <th scope="col" className="px-6 py-3">Pontuação</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SUBMISSIONS.map((submission) => (
                                    <tr key={submission.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{submission.unit}</td>
                                        <td className="px-6 py-4">{new Date(submission.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-bold ${submission.score >= 90 ? 'text-green-400' : submission.score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {submission.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {submission.status === 'Aprovado' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                )}
                                                <span>{submission.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-brand-pink hover:underline">Ver Detalhes</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
