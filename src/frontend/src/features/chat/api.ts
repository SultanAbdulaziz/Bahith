import { api } from "@/lib/api"
import type { ChatResponse, ChatRole } from "./types"

type AskBody = {
  question: string
  history: { role: ChatRole; content: string }[]
  // null asks about all the user's videos.
  file_id: string | null
}

// Answers a question from the user's video transcripts, with the excerpts it used.
export function askQuestion(body: AskBody) {
  return api<ChatResponse>("/chat", { method: "POST", json: body })
}
