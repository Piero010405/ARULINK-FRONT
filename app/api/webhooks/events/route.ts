// app/api/webhooks/events/route.ts
import { NextResponse } from "next/server";
import { webhookEvents } from "@/app/api/webhooks/waha/route";
import { nowISO } from "../../../../lib/utils";

export async function DELETE() {
  const clearedCount = webhookEvents.length;
  webhookEvents.length = 0;

  return NextResponse.json({
    message: "Eventos limpiados exitosamente",
    cleared_count: clearedCount,
    timestamp: nowISO(),
  });
}
