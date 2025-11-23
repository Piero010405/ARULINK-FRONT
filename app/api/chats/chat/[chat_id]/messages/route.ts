// app/api/chats/chat/[chat_id]/messages/route.ts
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function POST(_req: Request, { params }: { params: { chat_id: string } }) {
  try {
    const chat_id = params.chat_id;
    if (!chat_id) return NextResponse.json({ detail: "Missing chat_id" }, { status: 400 });

    const req = _req as Request;
    const body = await req.json(); // body should be { message: string } from frontend
    // MVP: only support plain text -> backend expects { type: 'text', body: '...' } or similar
    const payload = {
      type: "text",
      body: typeof body === "string" ? body : body.message ?? body.body ?? "",
    };

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const backendRes = await fetch(`${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.POST_CHAT_BY_ID(chat_id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await backendRes.text();
    // If backend returns non-json message, forward as text
    const status = backendRes.status;
    const contentType = backendRes.headers.get("content-type") ?? "";

    if (!backendRes.ok) {
      return NextResponse.json({ detail: "Error forwarding message", backend: text }, { status });
    }

    if (contentType.includes("application/json")) {
      return NextResponse.json(JSON.parse(text), { status });
    } else {
      return new NextResponse(text, { status, headers: { "Content-Type": contentType } });
    }
  } catch (err: any) {
    console.error("POST send message proxy error:", err);
    return NextResponse.json({ detail: "Error sending message", error: err?.message }, { status: 500 });
  }
}
