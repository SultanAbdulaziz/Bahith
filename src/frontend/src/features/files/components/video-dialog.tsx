import { useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { getPlaybackUrl } from "@/features/search/api"
import type { VideoFile } from "../types"

type VideoDialogProps = {
  file: VideoFile
  title: string
  // The button that opens the dialog.
  children: ReactNode
}

// Plays a whole video in a popup. Playback links expire after an hour, so a fresh one is fetched on every open.
export function VideoDialog({ file, title, children }: VideoDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  const changeOpen = async (next: boolean) => {
    setOpen(next)
    setUrl(null)
    if (!next) return
    try {
      setUrl(await getPlaybackUrl(file.id))
    } catch {
      toast.error(t("app.search.playError"))
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="px-5 py-4">
          <DialogTitle className="text-lg font-extrabold">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex aspect-video items-center justify-center border-t-2 border-ink bg-black">
          {url ? <video src={url} controls autoPlay playsInline className="size-full" /> : <Spinner className="size-6 text-white" />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
