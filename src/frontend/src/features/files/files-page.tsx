import { useTranslation } from "react-i18next"
import { Eyebrow } from "@/components/shared/eyebrow"
import { Mascot } from "@/components/shared/mascot"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { SlideUp } from "@/components/shared/reveal"
import { FileRow } from "./components/file-row"
import { UploadDropzone } from "./components/upload-dropzone"
import { UploadList } from "./components/upload-list"
import { useFiles } from "./files-provider"

export default function FilesPage() {
  const { t } = useTranslation()
  const { files } = useFiles()

  return (
    <SlideUp onMount stagger={0.06} className="mx-auto max-w-4xl space-y-8">
      <div>
        <Eyebrow>{t("app.files.eyebrow")}</Eyebrow>
        <h1 className="mt-2 text-4xl font-extrabold">{t("app.files.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("app.files.subtitle")}</p>
      </div>

      <UploadDropzone />
      <UploadList />

      {files === null ? (
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : files.length === 0 ? (
        <Empty className="rounded-3xl chunky">
          <EmptyHeader>
            <Mascot className="mb-4 w-24" />
            <EmptyTitle className="text-xl font-extrabold">{t("app.files.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("app.files.emptyBody")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="divide-y overflow-hidden rounded-3xl chunky">
          {files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
      )}
    </SlideUp>
  )
}
