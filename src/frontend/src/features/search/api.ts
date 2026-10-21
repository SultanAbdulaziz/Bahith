import { api } from "@/lib/api"
import type { SearchMode, SearchResponse } from "./types"

export function searchVideos(query: string, mode: SearchMode) {
  return api<SearchResponse>(`/search?${new URLSearchParams({ query, mode })}`)
}

// A presigned link to the video, valid for an hour.
export function getPlaybackUrl(fileId: string) {
  return api<string>(`/files/${fileId}/url`)
}
