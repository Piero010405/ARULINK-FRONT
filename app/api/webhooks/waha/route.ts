// app/api/webhooks/waha/route.ts
import { NextRequest, NextResponse } from "next/server";
import { makeResponse, nowISO } from "../../../../lib/utils";

let webhookEvents: any[] = []; // memoria temporal (puede moverse a Redis o DB)

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    if (!event?.event) {
      return NextResponse.json(
        { detail: "Evento inválido o sin tipo definido" },
        { status: 400 }
      );
    }

    webhookEvents.unshift({
      ...event,
      received_at: nowISO(),
    });

    return NextResponse.json(
      makeResponse("success", "Evento procesado exitosamente", event.event),
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { detail: "Error procesando el evento", error: err?.message },
      { status: 500 }
    );
  }
}

// Exportamos los eventos en memoria para reutilizar en otros endpoints
export { webhookEvents };
