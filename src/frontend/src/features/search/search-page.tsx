import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Eyebrow } from "@/components/shared/eyebrow"
import { useFiles } from "@/features/files/files-provider"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/language-provider"
import { SlideUp } from "@/components/shared/reveal"
import { getPlaybackUrl, searchVideos } from "./api"
import { ResultList } from "./components/result-list"
import { SearchBox } from "./components/search-box"
import { NoResults, NoVideosYet, SearchLoading, SearchStart } from "./components/search-states"
import { VideoPanel } from "./components/video-panel"
import { useSearch } from "./hooks/use-search"
import { useVideoPlayer } from "./hooks/use-video-player"
import { resultKey, type SearchResult } from "./types"

export default function SearchPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { files } = useFiles()
  const search = useSearch(searchVideos)
  const player = useVideoPlayer(getPlaybackUrl)
  const [active, setActive] = useState<SearchResult | null>(null)

  // Videos have no names, so results show the upload date of their video.
  const fileDates = new Map(files?.map((file) => [file.id, formatDate(file.created_at, lang)]))

  const select = (result: SearchResult) => {
    setActive(result)
    player.play(result.file_id, result.meta.start)
  }

  if (files && !files.some((file) => file.status === "done")) return <NoVideosYet />

  return (
    <SlideUp onMount stagger={0.08} className="mx-auto max-w-6xl space-y-8">
      <div>
        <Eyebrow>{t("app.search.eyebrow")}</Eyebrow>
        <h1 className="mt-2 text-4xl font-extrabold">{t("app.search.title")}</h1>
      </div>

      <SearchBox
        query={search.query}
        onQueryChange={search.setQuery}
        mode={search.mode}
        onModeChange={search.changeMode}
        onSubmit={search.submit}
        searching={search.searching}
        placeholder={t("app.search.placeholder")}
        autoFocus
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* On phones the player sits above the results and sticks to the top once a result is picked. */}
        <aside
          className={cn(
            "sticky top-14 z-10 -mx-4 bg-background px-4 py-2 md:-mx-8 md:px-8 lg:order-last lg:top-22 lg:mx-0 lg:self-start lg:p-0",
            !active && "max-lg:hidden",
          )}
        >
          <VideoPanel
            videoRef={player.videoRef}
            active={active}
            activeLabel={active ? fileDates.get(active.file_id) : undefined}
            onLoadedMetadata={player.onLoadedMetadata}
            onError={player.onError}
          />
        </aside>

        <section>
          {search.searching ? (
            <SearchLoading />
          ) : !search.response ? (
            <SearchStart />
          ) : search.response.results.length === 0 ? (
            <NoResults />
          ) : (
            <ResultList
              response={search.response}
              activeKey={active && resultKey(active)}
              onSelect={select}
              describe={(result) => fileDates.get(result.file_id)}
              className="overflow-hidden rounded-3xl chunky"
            />
          )}
        </section>
      </div>
    </SlideUp>
  )
}
