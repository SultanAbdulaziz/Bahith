const normalize = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")

// Wraps the words of `text` that appear in `query` in <mark>, matching whole words like the search does.
export function highlight(text: string, query: string) {
  const terms = new Set(
    query
      .split(/[\s&]+/)
      .map(normalize)
      .filter(Boolean),
  )
  return text.split(/(\s+)/).map((part, i) =>
    terms.has(normalize(part)) ? (
      <mark key={i} className="rounded-sm bg-primary/15 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
