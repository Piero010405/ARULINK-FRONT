export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-white border-l-4 border-red-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
