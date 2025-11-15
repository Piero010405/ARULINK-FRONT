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
            className="bg-white text-red-800 font-bold px-3 py-1 rounded hover:bg-red-100 transition cursor-pointer"
        >
            Salir
        </button>
    )
}
