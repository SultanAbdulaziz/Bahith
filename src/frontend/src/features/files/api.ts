import { api } from "@/lib/api"
import type { VideoFile } from "./types"

// One function per step of the upload flow and per files endpoint.

export function listFiles() {
  return api<VideoFile[]>("/files")
}

// Step 1: ask the backend for an upload URL. The URL only accepts a file of exactly this size.
export function createUpload(contentType: string, sizeBytes: number) {
  return api<{ file_id: string; upload_url: string }>("/files", {
    method: "POST",
    json: { content_type: contentType, size_bytes: sizeBytes },
  })
}

// Step 2: send the file straight to storage. XHR instead of fetch, because fetch can't report upload progress.
export function uploadToStorage(url: string, file: File, onProgress: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed with ${xhr.status}`)))
    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(file)
  })
}

// Step 3: tell the backend the file is in storage, so the worker picks it up.
export function completeUpload(fileId: string) {
  return api(`/files/${fileId}/complete`, { method: "POST" })
}

export function deleteFile(fileId: string) {
  return api(`/files/${fileId}`, { method: "DELETE" })
}
