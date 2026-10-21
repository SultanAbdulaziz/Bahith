export type SearchMode = "bm25" | "boolean"

export type SearchResult = {
  file_id: string
  type: string
  text: string
  meta: { start: number; end: number }
  score: number | null
}

export type SearchResponse = {
  query: string
  mode: SearchMode
  total: number
  results: SearchResult[]
}

export const resultKey = (result: SearchResult) => `${result.file_id}-${result.meta.start}`
