import { api } from "@/lib/api"

export type User = {
  id: string
  email: string | null
  name: string | null
  is_guest: boolean
  is_email_verified: boolean
}

// One function per auth endpoint. The session itself lives in HttpOnly cookies set by the backend.

export function getMe() {
  return api<User>("/auth/me")
}

export function startGuestSession() {
  return api("/auth/guest", { method: "POST" })
}

export function login(email: string, password: string) {
  return api("/auth/login", { method: "POST", json: { email, password } })
}

export function register(email: string, password: string, name: string | null) {
  return api("/auth/register", { method: "POST", json: { email, password, name } })
}

export function logout() {
  return api("/auth/logout", { method: "POST" })
}
