"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

import type { ChartDashboardProps } from "@/types/dashboard"

export default function ChartDashboard({ data }: ChartDashboardProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
          <XAxis
            dataKey="day"
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
            cursor={{ fill: "rgba(236, 72, 153, 0.1)" }}
            labelFormatter={(label) => `${label}`}
            formatter={(value: number) => [`${value} atividade${value !== 1 ? 's' : ''}`, 'Total']}
          />
          <Bar
            dataKey="atividades"
            fill="hsl(330,80%,60%)"
            radius={[8, 8, 0, 0]}
            name="Atividades"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}