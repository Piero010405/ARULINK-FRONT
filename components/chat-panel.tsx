"use client"

import { useEffect, useState } from "react"

interface Message {
  sender: "user" | "admin"
  text: string
  time: string
}

interface Chat {
  _id: string
  userId: string
  name: string
  messages: Message[]
  updatedAt: string
}

export default function ChatPanel() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [search, setSearch] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  // Cargar chats desde la BD
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/chats")
        const data = await res.json()
        if (res.ok) setChats(data)
      } catch (error) {
        console.error("Error al obtener chats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [])

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  )

  // Enviar mensaje
  const handleSend = async () => {
    if (!selectedChat || !newMessage.trim()) return

    const newMsg: Message = {
      sender: "admin",
      text: newMessage,
      time: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedChat.userId,
          name: selectedChat.name,
          messages: [...selectedChat.messages, newMsg],
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setChats((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        )
        setSelectedChat(updated)
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
    }
  }

  return (
    <div className="h-screen w-full flex bg-gray-100">
      {/* Panel izquierdo (lista de chats) */}
      <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar chat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-700 outline-none"
          />
          <button
            data-testid="send-button"
            onClick={handleSend}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
          >
            ✉
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400 mt-10">Cargando chats...</p>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                  selectedChat?._id === chat._id ? "bg-gray-100" : ""
                }`}
              >
                <p className="font-semibold text-gray-900">{chat.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {chat.messages.at(-1)?.text || "Sin mensajes"}
                </p>
                <p className="text-xs text-gray-400">{chat.updatedAt}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-10">No hay chats</p>
          )}
        </div>
      </aside>

      {/* Panel derecho (mensajes) */}
      <section className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header del chat */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">{selectedChat.name}</h2>
              <span className="text-xs text-gray-500">
                {new Date(selectedChat.updatedAt).toLocaleString("es-PE")}
              </span>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
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
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
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
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full font-medium transition cursor-pointer"
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
    </div>
  )
}
