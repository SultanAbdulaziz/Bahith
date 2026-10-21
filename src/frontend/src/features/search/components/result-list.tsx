import { PlayIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import AnimatedContent from "@/components/AnimatedContent"
import { formatTime } from "@/lib/format"
import { highlight } from "@/lib/highlight"
import { cn } from "@/lib/utils"
import { resultKey, type SearchResponse, type SearchResult } from "../types"

type ResultListProps = {
  response: SearchResponse
  activeKey: string | null
  onSelect: (result: SearchResult) => void
  // Extra text next to each result's time, e.g. the video's upload date.
  describe?: (result: SearchResult) => string | undefined
  showCount?: boolean
  className?: string
}

// Search results with their time, the matched words highlighted, and the selected one marked.
export function ResultList({ response, activeKey, onSelect, describe, showCount = true, className }: ResultListProps) {
  const { t } = useTranslation()

  return (
    <div className={className}>
      {showCount && (
        <p className="sticky top-0 border-b bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
          {response.mode === "boolean"
            ? t("app.search.matchesCount", { total: response.total, count: response.results.length })
            : t("app.search.resultsCount", { count: response.results.length })}
        </p>
      )}
      <AnimatedContent
        key={`${response.query}-${response.mode}`}
        trigger="mount"
        distance={12}
        duration={0.4}
        stagger={0.04}
        className="divide-y"
      >
        {response.results.map((result) => (
          <button
            key={resultKey(result)}
            onClick={() => onSelect(result)}
            className={cn(
              "block w-full space-y-2 border-s-4 border-transparent px-4 py-4 text-start transition-colors outline-none hover:bg-muted focus-visible:bg-muted",
              activeKey === resultKey(result) && "border-primary bg-secondary hover:bg-secondary",
            )}
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full chunky-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground tabular-nums">
                <PlayIcon className="size-3" />
                {formatTime(result.meta.start)}
              </span>
              {describe && (
                <span className="truncate text-sm font-semibold text-muted-foreground">{describe(result)}</span>
              )}
            </span>
            <span dir="auto" className="block leading-relaxed">
              {highlight(result.text, response.query)}
            </span>
          </button>
        ))}
      </AnimatedContent>
    </div>
  )
}
