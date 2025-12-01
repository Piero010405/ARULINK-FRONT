"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

export default function DashboardChart({
  pending,
  assigned,
  activos,
}: {
  pending: number;
  assigned: number;
  activos: number;
}) {
  const data = [
    { name: "Pendientes", value: pending },
    { name: "Asignados", value: assigned },
    { name: "Activos", value: activos },
  ];

  const COLORS = ["#b71c1c", "#d32f2f", "#ef5350"];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Estado general</h2>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
