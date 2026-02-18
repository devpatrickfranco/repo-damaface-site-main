'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ClipboardCheck, Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ExcelenciaDashboardPage() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Programa de Excelência</h1>
                <p className="text-gray-400 mt-1">
                    Gerencie a qualidade da sua unidade e acompanhe seu desempenho.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/franqueado/excelencia/auto-avaliacao" className="group">
                    <Card className="bg-gray-900 border-gray-800 hover:border-brand-pink transition-colors h-full">
                        <CardHeader>
                            <div className="bg-brand-pink/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-pink/20 transition-colors">
                                <ClipboardCheck className="text-brand-pink w-6 h-6" />
                            </div>
                            <CardTitle className="text-white text-xl">Auto Avaliação</CardTitle>
                            <CardDescription className="text-gray-400">
                                Realize o checklist trimestral de qualidade da sua unidade.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-brand-pink font-medium text-sm gap-1 group-hover:gap-2 transition-all">
                                Acessar Avaliação <ArrowRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/franqueado/excelencia/ranking" className="group">
                    <Card className="bg-gray-900 border-gray-800 hover:border-brand-pink transition-colors h-full">
                        <CardHeader>
                            <div className="bg-yellow-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                <Trophy className="text-yellow-500 w-6 h-6" />
                            </div>
                            <CardTitle className="text-white text-xl">Ranking e Metas</CardTitle>
                            <CardDescription className="text-gray-400">
                                Visualize sua posição no ranking geral e consulte suas metas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-yellow-500 font-medium text-sm gap-1 group-hover:gap-2 transition-all">
                                Ver Ranking <ArrowRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
