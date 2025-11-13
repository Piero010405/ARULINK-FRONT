import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, userName, phoneNumber, message } = await req.json();
    const now = new Date();

    const chat = await Chat.create({
      userId,
      userName,
      phoneNumber,
      messages: [
        { sender: "user", text: message, time: now },
      ],
      lastMessage: message,
      time: now,
      status: "pending",
      startedAt: now,
    });

    // 🔁 Enviar el formato exacto que espera el frontend
    return NextResponse.json({
      _id: chat._id.toString(),
      userId: chat.userId,
      userName: chat.userName,
      status: chat.status,
      startedAt: chat.startedAt.toISOString(),
      lastMessage: chat.lastMessage,
      time: chat.time.toISOString(),
      messages: chat.messages.map((m) => ({
        sender: m.sender,
        text: m.text,
        time: m.time.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error en mock-whatsapp:", error);
    return NextResponse.json(
      { success: false, error: "Error creando chat" },
      { status: 500 }
    );
  }
}
