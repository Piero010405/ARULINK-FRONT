import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

// ✅ Obtener todos los chats (GET)
export async function GET() {
  try {
    await connectDB();
    const chats = await Chat.find().sort({ updatedAt: -1 }); // ordena del más reciente al más antiguo
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener los chats:", error);
    return NextResponse.json({ error: "Error al obtener los chats" }, { status: 500 });
  }
}

// ✅ Crear un nuevo chat (POST)
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validar estructura mínima
    if (!data.userId || !data.name) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const newChat = await Chat.create({
      userId: data.userId,
      name: data.name,
      messages: data.messages || [],
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear el chat:", error);
    return NextResponse.json({ error: "Error al crear el chat" }, { status: 500 });
  }
}

// ✅ Eliminar chats antiguos (DELETE)
export async function DELETE() {
  try {
    await connectDB();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await Chat.deleteMany({ updatedAt: { $lt: oneWeekAgo } });

    return NextResponse.json(
      { message: "Chats antiguos eliminados", deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al eliminar chats antiguos:", error);
    return NextResponse.json({ error: "Error al eliminar chats antiguos" }, { status: 500 });
  }
}
