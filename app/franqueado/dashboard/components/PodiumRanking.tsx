"use client"

import { Trophy } from "lucide-react"

import type { RankingEntry, PodiumRankingProps } from "@/types/dashboard"

function PodiumPlace({
    entry,
    height,
    colorClass,
    borderColor,
    glowColor,
    badgeGradient,
    delay,
}: {
    entry: RankingEntry
    height: string
    colorClass: string
    borderColor: string
    glowColor: string
    badgeGradient: string
    delay: string
}) {
    return (
        <div className="flex flex-col items-center gap-3">
            {/* Name */}
            <p className={`text-sm font-bold text-center leading-tight ${colorClass} max-w-[120px] truncate`}>
                {entry.nome}
            </p>

            {/* Podium block */}
            <div
                className={`relative w-24 md:w-28 ${height} rounded-t-xl border-2 ${borderColor} flex flex-col items-center justify-start pt-4 transition-all duration-500`}
                style={{
                    background: `linear-gradient(to top, hsl(220,18%,10%), hsl(220,18%,14%))`,
                    boxShadow: `0 0 20px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    animationDelay: delay,
                }}
            >
                {/* Position badge */}
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold shadow-lg ${badgeGradient}`}
                >
                    {entry.posicao}
                </div>

                {entry.posicao === 1 && (
                    <Trophy className="w-5 h-5 text-gold mt-2 animate-pulse" />
                )}
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
        <div className="flex flex-col items-center gap-6">
            <div className="flex items-end justify-center gap-3 md:gap-4">
                {/* 2nd place - left */}
                <PodiumPlace
                    entry={second}
                    height="h-28"
                    colorClass="text-silver"
                    borderColor="border-silver/30"
                    glowColor="rgba(192,192,192,0.1)"
                    badgeGradient="bg-gradient-to-br from-silver to-silver-dark text-background"
                    delay="0.1s"
                />

                {/* 1st place - center, tallest */}
                <PodiumPlace
                    entry={first}
                    height="h-40"
                    colorClass="text-gold"
                    borderColor="border-gold/40"
                    glowColor="rgba(255,215,0,0.15)"
                    badgeGradient="bg-gradient-to-br from-gold to-gold-dark text-background"
                    delay="0s"
                />

                {/* 3rd place - right */}
                <PodiumPlace
                    entry={third}
                    height="h-20"
                    colorClass="text-bronze"
                    borderColor="border-bronze/30"
                    glowColor="rgba(205,127,50,0.1)"
                    badgeGradient="bg-gradient-to-br from-bronze to-bronze-dark text-background"
                    delay="0.2s"
                />
            </div>

            {/* Floor line */}
            <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Sua Unidade position */}
            <div className="w-full mt-2 p-4 rounded-xl bg-secondary border border-brand-pink/20">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">Sua unidade</p>
                        <p className="text-sm font-bold text-foreground">{suaUnidadeNome}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                        <p className="text-2xl font-extrabold text-brand-pink">{suaUnidadePosicao}{"º"}</p>
                        <p className="text-xs text-muted-foreground">{"de "}{totalUnidades} unidades</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
