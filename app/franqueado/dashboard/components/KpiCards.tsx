"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    CalendarCheck,
    ShoppingCart,
    DollarSign,
    Receipt,
    ArrowRightLeft,
    FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { KpiData, KpiCardProps } from "@/types/dashboard"

function formatMeta(meta: number, isCurrency?: boolean, isPercent?: boolean) {
    if (isPercent) return `${meta}%`
    if (isCurrency)
        return `R$ ${meta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    return meta.toLocaleString("pt-BR")
}

function KpiCard({
    title,
    value,
    rawValue,
    variation,
    meta,
    metaLabel,
    icon: Icon,
    iconColor,
    iconBg,
    isCurrency,
    isPercent,
    cardMode = "projection",
    diaAtual,
    skipProjection = false,
}: KpiCardProps) {
    const isPositive = variation >= 0
    const metaFormatted = formatMeta(meta, isCurrency, isPercent)
    const aboveMeta = rawValue >= meta

    // Projection: what you should have by today to be on track for the monthly meta
    const projecaoEsperada = (meta / 30) * diaAtual
    const onTrack = rawValue >= projecaoEsperada
    const projecaoFormatted = formatMeta(
        Math.round(projecaoEsperada * 100) / 100,
        isCurrency,
        isPercent,
    )

    return (
        <Card className="bg-card border-border group hover:border-brand-pink/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/5">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold text-foreground tracking-tight">
                            {value}
                        </p>
                        {cardMode === "receita" ? (
                            <p className="text-xs text-muted-foreground mt-1">
                                Total em orcamentos aguardando fechamento
                            </p>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className={`inline-flex items-center text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"
                                            }`}
                                    >
                                        {isPositive ? "\u2191" : "\u2193"}{" "}
                                        {Math.abs(variation).toFixed(1)}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        vs mes anterior
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="text-xs text-muted-foreground">
                                        {metaLabel}
                                    </span>
                                    <span
                                        className={`text-xs font-semibold ${aboveMeta ? "text-emerald-400" : "text-red-400"
                                            }`}
                                    >
                                        {metaFormatted}
                                    </span>
                                    <span
                                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${aboveMeta
                                            ? "bg-emerald-500/15 text-emerald-400"
                                            : "bg-red-500/15 text-red-400"
                                            }`}
                                    >
                                        {aboveMeta ? "Acima" : "Abaixo"}
                                    </span>
                                </div>

                                {/* Projection line - only for agendamentos, vendas, faturamento */}
                                {/* Projection line - only for agendamentos, vendas, faturamento */}
                                {cardMode === "projection" && (
                                    <div className="flex items-center gap-1.5 pt-1 border-t border-border/50 mt-1 whitespace-nowrap">
                                        <span className="text-xs text-muted-foreground">
                                            {"Projecao dia "}{diaAtual}{":"}
                                        </span>
                                        <span
                                            className={`text-xs font-semibold ${onTrack ? "text-emerald-400" : "text-red-400"
                                                }`}
                                        >
                                            {projecaoFormatted}
                                        </span>
                                        <span
                                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${onTrack
                                                ? "bg-emerald-500/15 text-emerald-400"
                                                : "bg-red-500/15 text-red-400"
                                                }`}
                                        >
                                            {onTrack ? "No ritmo" : "Atencao"}
                                        </span>
                                    </div>
                                )}

                                {/* Fixed cards (ticket medio, conversao) - no extra line */}
                            </div>
                        )}
                    </div>
                    <div
                        className={`p-3 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function KpiCards({ data }: { data: KpiData }) {
    const diaAtual = new Date().getDate()

    const cards: KpiCardProps[] = [
        {
            title: "Agendamentos",
            value: data.agendamentos.toLocaleString("pt-BR"),
            rawValue: data.agendamentos,
            variation: data.agendamentosVariacao,
            meta: data.agendamentosMeta,
            metaLabel: "Meta:",
            icon: CalendarCheck,
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/10",
            diaAtual,
        },
        {
            title: "Vendas realizadas",
            value: data.vendas.toLocaleString("pt-BR"),
            rawValue: data.vendas,
            variation: data.vendasVariacao,
            meta: data.vendasMeta,
            metaLabel: "Meta:",
            icon: ShoppingCart,
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
            diaAtual,
        },
        {
            title: "Faturamento",
            value: `R$ ${data.faturamento.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
            })}`,
            rawValue: data.faturamento,
            variation: data.faturamentoVariacao,
            meta: data.faturamentoMeta,
            metaLabel: "Meta:",
            icon: DollarSign,
            iconColor: "text-brand-pink",
            iconBg: "bg-brand-pink/10",
            isCurrency: true,
            diaAtual,
        },
        {
            title: "Ticket Medio",
            value: `R$ ${data.ticketMedio.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
            })}`,
            rawValue: data.ticketMedio,
            variation: data.ticketMedioVariacao,
            meta: data.ticketMedioMeta,
            metaLabel: "Meta:",
            icon: Receipt,
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/10",
            isCurrency: true,
            cardMode: "fixed",
            diaAtual,
        },
        {
            title: "Conversao",
            value: `${data.conversao.toFixed(1)}%`,
            rawValue: data.conversao,
            variation: data.conversaoVariacao,
            meta: data.conversaoMeta,
            metaLabel: "Meta:",
            icon: ArrowRightLeft,
            iconColor: "text-cyan-400",
            iconBg: "bg-cyan-500/10",
            isPercent: true,
            cardMode: "fixed",
            diaAtual,
        },
        {
            title: "Receita potencial em andamento",
            value: `R$ ${data.receitaPotencial.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
            })}`,
            rawValue: data.receitaPotencial,
            variation: 0,
            meta: 0,
            metaLabel: "",
            icon: FileText,
            iconColor: "text-orange-400",
            iconBg: "bg-orange-500/10",
            cardMode: "receita",
            diaAtual,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
                <KpiCard key={card.title} {...card} />
            ))}
        </div>
    )
}
