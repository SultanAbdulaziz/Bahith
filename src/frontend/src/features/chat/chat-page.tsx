import { RotateCcwIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Message } from "@/components/ai-elements/message"
import { Eyebrow } from "@/components/shared/eyebrow"
import { Mascot } from "@/components/shared/mascot"
import { SlideUp } from "@/components/shared/reveal"
import { Button } from "@/components/ui/button"
import { useFiles } from "@/features/files/files-provider"
import { getPlaybackUrl } from "@/features/search/api"
import { NoVideosYet } from "@/features/search/components/search-states"
import { VideoPanel } from "@/features/search/components/video-panel"
import { useVideoPlayer } from "@/features/search/hooks/use-video-player"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/language-provider"
import { useChat } from "./chat-provider"
import { ChatInput } from "./components/chat-input"
import { ChatMessage } from "./components/chat-message"
import type { ChatSource } from "./types"

// Questions and answers about the user's videos, with the player next to them for the cited moments.
export default function ChatPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { files } = useFiles()
  const chat = useChat()
  const player = useVideoPlayer(getPlaybackUrl)
  const [fileId, setFileId] = useState<string | null>(null)
  const [active, setActive] = useState<ChatSource | null>(null)

  // Videos have no names, so they're shown by their upload date.
  const readyFiles = files?.filter((file) => file.status === "done") ?? []
  const fileDates = new Map(readyFiles.map((file) => [file.id, formatDate(file.created_at, lang)]))

  const play = (source: ChatSource) => {
    setActive(source)
    player.play(source.file_id, source.start)
  }

  if (files && readyFiles.length === 0) return <NoVideosYet />

  return (
    <SlideUp onMount stagger={0.08} className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>{t("app.chat.eyebrow")}</Eyebrow>
          <h1 className="mt-2 text-4xl font-extrabold">{t("app.chat.title")}</h1>
        </div>
        {chat.turns.length > 0 && (
          <Button variant="outline" onClick={chat.reset} disabled={chat.waiting}>
            <RotateCcwIcon />
            {t("app.chat.newChat")}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Same as the search page: on phones the player sits above the chat once a source is picked. */}
        <aside
          className={cn(
            "sticky top-14 z-10 -mx-4 bg-background px-4 py-2 md:-mx-8 md:px-8 lg:order-last lg:top-22 lg:mx-0 lg:self-start lg:p-0",
            !active && "max-lg:hidden",
          )}
        >
          <VideoPanel
            videoRef={player.videoRef}
            active={active && { text: active.text, meta: { start: active.start, end: active.end } }}
            activeLabel={active ? fileDates.get(active.file_id) : undefined}
            onLoadedMetadata={player.onLoadedMetadata}
            onError={player.onError}
          />
        </aside>

        <section className="flex h-[70svh] min-h-[28rem] flex-col overflow-hidden rounded-3xl chunky bg-card">
          <Conversation>
            <ConversationContent className="gap-6">
              {chat.turns.length === 0 ? (
                <ConversationEmptyState className="py-16">
                  <Mascot className="mb-2 w-20" />
                  <h2 className="text-xl font-extrabold">{t("app.chat.emptyTitle")}</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">{t("app.chat.emptyBody")}</p>
                </ConversationEmptyState>
              ) : (
                chat.turns.map((turn) => (
                  <ChatMessage
                    key={turn.id}
                    turn={turn}
                    talking={chat.talkingId === turn.id}
                    onPlay={play}
                    describe={(source) => fileDates.get(source.file_id)}
                  />
                ))
              )}
              {chat.waiting && (
                <Message from="assistant" className="flex-row items-center gap-3">
                  <Mascot mood="searching" className="w-11 shrink-0" />
                  <p className="animate-pulse text-sm font-semibold text-muted-foreground">{t("app.chat.thinking")}</p>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="border-t-2 border-ink p-3">
            <ChatInput
              files={readyFiles}
              fileId={fileId}
              onFileChange={setFileId}
              describeFile={(file) => fileDates.get(file.id) ?? ""}
              waiting={chat.waiting}
              onAsk={(question) => chat.ask(question, fileId)}
            />
          </div>
        </section>
      </div>
    </SlideUp>
  )
}
