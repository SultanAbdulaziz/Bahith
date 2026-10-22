import { PlayIcon } from "lucide-react"
import { useRef, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { getPlaybackUrl } from "@/features/search/api"
import { formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { getTranscript } from "../api"
import type { TranscriptPiece, VideoFile } from "../types"

type VideoDialogProps = {
  file: VideoFile
  title: string
  // The button that opens the dialog.
  children: ReactNode
}

// Plays a whole video in a popup with its full transcript next to it. Clicking a line jumps there, and the line being
// spoken is highlighted. Playback links expire after an hour, so a fresh one is fetched on every open.
export function VideoDialog({ file, title, children }: VideoDialogProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<TranscriptPiece[] | null>(null)
  const [time, setTime] = useState(0)

  const changeOpen = async (next: boolean) => {
    setOpen(next)
    setUrl(null)
    setTranscript(null)
    setTime(0)
    if (!next) return
    try {
      const [playbackUrl, pieces] = await Promise.all([getPlaybackUrl(file.id), getTranscript(file.id)])
      setUrl(playbackUrl)
      setTranscript(pieces)
    } catch {
      toast.error(t("app.search.playError"))
      setOpen(false)
    }
  }

  const seek = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = seconds
    video.play().catch(() => {})
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-5xl">
        <DialogHeader className="px-5 py-4">
          <DialogTitle className="text-lg font-extrabold">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid border-t-2 border-ink lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex aspect-video items-center justify-center bg-black lg:self-start">
            {url ? (
              <video
                ref={videoRef}
                src={url}
                controls
                autoPlay
                playsInline
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                className="size-full"
              />
            ) : (
              <Spinner className="size-6 text-white" />
            )}
          </div>

          <section className="flex max-h-72 flex-col border-t-2 border-ink lg:max-h-[min(32rem,60svh)] lg:border-t-0 lg:border-s-2">
            <h3 className="border-b px-4 py-2 text-sm font-semibold text-muted-foreground">{t("app.files.transcript")}</h3>
            <div className="flex-1 overflow-y-auto">
              {transcript === null ? null : transcript.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  {file.status === "done" ? t("app.files.transcriptEmpty") : t("app.files.transcriptPending")}
                </p>
              ) : (
                <ol className="divide-y">
                  {transcript.map((piece) => {
                    const current = time >= piece.meta.start && time < piece.meta.end
                    return (
                      <li key={piece.meta.start}>
                        <button
                          type="button"
                          onClick={() => seek(piece.meta.start)}
                          className={cn(
                            "flex w-full gap-3 border-s-4 border-transparent px-4 py-3 text-start text-sm transition-colors hover:bg-muted",
                            current && "border-primary bg-secondary hover:bg-secondary",
                          )}
                        >
                          <span className="inline-flex h-fit shrink-0 items-center gap-1 rounded-full chunky-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground tabular-nums">
                            <PlayIcon className="size-3" />
                            {formatTime(piece.meta.start)}
                          </span>
                          <span dir="auto" className="leading-relaxed">
                            {piece.text}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
