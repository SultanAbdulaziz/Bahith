import { BookOpenIcon, ChevronDownIcon, PlayIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { formatTime } from "@/lib/format"
import type { ChatSource } from "../types"

type ChatSourcesProps = {
  sources: ChatSource[]
  onPlay: (source: ChatSource) => void
  // Extra text next to each source's time, e.g. the video's upload date.
  describe: (source: ChatSource) => string | undefined
}

// The excerpts an answer used, folded under the answer. Clicking one plays that moment.
export function ChatSources({ sources, onPlay, describe }: ChatSourcesProps) {
  const { t } = useTranslation()

  return (
    <Sources className="mb-0 text-sm text-foreground">
      <SourcesTrigger
        count={sources.length}
        className="font-semibold text-muted-foreground hover:text-foreground [&[data-state=open]>svg:last-child]:rotate-180"
      >
        <BookOpenIcon className="size-4" />
        {t("app.chat.sources", { count: sources.length })}
        <ChevronDownIcon className="size-4 transition-transform" />
      </SourcesTrigger>
      <SourcesContent className="w-full gap-0 overflow-hidden rounded-2xl chunky-sm bg-background">
        {sources.map((source) => (
          <Source
            key={source.number}
            href={`#source-${source.number}`}
            onClick={(event) => {
              event.preventDefault()
              onPlay(source)
            }}
            className="block space-y-1 border-b px-3 py-2.5 last:border-b-0 hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <CitationChip number={source.number} />
              <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums">
                <PlayIcon className="size-3" />
                {formatTime(source.start)}
              </span>
              <span className="truncate text-xs font-semibold text-muted-foreground">{describe(source)}</span>
            </span>
            <span dir="auto" className="line-clamp-2 block leading-relaxed text-muted-foreground">
              {source.text}
            </span>
          </Source>
        ))}
      </SourcesContent>
    </Sources>
  )
}

// The yellow number used for a source in the answer text and in the list.
export function CitationChip({ number }: { number: number }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full chunky-sm bg-primary px-1 text-xs leading-none font-bold text-primary-foreground tabular-nums">
      {number}
    </span>
  )
}
