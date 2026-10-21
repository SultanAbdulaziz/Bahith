import type { ComponentProps } from "react"
import type { Components } from "streamdown"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Mascot } from "@/components/shared/mascot"
import { cn } from "@/lib/utils"
import type { ChatSource, ChatTurn } from "../types"
import { ChatSources, CitationChip } from "./chat-sources"

type ChatMessageProps = {
  turn: ChatTurn
  talking: boolean
  onPlay: (source: ChatSource) => void
  describe: (source: ChatSource) => string | undefined
}

// Turns the answer's [n] marks into links, so they render as clickable source numbers.
function linkCitations(answer: string) {
  return answer.replace(/\[(\d+)\]/g, "[$1](#source-$1)")
}

// A question in a bubble, or the mascot's answer with its sources under it.
export function ChatMessage({ turn, talking, onPlay, describe }: ChatMessageProps) {
  if (turn.role === "user") {
    return (
      <Message from="user">
        <MessageContent dir="auto" className="rounded-2xl rounded-ee-sm chunky-sm text-base font-semibold whitespace-pre-wrap">
          {turn.content}
        </MessageContent>
      </Message>
    )
  }

  const sources = turn.sources ?? []
  const CitationLink = ({ href, children }: ComponentProps<"a">) => {
    const source = sources.find((item) => `#source-${item.number}` === href)
    if (!source) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className="font-semibold underline">
          {children}
        </a>
      )
    }
    return (
      <button type="button" onClick={() => onPlay(source)} className="mx-0.5 align-middle">
        <CitationChip number={source.number} />
      </button>
    )
  }

  return (
    <Message from="assistant" className="flex-row items-start gap-3">
      <Mascot mood={talking ? "talking" : turn.failed ? "sad" : "idle"} className="w-11 shrink-0" />
      <div className="min-w-0 flex-1 space-y-3 pt-1">
        <MessageContent className={cn("text-base leading-relaxed", turn.failed && "text-muted-foreground")}>
          {/* Streamdown's Components type can't express a plain link component, hence the cast. */}
          <MessageResponse dir="auto" components={{ a: CitationLink } as Components}>
            {linkCitations(turn.content)}
          </MessageResponse>
        </MessageContent>
        {sources.length > 0 && <ChatSources sources={sources} onPlay={onPlay} describe={describe} />}
      </div>
    </Message>
  )
}
