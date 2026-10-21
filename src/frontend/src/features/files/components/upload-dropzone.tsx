import { UploadIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { dotPattern } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { useFiles } from "../files-provider"

export function UploadDropzone() {
  const { t } = useTranslation()
  const { upload } = useFiles()
  const [dragging, setDragging] = useState(false)

  const uploadAll = (list: FileList | null) => Array.from(list ?? []).forEach((file) => upload(file))

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        uploadAll(e.dataTransfer.files)
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink bg-muted/30 p-10 text-center transition-colors hover:border-primary/60 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        dotPattern,
        dragging && "border-primary bg-primary/5",
      )}
    >
      <span className="mb-2 flex size-12 items-center justify-center rounded-2xl chunky-sm bg-primary text-primary-foreground">
        <UploadIcon className="size-5" />
      </span>
      <span className="font-medium">{t("app.upload.drop")}</span>
      <span className="text-sm font-semibold text-muted-foreground">{t("app.upload.hint")}</span>
      <input
        type="file"
        accept="video/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          uploadAll(e.target.files)
          e.target.value = ""
        }}
      />
    </label>
  )
}
