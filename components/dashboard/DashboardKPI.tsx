"use client";

export default function DashboardKPI({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
