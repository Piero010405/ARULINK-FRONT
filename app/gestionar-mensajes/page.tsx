"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/notificacion";

interface Chat {
  _id: string;
  userId: string;
  userName?: string;
  status: string;
  startedAt: string;
  lastMessage?: string;
  time?: string;
  messages?: { sender: "user" | "admin"; text: string; time: string }[];
}

export default function GestionarMensajes() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // 🧠 Normalizador (convierte fechas y estructura)
  const normalizeChat = (chat: any): Chat => {
    const messages = (chat.messages || []).map((m: any) => ({
      sender: m.sender,
      text: m.text,
      time: new Date(m.time).toISOString(),
    }));

    const last = messages[messages.length - 1];
    return {
      _id: chat._id,
      userId: chat.userId,
      userName: chat.userName || "Desconocido",
      status: chat.status,
      startedAt: new Date(chat.startedAt).toISOString(),
      lastMessage: chat.lastMessage || last?.text || "Sin mensajes aún",
      time: chat.time ? new Date(chat.time).toISOString() : last?.time || new Date().toISOString(),
      messages,
    };
  };

  // 🕒 Hora actual
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setDateTime(formatted.replace(",", " -"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 💬 Chat de ejemplo
  useEffect(() => {
  const fetchChats = async () => {
    try {
        const res = await fetch("/api/chats");
        const data = await res.json(); // <-- esperar la promesa correctamente
        console.log("Datos obtenidos:", data);

        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(normalizeChat);

          const newChats = normalized.filter(
            (newChat: Chat) => !chats.some((existing) => existing._id === newChat._id)
          );

          if (newChats.length > 0) {
            const first = newChats[0];
            setNotification(`📩 ${first.userName} te ha enviado: “${first.lastMessage}”`);
            setChats((prev) => [...prev, ...newChats]);
          }
        }
      } catch (err) {
        console.error("Error al verificar nuevos chats:", err);
      }
    };

    fetchChats();
  }, []); // <-- si dependes de `chats`, hay que incluirlo como dependencia


  // 🔄 Polling cada 20s
  useEffect(() => {
    const checkNewChats = async () => {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(normalizeChat);

          const newChats = normalized.filter(
            (newChat: Chat) => !chats.some((existing) => existing._id === newChat._id)
          );

          if (newChats.length > 0) {
            const first = newChats[0];
            setNotification(`📩 ${first.userName} te ha enviado: “${first.lastMessage}”`);
            setChats((prev) => [...prev, ...newChats]);
          }
        }
      } catch (err) {
        console.error("Error al verificar nuevos chats:", err);
      }
    };

    const interval = setInterval(checkNewChats, 20000);
    return () => clearInterval(interval);
  }, [chats]);

  const filteredChats = chats.filter((chat) =>
    (chat.userName || chat.userId).toLowerCase().includes(search.toLowerCase())
  );

  // 💬 Enviar mensaje desde admin
  const handleSend = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const now = new Date().toISOString();
    const updatedChats = chats.map((chat) =>
      chat._id === selectedChat._id
        ? {
            ...chat,
            messages: [
              ...(chat.messages || []),
              { sender: "admin", text: newMessage, time: now },
            ],
            lastMessage: newMessage,
            time: now,
          }
        : chat
    );

    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [
        ...(selectedChat.messages || []),
        { sender: "admin", text: newMessage, time: now },
      ],
      lastMessage: newMessage,
      time: now,
    });

    setNewMessage("");
  };

  // 🕓 Formateador robusto
  const formatTime = (input?: string | Date) => {
    if (!input) return "";
    const date = new Date(input);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden">
      {/* 🔴 Encabezado */}
      <header className="bg-red-800 text-white flex items-center justify-between px-6 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo_blanco.png" alt="Gobierno del Perú" className="h-10" />
        </div>
        <div className="text-lg font-bold">{dateTime}</div>
        <button
          onClick={() => router.push("/menu-principal")}
          className="bg-white text-red-800 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
        >
          Volver
        </button>
      </header>

      {/* 💬 Contenedor tipo WhatsApp */}
      <main className="flex flex-grow bg-gray-100 overflow-hidden">
        {/* Panel izquierdo */}
        <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col pr-4">
          <div className="p-3">
            <input
              type="text"
              placeholder="Buscar chat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-700 outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedChat?._id === chat._id ? "bg-gray-100" : ""
                }`}
              >
                <p className="font-semibold text-gray-900">{chat.userName || chat.userId}</p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                <span className="text-xs text-gray-400">{formatTime(chat.time)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Panel derecho */}
        <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {selectedChat ? (
            <>
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">{selectedChat.userName}</h2>
                <span className="text-xs text-gray-500">{formatTime(selectedChat.time)}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(selectedChat.messages || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm break-words ${
                        msg.sender === "admin"
                          ? "bg-red-700 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          msg.sender === "admin" ? "text-red-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Campo enviar */}
              <div className="bg-white border-t border-gray-200 p-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-700 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full font-medium transition"
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Selecciona un chat para comenzar
            </div>
          )}
        </section>
      </main>

      {notification && (
        <Notification message={notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}
