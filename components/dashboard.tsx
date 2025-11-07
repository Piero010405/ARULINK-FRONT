"use client"
import StatCard from "./stat-card"
import ActivityChart from "./activity-chart"
import ChatPanel from "./chat-panel"
import IndigenousPattern from "./indigenous-pattern"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar with Indigenous Pattern */}
      <div className="w-2 bg-gradient-to-b from-red-700 via-red-600 to-red-700">
        <IndigenousPattern />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-center">
          <h1 className="text-4xl font-serif font-light text-gray-900">Intranet</h1>
        </header>

        <div className="flex-1 overflow-auto flex">
          {/* Central Panel */}
          <div className="flex-1 px-8 py-8 border-r border-gray-200 overflow-auto">
            {/* Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Aru Link - Manage</h2>
              <p className="text-gray-600 font-light mt-1">Oficina Pública Defensora - Condorcanqui</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatCard label="Casos totales" value="248" icon="📋" />
              <StatCard label="Personas" value="187" icon="👥" />
              <StatCard label="Activos" value="42" icon="⏱️" />
              <StatCard label="Resueltos" value="145" icon="✓" />
            </div>

            {/* Activity Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
              <ActivityChart />
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="w-96 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200 flex flex-col">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
