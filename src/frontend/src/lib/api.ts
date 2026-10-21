const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"

// These auth calls answer 401 for wrong input, not for an expired session, so they never trigger a refresh.
const NO_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/guest"]

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Refresh tokens are single-use, so only one refresh may be in flight at a time.
// `refreshCount` lets a request that failed during a refresh retry without refreshing again.
let refreshing: Promise<boolean> | null = null
let refreshCount = 0
let onLoggedOut = () => {}

export function setLogoutHandler(handler: () => void) {
  onLoggedOut = handler
}

function refresh() {
  refreshing ??= fetch(`${BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" })
    .then((res) => {
      refreshCount++
      return res.ok
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

type Options = {
  method?: string
  json?: unknown
}

export async function api<T = void>(path: string, { method = "GET", json }: Options = {}): Promise<T> {
  const send = () =>
    fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: json === undefined ? undefined : { "Content-Type": "application/json" },
      body: json === undefined ? undefined : JSON.stringify(json),
    })

  if (refreshing) await refreshing
  const countBefore = refreshCount
  let res = await send()

  if (res.status === 401 && !NO_REFRESH.includes(path)) {
    const refreshed = countBefore === refreshCount ? await refresh() : true
    if (refreshed) res = await send()
    if (res.status === 401) onLoggedOut()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.detail ?? res.statusText)
  }

  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
