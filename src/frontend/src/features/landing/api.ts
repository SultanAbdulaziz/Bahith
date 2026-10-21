import type { SearchMode, SearchResponse } from "@/features/search/types"
import { api } from "@/lib/api"

// GET /api/demo: public, no login. Always returns a playback link for the demo user's video;
// with a query it also returns search results over that user's videos.
export type DemoResponse = SearchResponse & { file_id: string; video_url: string }

export function getDemo(query = "", mode: SearchMode = "bm25") {
  return api<DemoResponse>(`/demo?${new URLSearchParams({ query, mode })}`)
}
