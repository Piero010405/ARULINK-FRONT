"use client"

import { useState } from "react"

interface Message {
  id: string
  sender: "user" | "assistant"
  content: string
}

interface Conversation {
  id: string
  name: string
  topic: string
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Rosa Soria", topic: "Caso pendiente" },
  { id: "2", name: "Juan Pérez", topic: "Consulta general" },
  { id: "3", name: "María García", topic: "Seguimiento" },
  { id: "4", name: "Carlos López", topic: "Apelación" },
]

export default function ChatPanel() {
  const [selectedConvo, setSelectedConvo] = useState<string>(SAMPLE_CONVERSATIONS[0].id)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      content: "¿Cuál es el estado de mi caso?",
    },
    {
      id: "2",
      sender: "assistant",
      content: "Su caso está en revisión. Se espera una resolución dentro de 5 días hábiles.",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: newMessage,
      }
      setMessages([...messages, userMessage])
      setNewMessage("")

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          content: "Gracias por su mensaje. Estamos procesando su solicitud.",
        }
        setMessages((prev) => [...prev, assistantMessage])
      }, 500)
    }
  }

  const selectedConversation = SAMPLE_CONVERSATIONS.find((c) => c.id === selectedConvo)

  return (
    <div className="flex flex-col h-full">
      {/* Conversations List */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Conversaciones</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {SAMPLE_CONVERSATIONS.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                selectedConvo === convo.id ? "bg-red-50 border-l-2 border-red-700" : "hover:bg-gray-100"
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">{convo.name}</p>
              <p className="text-xs text-gray-600 mt-1">{convo.topic}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedConversation && (
          <>
            <div className="text-xs text-gray-500 text-center py-2">
              {selectedConversation.name} — {selectedConversation.topic}
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.sender === "user" ? "bg-white border border-gray-300 text-gray-900" : "bg-red-700 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribir mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 text-sm text-gray-900 placeholder-gray-400"
          />
          <button
            data-testid="send-button"
            onClick={handleSendMessage}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
          >
            ✉
          </button>
        </div>
      </div>
    </div>
  )
}
