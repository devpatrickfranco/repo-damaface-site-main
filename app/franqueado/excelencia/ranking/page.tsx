'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Medal, TrendingUp, AlertCircle, Loader2, CalendarClock } from 'lucide-react'
import { excelenciaApi } from '../api'
import { RankingItem } from '../types'
import { toast } from 'sonner' // Assuming sonner is used

// Helper to calculate days until next trimester
function getDaysUntilNextTrimester() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Trimesters start: Jan 1 (0), Apr 1 (3), Jul 1 (6), Oct 1 (9)
    const trimesterMonths = [0, 3, 6, 9];

    // Find next start date
    let nextStart = new Date(currentYear, trimesterMonths[0], 1);
    for (const month of trimesterMonths) {
        const date = new Date(currentYear, month, 1);
        if (date > now) {
            nextStart = date;
            break;
        }
    }
    // If we passed Oct 1, next is Jan 1 of next year
    if (nextStart <= now) {
        nextStart = new Date(currentYear + 1, 0, 1);
    }

    const diffTime = Math.abs(nextStart.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export default function RankingPage() {
    const { user } = useAuth()
    const [ranking, setRanking] = useState<RankingItem[]>([])
    const [loading, setLoading] = useState(true)
    const [daysFull, setDaysFull] = useState(0)

    useEffect(() => {
        setDaysFull(getDaysUntilNextTrimester())

        const fetchRanking = async () => {
            try {
                const data = await excelenciaApi.getRanking()
                setRanking(data)
            } catch (error) {
                console.error("Failed to fetch ranking:", error)
                toast.error("Erro ao carregar ranking.")
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchRanking()
        }
    }, [user])

    if (!user) return null

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-brand-pink" /></div>
    }

    // Find user's unit based on is_self flag
    const myUnitRank = ranking.find(r => r.is_self) || { rank: 0, latest_score: 0, name: 'Sua Unidade', lowest_category: null }

    const isEmpty = ranking.length === 0

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Ranking de Excelência</h1>
                <p className="text-gray-400 mt-1">
                    Confira o desempenho da sua unidade no programa.
                </p>
            </div>

            {/* Countdown / Status Header */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-pink/10 p-3 rounded-full">
                        <CalendarClock className="w-8 h-8 text-brand-pink" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Próximo Ciclo de Avaliação</h2>
                        <p className="text-gray-400 text-sm">Prepare sua unidade para a próxima auditoria.</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <span className="block text-4xl font-black text-white">{daysFull}</span>
                    <span className="text-brand-pink font-semibold uppercase text-xs tracking-wider">Dias Restantes</span>
                </div>
            </div>

            {isEmpty ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 bg-gray-900/50 border border-gray-800 rounded-2xl border-dashed">
                    <div className="bg-gray-800 p-6 rounded-full animate-pulse">
                        <Trophy className="w-16 h-16 text-gray-600" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h3 className="text-xl font-bold text-white">Ranking em Breve!</h3>
                        <p className="text-gray-400">
                            Ainda não temos avaliações suficientes para gerar o ranking deste trimestre.
                            <br />
                            Complete sua auto-avaliação e aguarde a próxima atualização.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Content - My Ranking */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Your Position Card */}
                        <div className="bg-gradient-to-br from-brand-pink/20 to-purple-900/40 rounded-2xl p-8 border border-brand-pink/30 relative overflow-hidden flex flex-col justify-center items-center text-center">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy className="w-64 h-64 text-brand-pink" />
                            </div>

                            <div className="relative z-10">
                                <span className="text-brand-pink font-semibold tracking-wider text-sm uppercase mb-2 block">Sua Posição Atual</span>
                                <h2 className="text-7xl font-black text-white mb-2">{myUnitRank.rank > 0 ? `${myUnitRank.rank}º` : '-'}</h2>
                                <p className="text-xl text-gray-300">Lugar Geral</p>
                            </div>

                            <div className="mt-8 flex gap-8">
                                <div>
                                    <span className="block text-gray-400 text-sm">Pontuação</span>
                                    <span className="text-3xl font-bold text-white">{myUnitRank.latest_score}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-sm">Status</span>
                                    {/* TODO: Add trend logic if available from API */}
                                    <span className="text-green-400 font-bold text-lg flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" /> Ativo
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info / Message */}
                        <Card className="bg-gray-800 border-gray-700 flex flex-col justify-center">
                            <CardContent className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Medal className="text-yellow-500" />
                                        Metas do Trimestre
                                    </h3>
                                    <p className="text-gray-400 mt-2 leading-relaxed">
                                        Sua unidade está com um desempenho excelente! Mantenha a pontuação acima de 900 para garantir a premiação Diamante no final do ano.
                                    </p>
                                </div>

                                {myUnitRank.lowest_category && (
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-4 items-start">
                                        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-blue-400 font-bold text-sm">Dica para melhorar</h4>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Aumente sua nota na categoria <strong>{myUnitRank.lowest_category}</strong> revisando o checklist diário.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Blind Ranking List */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-brand-pink" />
                            Top Excelência
                        </h3>

                        <div className="space-y-4 max-w-3xl">
                            {ranking.sort((a, b) => a.rank - b.rank).map((item) => {
                                const isMe = item.is_self

                                return (
                                    <div
                                        key={item.id}
                                        className={`
                                            flex items-center justify-between p-4 rounded-xl border transition-all
                                            ${isMe
                                                ? 'bg-brand-pink/10 border-brand-pink shadow-[0_0_15px_rgba(236,72,153,0.2)] scale-[1.02]'
                                                : 'bg-gray-900 border-gray-800 opacity-60'}
                                        `}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center font-bold
                                                ${item.rank === 1 ? 'bg-yellow-500 text-black' :
                                                    item.rank === 2 ? 'bg-gray-400 text-black' :
                                                        item.rank === 3 ? 'bg-amber-700 text-white' :
                                                            'bg-gray-800 text-gray-500'}
                                            `}>
                                                {item.rank}
                                            </div>
                                            <span className={`font-medium ${isMe ? 'text-white text-lg' : 'text-gray-400'}`}>
                                                {item.name}
                                            </span>
                                        </div>

                                        <div className="font-mono font-bold text-white">
                                            {item.latest_score} pts
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

