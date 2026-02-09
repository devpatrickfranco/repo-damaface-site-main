"use client"

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"

import type { EvolutionChartProps } from "@/types/dashboard"

export default function EvolutionChart({ data }: EvolutionChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(330,80%,60%)" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="hsl(330,80%,60%)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                    <XAxis
                        dataKey="semana"
                        stroke="hsl(220,10%,45%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(220,10%,45%)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(220,18%,12%)",
                            border: "1px solid hsl(220,15%,22%)",
                            borderRadius: "10px",
                            color: "hsl(0,0%,95%)",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                        }}
                        cursor={{ stroke: "hsl(330,80%,60%)", strokeWidth: 1, strokeDasharray: "4 4" }}
                        formatter={(value: number) => [
                            `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                            "Faturamento",
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="valor"
                        stroke="hsl(330,80%,60%)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorValor)"
                        dot={{ r: 4, fill: "hsl(330,80%,60%)", strokeWidth: 2, stroke: "hsl(220,18%,10%)" }}
                        activeDot={{
                            r: 6,
                            fill: "hsl(330,80%,60%)",
                            strokeWidth: 3,
                            stroke: "hsl(220,18%,10%)",
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
