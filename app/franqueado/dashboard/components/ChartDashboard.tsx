"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface ChartData {
  day: string
  atividades: number
  data: string
}

interface ChartDashboardProps {
  data: ChartData[]
}

export default function ChartDashboard({ data }: ChartDashboardProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            cursor={{ fill: "rgba(236, 72, 153, 0.1)" }}
            labelFormatter={(label) => `${label}`}
            formatter={(value: number) => [`${value} atividade${value !== 1 ? 's' : ''}`, 'Total']}
          />
          <Bar 
            dataKey="atividades" 
            fill="#EC4899" 
            radius={[8, 8, 0, 0]}
            name="Atividades"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}