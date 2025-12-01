"use client";

export default function DashboardColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="flex-1 h-[400px] overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  );
}
