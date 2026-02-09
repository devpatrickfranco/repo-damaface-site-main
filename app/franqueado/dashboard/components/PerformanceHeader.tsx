"use client"

import { BarChart3 } from "lucide-react"

export default function PerformanceHeader() {
    const now = new Date()
    const monthName = now.toLocaleDateString("pt-BR", { month: "long" })
    const year = now.getFullYear()

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-pink/10">
                    <BarChart3 className="w-5 h-5 text-brand-pink" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight text-balance">
                        {"Performance da sua franquia \u2014 "}
                        <span className="capitalize">{monthName}</span> {year}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Compare sua unidade com a rede
                    </p>
                </div>
            </div>
        </div>
    )
}
