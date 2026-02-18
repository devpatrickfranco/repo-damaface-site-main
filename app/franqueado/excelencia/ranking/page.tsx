'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Medal, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { excelenciaApi } from '../api'
import { RankingItem } from '../types'
import { toast } from 'sonner' // Assuming sonner is used

export default function RankingPage() {
    const { user } = useAuth()
    const [ranking, setRanking] = useState<RankingItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Ranking de Excelência</h1>
                <p className="text-gray-400 mt-1">
                    Confira o desempenho da sua unidade no programa.
                </p>
            </div>

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
                    {ranking.length === 0 ? (
                        <p className="text-gray-400">Ranking ainda não disponível.</p>
                    ) : (
                        ranking.sort((a, b) => a.rank - b.rank).map((item) => {
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

                                    {/* Show score if it's me or if user is admin (endpoint handles logic mostly, but we can verify) */}
                                    <div className="font-mono font-bold text-white">
                                        {/* Since backend masks names, does it mask scores? 
                                            Docs: "Vê o nome das unidades no Top 3". "Outras unidades aparecem como 'Unidade ****'".
                                            It doesn't explicitly say scores are hidden, but usually blind ranking hides scores of others to prevent guessing.
                                            However, the JSON example shows "latest_score": 85.0 for a masked unit.
                                            Let's show the score as returned by API.
                                        */}
                                        {item.latest_score} pts
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

