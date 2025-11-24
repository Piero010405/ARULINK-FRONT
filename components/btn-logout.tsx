"use client"
import { useAuth } from "@/hooks/useAuth"

export default function BtnLogout() {

    const { logout } = useAuth()

    const handleLogout = (e: React.FormEvent) => {
        logout()
    }

    return (
         <button
            onClick={handleLogout}
            className="bg-white text-red-800 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition cursor-pointer"
        >
            Salir
        </button>
    )
}
