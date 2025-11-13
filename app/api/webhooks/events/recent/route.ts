// app/api/webhooks/events/recent/route.ts
import { NextResponse } from "next/server";
import { webhookEvents } from "@/app/api/webhooks/waha/route";
import { nowISO } from "../../../../../lib/utils";

export async function GET() {
  const events = webhookEvents.slice(0, 50);
  return NextResponse.json({
    events,
    total: events.length,
    timestamp: nowISO(),
  });
}
