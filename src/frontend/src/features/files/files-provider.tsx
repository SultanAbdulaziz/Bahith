import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import * as filesApi from "./api"
import type { Upload, VideoFile } from "./types"

type FilesContextValue = {
  files: VideoFile[] | null
  uploads: Upload[]
  upload: (file: File) => Promise<void>
  remove: (id: string) => Promise<void>
}

const FilesContext = createContext<FilesContextValue | null>(null)

// Holds the user's file list (polled while videos are being transcribed) and the uploads in progress.
export function FilesProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<VideoFile[] | null>(null)
  const [uploads, setUploads] = useState<Upload[]>([])

  const reload = useCallback(
    () =>
      filesApi
        .listFiles()
        .then(setFiles)
        .catch(() => toast.error(t("common.somethingWrong"), { id: "files-error" })),
    [t],
  )

  useEffect(() => {
    reload()
  }, [reload])

  const processing = files?.some((file) => file.status === "pending" || file.status === "processing")
  useEffect(() => {
    if (!processing) return
    const timer = setInterval(reload, 3000)
    return () => clearInterval(timer)
  }, [processing, reload])

  const upload = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error(t("app.upload.notVideo", { name: file.name }))
      return
    }
    const key = crypto.randomUUID()
    const setProgress = (progress: number) =>
      setUploads((list) => list.map((item) => (item.key === key ? { ...item, progress } : item)))

    setUploads((list) => [...list, { key, name: file.name, progress: 0 }])
    try {
      const { file_id, upload_url } = await filesApi.createUpload(file.type)
      await filesApi.uploadToStorage(upload_url, file, setProgress)
      await filesApi.completeUpload(file_id)
      toast.success(t("app.upload.done", { name: file.name }))
    } catch {
      toast.error(t("app.upload.failed", { name: file.name }))
    } finally {
      setUploads((list) => list.filter((item) => item.key !== key))
      reload()
    }
  }

  const remove = async (id: string) => {
    await filesApi.deleteFile(id)
    setFiles((list) => list?.filter((file) => file.id !== id) ?? null)
  }

  return <FilesContext.Provider value={{ files, uploads, upload, remove }}>{children}</FilesContext.Provider>
}

export function useFiles() {
  const context = useContext(FilesContext)
  if (!context) throw new Error("useFiles must be used inside FilesProvider")
  return context
}
