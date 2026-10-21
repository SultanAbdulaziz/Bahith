import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

// Plays a file from a given second. Loads the file's URL only when switching files, and when a URL has expired
// (playing or seeking fails), fetches a fresh one once and continues from the same spot.
export function useVideoPlayer(getUrl: (fileId: string) => Promise<string>) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const loadedFileId = useRef<string | null>(null)
  const startAt = useRef(0)
  const retried = useRef(false)

  const play = async (fileId: string, start: number) => {
    const video = videoRef.current!
    if (loadedFileId.current === fileId) {
      video.currentTime = start
      video.play().catch(() => {})
      return
    }
    try {
      const url = await getUrl(fileId)
      loadedFileId.current = fileId
      startAt.current = start
      video.src = url
    } catch {
      toast.error(t("app.search.playError"))
    }
  }

  const onLoadedMetadata = () => {
    const video = videoRef.current!
    retried.current = false
    video.currentTime = startAt.current
    video.play().catch(() => {})
  }

  const onError = async () => {
    const video = videoRef.current!
    if (!loadedFileId.current || retried.current) {
      toast.error(t("app.search.playError"))
      return
    }
    retried.current = true
    startAt.current = video.currentTime
    video.src = await getUrl(loadedFileId.current)
  }

  return { videoRef, play, onLoadedMetadata, onError }
}
