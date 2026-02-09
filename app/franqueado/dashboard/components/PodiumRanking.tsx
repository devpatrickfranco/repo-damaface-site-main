"use client"

import { Trophy, Medal, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

import type { RankingEntry, PodiumRankingProps } from "@/types/dashboard"

interface PodiumPlaceProps {
    entry: RankingEntry
    position: number
    height: string
    delay: string
}

function PodiumPlace({ entry, position, height, delay }: PodiumPlaceProps) {
    const isFirst = position === 1
    const isSecond = position === 2
    const isThird = position === 3

    // Configurações de estilo baseadas na posição
    const styles = {
        1: {
            gradient: "from-yellow-300 via-yellow-500 to-yellow-700",
            text: "text-yellow-400",
            border: "border-yellow-500/50",
            glow: "shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]",
            icon: <Crown className="w-8 h-8 text-yellow-950 fill-yellow-400 animate-pulse" />,
            bg: "bg-gradient-to-b from-yellow-950/40 to-yellow-950/10",
        },
        2: {
            gradient: "from-slate-300 via-slate-400 to-slate-600",
            text: "text-slate-300",
            border: "border-slate-400/50",
            glow: "shadow-[0_0_30px_-5px_rgba(148,163,184,0.3)]",
            icon: <Medal className="w-6 h-6 text-slate-900 fill-slate-300" />,
            bg: "bg-gradient-to-b from-slate-900/40 to-slate-900/10",
        },
        3: {
            gradient: "from-amber-300 via-amber-600 to-amber-800",
            text: "text-amber-500",
            border: "border-amber-600/50",
            glow: "shadow-[0_0_30px_-5px_rgba(217,119,6,0.3)]",
            icon: <Medal className="w-6 h-6 text-amber-900 fill-amber-500" />,
            bg: "bg-gradient-to-b from-amber-950/40 to-amber-950/10",
        },
    }[position as 1 | 2 | 3]

    return (
        <div className="flex flex-col items-center group relative z-10" style={{ marginTop: isFirst ? 0 : '2rem' }}>
            {/* Avatar / Icon Container */}
            <div
                className={cn(
                    "mb-4 relative transition-transform duration-500 hover:scale-110",
                    isFirst ? "-mt-8" : ""
                )}
                style={{ animationDelay: delay }}
            >
                <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-xl",
                    styles.border,
                    styles.bg
                )}>
                    {styles.icon}
                </div>

                {/* Position Badge */}
                <div className={cn(
                    "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-background",
                    "bg-gradient-to-br",
                    styles.gradient
                )}>
                    {position}
                </div>
            </div>

            {/* Name */}
            <div className="text-center mb-2 px-2">
                <p className={cn(
                    "font-bold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70",
                )}>
                    {entry.nome}
                </p>
            </div>

            {/* Podium Block */}
            <div
                className={cn(
                    "w-24 md:w-32 rounded-t-lg relative overflow-hidden transition-all duration-500",
                    height,
                    styles.bg,
                    styles.border,
                    "border-x border-t backdrop-blur-sm",
                    styles.glow
                )}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {/* Bottom value/score placeholder (optional) */}
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-50 font-mono text-xs">
                    {/* Could put score here if available */}
                </div>
            </div>
        </div>
    )
}

export default function PodiumRanking({ ranking, suaUnidadePosicao, suaUnidadeNome, totalUnidades }: PodiumRankingProps) {
    const sorted = [...ranking].sort((a, b) => a.posicao - b.posicao)
    const first = sorted.find((r) => r.posicao === 1)
    const second = sorted.find((r) => r.posicao === 2)
    const third = sorted.find((r) => r.posicao === 3)

    if (!first || !second || !third) return null

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Podium Area */}
            <div className="relative flex items-end justify-center gap-2 md:gap-4 px-4 pt-8 pb-4">
                {/* Background Glow for 1st place */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-pink/20 blur-[100px] rounded-full pointer-events-none" />

                {/* 2nd Place */}
                <PodiumPlace
                    entry={second}
                    position={2}
                    height="h-32"
                    delay="0.2s"
                />

                {/* 1st Place */}
                <PodiumPlace
                    entry={first}
                    position={1}
                    height="h-44"
                    delay="0s"
                />

                {/* 3rd Place */}
                <PodiumPlace
                    entry={third}
                    position={3}
                    height="h-24"
                    delay="0.4s"
                />
            </div>

            {/* User Unit Card */}
            <div className="relative overflow-hidden rounded-xl border border-brand-pink/30 bg-gradient-to-r from-brand-pink/10 via-background to-brand-pink/5 p-4 shadow-lg shadow-brand-pink/5 mx-2">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-pink" />
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-brand-pink/80 uppercase tracking-wider">Sua Unidade</p>
                            <p className="text-base font-bold text-white">{suaUnidadeNome}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-3xl font-black text-white leading-none">
                            {suaUnidadePosicao}º
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            de {totalUnidades}
                        </p>
                    </div>
                </div>

                {/* Decorative background pattern */}
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-brand-pink/10 to-transparent pointer-events-none" />
            </div>
        </div>
    )
}
