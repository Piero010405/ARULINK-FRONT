"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Lun", value: 12 },
  { day: "Mar", value: 15 },
  { day: "Mié", value: 14 },
  { day: "Jue", value: 18 },
  { day: "Vie", value: 22 },
  { day: "Sab", value: 8 },
  { day: "Dom", value: 5 },
]

export default function ActivityChart() {
  return (
    <div data-testid="activity-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} data-testid="line-chart">
          <CartesianGrid data-testid="grid" strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day" data-testid="x-axis" stroke="#999" />
          <YAxis data-testid="y-axis" stroke="#999" />
          <Tooltip data-testid="tooltip" />
          <Line
            data-testid="line"
            type="monotone"
            dataKey="value"
            stroke="#C11012"
            strokeWidth={3}
            dot={{ fill: "#C11012", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
