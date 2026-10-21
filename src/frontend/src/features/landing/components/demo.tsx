import { SearchXIcon, VideoOffIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Mascot, type MascotMood } from "@/components/shared/mascot"
import { Spinner } from "@/components/ui/spinner"
import { ResultList } from "@/features/search/components/result-list"
import { SearchBox } from "@/features/search/components/search-box"
import { useSearch } from "@/features/search/hooks/use-search"
import { resultKey, type SearchMode, type SearchResult } from "@/features/search/types"
import { getDemo } from "../api"

// How long the mascot keeps "talking" after an answer arrives.
const TALK_MS = 1600

// The same search box and results as the app, over the demo user's video. The mascot answers each search.
export function Demo() {
  const { t } = useTranslation()
  const [talking, setTalking] = useState(false)
  const talkTimer = useRef(0)

  const searchAndAnswer = async (query: string, mode: SearchMode) => {
    const response = await getDemo(query, mode)
    window.clearTimeout(talkTimer.current)
    setTalking(true)
    talkTimer.current = window.setTimeout(() => setTalking(false), TALK_MS)
    return response
  }

  const search = useSearch(searchAndAnswer)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [active, setActive] = useState<SearchResult | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    getDemo()
      .then((demo) => setVideoUrl(demo.video_url))
      .catch(() => setUnavailable(true))
    return () => window.clearTimeout(talkTimer.current)
  }, [])

  const select = (result: SearchResult) => {
    setActive(result)
    const video = videoRef.current
    if (!video) return
    video.currentTime = result.meta.start
    video.play().catch(() => {})
  }

  const found = search.response?.results.length ?? 0
  const mood: MascotMood = search.searching
    ? "searching"
    : talking
      ? "talking"
      : search.response && found === 0
        ? "sad"
        : "idle"
  const message = search.searching
    ? t("landing.demo.searching")
    : !search.response
      ? t("landing.demo.empty")
      : found === 0
        ? t("landing.demo.noResults")
        : t("landing.demo.found", { count: found })

  return (
    // No outer box: the search box floats on the page, with the results and the video as two blocks under it.
    <div className="flex flex-col gap-6">
      <SearchBox
        query={search.query}
        onQueryChange={search.setQuery}
        mode={search.mode}
        onModeChange={search.changeMode}
        onSubmit={search.submit}
        searching={search.searching}
        placeholder={t("landing.demo.placeholder")}
        disabled={unavailable}
        className="mx-auto w-full max-w-2xl bg-card"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="relative aspect-video overflow-hidden rounded-3xl chunky-lg bg-muted lg:order-last">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster="/demo/poster.jpg"
              controls
              playsInline
              preload="metadata"
              className="size-full"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 text-sm font-semibold text-muted-foreground">
              {unavailable ? (
                <>
                  <VideoOffIcon className="size-5" />
                  {t("landing.demo.unavailable")}
                </>
              ) : (
                <Spinner className="size-5" />
              )}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-3xl chunky-lg bg-card">
          <div className="max-h-96 overflow-y-auto lg:absolute lg:inset-0 lg:max-h-none">
            {/* The mascot "answers" in a speech bubble; his mouth moves for a moment when results arrive. */}
            <div className="sticky top-0 z-10 flex items-end gap-3 border-b bg-card p-4">
              <Mascot mood={mood} className="w-16 shrink-0" />
              <p
                key={message}
                className="flex-1 animate-in rounded-2xl rounded-es-sm chunky-sm bg-secondary px-3 py-2 text-sm font-semibold duration-300 fade-in zoom-in-90"
              >
                {message}
              </p>
            </div>
            {search.response && found > 0 && (
              <ResultList
                response={search.response}
                activeKey={active && resultKey(active)}
                onSelect={select}
                showCount={false}
              />
            )}
            {search.response && found === 0 && (
              <p className="flex items-center justify-center gap-2 p-6 text-sm font-semibold text-muted-foreground">
                <SearchXIcon className="size-4 shrink-0" />
                {t("landing.demo.noMatches", { query: search.response.query })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
