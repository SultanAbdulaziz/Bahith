export type ChatRole = "user" | "assistant"

// A transcript excerpt the answer used, numbered like the [n] marks in the answer.
export type ChatSource = {
  number: number
  file_id: string
  start: number
  end: number
  text: string
  score: number
  video_url: string
}

export type ChatResponse = {
  answer: string
  sources: ChatSource[]
}

// A message as the page shows it. `failed` marks an answer that never came, so it isn't sent back as history.
export type ChatTurn = {
  id: string
  role: ChatRole
  content: string
  sources?: ChatSource[]
  failed?: boolean
}
