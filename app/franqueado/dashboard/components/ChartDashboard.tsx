"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function ChartDashboard() {
  const data = [
    { day: "Seg", atividades: 12 },
    { day: "Ter", atividades: 19 },
    { day: "Qua", atividades: 8 },
    { day: "Qui", atividades: 15 },
    { day: "Sex", atividades: 22 },
    { day: "Sáb", atividades: 7 },
    { day: "Dom", atividades: 5 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            cursor={{ fill: "rgba(236, 72, 153, 0.1)" }}
          />
          <Bar dataKey="atividades" fill="#EC4899" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}