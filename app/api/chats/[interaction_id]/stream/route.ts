// app/api/chats/[interaction_id]/stream/route.ts
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";

export const dynamic = "force-dynamic"; // necesario para SSE

export async function GET(
  req: Request,
  context: { params: { interaction_id: string } }
) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const url = `${BACKEND_URL}/api/v1/chats/${context.params.interaction_id}/stream?token=${token}`;

  const backendResp = await fetch(url);

  return new Response(backendResp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}
