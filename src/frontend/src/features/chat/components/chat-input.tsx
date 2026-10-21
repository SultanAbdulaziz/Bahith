import { FilmIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import type { VideoFile } from "@/features/files/types"

// The select needs a value for "all videos"; it's sent to the backend as no file id.
const ALL = "all"
// The backend rejects questions shorter than this.
const MIN_LENGTH = 2

type ChatInputProps = {
  files: VideoFile[]
  fileId: string | null
  onFileChange: (fileId: string | null) => void
  describeFile: (file: VideoFile) => string
  waiting: boolean
  onAsk: (question: string) => void
}

// The question box, with a picker to ask about all videos or just one.
export function ChatInput({ files, fileId, onFileChange, describeFile, waiting, onAsk }: ChatInputProps) {
  const { t } = useTranslation()

  return (
    <PromptInput
      onSubmit={({ text }) => {
        const question = text.trim()
        if (question.length >= MIN_LENGTH && !waiting) onAsk(question)
      }}
    >
      <PromptInputBody>
        <PromptInputTextarea dir="auto" placeholder={t("app.chat.placeholder")} className="text-base" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputSelect value={fileId ?? ALL} onValueChange={(value) => onFileChange(value === ALL ? null : value)}>
            <PromptInputSelectTrigger className="max-w-56 font-semibold">
              <FilmIcon className="size-4" />
              <PromptInputSelectValue />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value={ALL}>{t("app.chat.allVideos")}</PromptInputSelectItem>
              {files.map((file) => (
                <PromptInputSelectItem key={file.id} value={file.id}>
                  {describeFile(file)}
                </PromptInputSelectItem>
              ))}
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputTools>
        <PromptInputSubmit status={waiting ? "submitted" : undefined} disabled={waiting} aria-label={t("app.chat.send")} />
      </PromptInputFooter>
    </PromptInput>
  )
}
