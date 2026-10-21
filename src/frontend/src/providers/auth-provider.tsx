import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import * as authApi from "@/features/auth/api"
import type { User } from "@/features/auth/api"
import { setLogoutHandler } from "@/lib/api"

type AuthContextValue = {
  user: User | null
  loading: boolean
  continueAsGuest: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string | null) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLogoutHandler(() => setUser(null))
    authApi
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const continueAsGuest = async () => {
    await authApi.startGuestSession()
    setUser(await authApi.getMe())
  }

  const login = async (email: string, password: string) => {
    await authApi.login(email, password)
    setUser(await authApi.getMe())
  }

  const register = async (email: string, password: string, name: string | null) => {
    // The backend only upgrades a guest if the access cookie is still valid; /auth/me refreshes it if needed.
    if (user?.is_guest) await authApi.getMe()
    await authApi.register(email, password, name)
    setUser(await authApi.getMe())
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, continueAsGuest, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
