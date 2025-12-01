"use client";

import { usePendingChats } from "@/app/(dashboard)/gestionar-mensajes/hooks/usePendingChats";
import { useAssignedChats } from "@/app/(dashboard)/gestionar-mensajes/hooks/useAssignedChats";
import DashboardKPI from "@/components/dashboard/DashboardKPI";
import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardColumn from "@/components/dashboard/DashboardColumn";
import PendingChatsList from "@/components/dashboard/PendingChatsList";
import AssignedChatsList from "@/components/dashboard/AssignedChatsList";
import { ChatOverviewItem } from "@/types/chats";
import { useAuth } from "@/hooks/useAuth";

export default function MenuPrincipal() {
  const { pending } = usePendingChats();
  const { assigned } = useAssignedChats();
  const { user } = useAuth();

  const activosHoy = assigned.filter((c: ChatOverviewItem) => c.timestamp !== null).length;

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name ?? "Usuario"} 👋</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardKPI label="Pendientes" value={pending.length} />
        <DashboardKPI label="Asignados" value={assigned.length} />
        <DashboardKPI label="Activos Hoy" value={activosHoy} />
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Gráfica */}
        <DashboardChart
          pending={pending.length}
          assigned={assigned.length}
          activos={activosHoy}
        />

        {/* Pendientes */}
        <DashboardColumn title="Pendientes por asignar">
          <PendingChatsList pending={pending} />
        </DashboardColumn>

        {/* Asignados */}
        <DashboardColumn title="Chats asignados recientes">
          <AssignedChatsList assigned={assigned} />
        </DashboardColumn>

      </div>
    </div>
  );
}
