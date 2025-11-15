"use client"

import { createContext } from "react"

export interface User {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
