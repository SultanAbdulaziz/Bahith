import { PlayIcon } from "lucide-react"
import type { RefObject } from "react"
import { useTranslation } from "react-i18next"
import { formatTime } from "@/lib/format"
import { dotPattern } from "@/lib/styles"
import { cn } from "@/lib/utils"
import type { SearchResult } from "../types"

type VideoPanelProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  active: SearchResult | null
  activeLabel?: string
  onLoadedMetadata: () => void
  onError: () => void
}

// The player next to the results, with a placeholder until a result is picked and the result's text under it.
export function VideoPanel({ videoRef, active, activeLabel, onLoadedMetadata, onError }: VideoPanelProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-3xl chunky bg-card">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          controls
          playsInline
          onLoadedMetadata={onLoadedMetadata}
          onError={onError}
          className="size-full"
        />
        {!active && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-center text-sm text-muted-foreground",
              dotPattern,
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-lg border bg-background">
              <PlayIcon className="size-4" />
            </span>
            {t("app.search.playerEmpty")}
          </div>
        )}
      </div>
      {active && (
        <div className="space-y-2 border-t p-4 text-sm max-lg:hidden">
          <p className="text-sm font-semibold text-muted-foreground">
            {activeLabel} · {formatTime(active.meta.start)} – {formatTime(active.meta.end)}
          </p>
          <p dir="auto" className="leading-relaxed">
            {active.text}
          </p>
        </div>
      )}
    </div>
  )
}
