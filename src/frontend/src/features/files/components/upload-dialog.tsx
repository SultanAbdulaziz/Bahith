import { UploadIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadDropzone } from "./upload-dropzone"
import { UploadList } from "./upload-list"

export function UploadDialog() {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-xl px-3">
          <UploadIcon />
          <span className="max-sm:sr-only">{t("app.upload.button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("app.upload.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("app.upload.dialogDescription")}</DialogDescription>
        </DialogHeader>
        <UploadDropzone />
        <UploadList />
      </DialogContent>
    </Dialog>
  )
}
