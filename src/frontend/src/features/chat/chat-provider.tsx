import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ApiError } from "@/lib/api"
import { askQuestion } from "./api"
import type { ChatTurn } from "./types"

// The backend accepts up to 20 earlier messages of up to 4000 characters each.
const MAX_HISTORY = 20
const MAX_CONTENT = 4000

// How long the mascot keeps "talking" after an answer arrives.
const TALK_MS = 1600

type ChatContextValue = {
  turns: ChatTurn[]
  waiting: boolean
  // The answer the mascot is saying right now.
  talkingId: string | null
  ask: (question: string, fileId: string | null) => Promise<void>
  reset: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

// Keeps the conversation while moving between the app's pages. It lives in memory only, so a reload clears it.
export function ChatProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [waiting, setWaiting] = useState(false)
  const [talkingId, setTalkingId] = useState<string | null>(null)
  const talkTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(talkTimer.current), [])

  const addAnswer = (turn: Omit<ChatTurn, "id" | "role">) => {
    const id = crypto.randomUUID()
    setTurns((list) => [...list, { id, role: "assistant", ...turn }])
    setTalkingId(id)
    window.clearTimeout(talkTimer.current)
    talkTimer.current = window.setTimeout(() => setTalkingId(null), TALK_MS)
  }

  // Sends the question with the earlier messages, so follow-up questions make sense to the model.
  const ask = async (question: string, fileId: string | null) => {
    const history = turns
      .filter((turn) => !turn.failed)
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content: content.slice(0, MAX_CONTENT) }))
    setTurns((list) => [...list, { id: crypto.randomUUID(), role: "user", content: question }])
    setWaiting(true)
    try {
      const { answer, sources } = await askQuestion({ question, history, file_id: fileId })
      // No sources means nothing matched; the backend's message for that is English only.
      addAnswer({ content: sources.length ? answer : t("app.chat.noResults"), sources })
    } catch (error) {
      const busy = error instanceof ApiError && error.status === 429
      addAnswer({ content: t(busy ? "app.chat.busy" : "app.chat.failed"), failed: true })
    } finally {
      setWaiting(false)
    }
  }

  const reset = () => setTurns([])

  return <ChatContext.Provider value={{ turns, waiting, talkingId, ask, reset }}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChat must be used inside ChatProvider")
  return context
}
