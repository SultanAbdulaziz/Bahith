import { Progress } from "@/components/ui/progress"
import { useFiles } from "../files-provider"

export function UploadList() {
  const { uploads } = useFiles()
  if (!uploads.length) return null

  return (
    <ul className="space-y-3">
      {uploads.map((item) => (
        <li key={item.key} className="space-y-1.5">
          <div className="flex justify-between gap-4 text-sm">
            <span className="truncate">{item.name}</span>
            <span className="text-muted-foreground tabular-nums">{item.progress}%</span>
          </div>
          <Progress value={item.progress} />
        </li>
      ))}
    </ul>
  )
}
