import { CircleAlertIcon, CircleCheckIcon, ClockIcon, FilmIcon, Trash2Icon } from "lucide-react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import ShinyText from "@/components/ShinyText"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { EFFECT_COLORS } from "@/lib/effect-colors"
import { formatDate, formatTime } from "@/lib/format"
import { useLanguage } from "@/providers/language-provider"
import { useTheme } from "@/providers/theme-provider"
import { useFiles } from "../files-provider"
import type { FileStatus, VideoFile } from "../types"

const STATUS_ICON: Record<FileStatus, ReactNode> = {
  uploading: <ClockIcon />,
  pending: <ClockIcon />,
  processing: <Spinner />,
  done: <CircleCheckIcon />,
  failed: <CircleAlertIcon />,
}

export function FileRow({ file }: { file: VideoFile }) {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { remove } = useFiles()
  const { theme } = useTheme()
  const colors = EFFECT_COLORS[theme]

  const handleDelete = async () => {
    try {
      await remove(file.id)
      toast.success(t("app.files.deleted"))
    } catch {
      toast.error(t("common.somethingWrong"))
    }
  }

  return (
    <li className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/60">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl chunky-sm bg-primary">
        <FilmIcon className="size-5 text-primary-foreground" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{formatDate(file.created_at, lang)}</p>
        <p className="truncate text-sm text-muted-foreground tabular-nums">
          {file.status === "failed" && file.error ? (
            file.error
          ) : file.meta.duration !== undefined ? (
            <span className="tabular-nums">{formatTime(file.meta.duration)}</span>
          ) : (
            t("common.video")
          )}
        </p>
      </div>

      <Badge variant={file.status === "failed" ? "destructive" : "outline"} className="rounded-full text-xs">
        {STATUS_ICON[file.status]}
        {file.status === "processing" ? (
          <ShinyText text={t("app.files.status.processing")} color={colors.muted} shineColor={colors.text} speed={2} />
        ) : (
          t(`app.files.status.${file.status}`)
        )}
      </Badge>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("common.delete")}>
            <Trash2Icon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("app.files.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("app.files.deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  )
}
