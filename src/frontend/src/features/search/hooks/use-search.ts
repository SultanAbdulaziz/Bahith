import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import type { SearchMode, SearchResponse } from "../types"

// Query, mode and results for a search box. `search` does the request, so the landing demo can reuse this
// with its own endpoint.
export function useSearch(search: (query: string, mode: SearchMode) => Promise<SearchResponse>) {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("bm25")
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const [searching, setSearching] = useState(false)

  const run = async (text: string, searchMode = mode) => {
    if (!text.trim()) return
    setQuery(text)
    setSearching(true)
    try {
      setResponse(await search(text, searchMode))
    } catch {
      toast.error(t("common.somethingWrong"))
    } finally {
      setSearching(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    run(query)
  }

  // Switching mode re-runs the last search in the new mode.
  const changeMode = (value: SearchMode) => {
    setMode(value)
    if (response) run(response.query, value)
  }

  return { query, setQuery, mode, changeMode, response, searching, run, submit }
}
