export type FileStatus = "uploading" | "pending" | "processing" | "done" | "failed"

export type VideoFile = {
  id: string
  type: string
  status: FileStatus
  meta: { duration?: number }
  error: string | null
  created_at: string
}

// A file being sent from the browser to storage, shown with a progress bar until it's done.
export type Upload = {
  key: string
  name: string
  progress: number
}

// One 15-second piece of a video's transcript.
export type TranscriptPiece = {
  text: string
  meta: { start: number; end: number }
}
