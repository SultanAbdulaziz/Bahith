import { ArrowUpIcon, SearchIcon } from "lucide-react"
import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { SearchMode } from "../types"

type SearchBoxProps = {
  query: string
  onQueryChange: (query: string) => void
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
  onSubmit: (e: FormEvent) => void
  searching: boolean
  placeholder: string
  disabled?: boolean
  autoFocus?: boolean
  showModeHelp?: boolean
  className?: string
}

// The search input with the two search modes, used in the app and in the landing page demo.
export function SearchBox({
  query,
  onQueryChange,
  mode,
  onModeChange,
  onSubmit,
  searching,
  placeholder,
  disabled,
  autoFocus,
  showModeHelp,
  className,
}: SearchBoxProps) {
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className={cn("rounded-3xl chunky bg-background shadow-xl shadow-black/5", className)}>
      <div className="flex items-center gap-3 px-4 pt-3">
        <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          dir="auto"
          autoFocus={autoFocus}
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-3 px-3 pb-3">
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={mode}
          onValueChange={(value: SearchMode | "") => value && onModeChange(value)}
        >
          <ToggleGroupItem value="bm25" className="text-sm">
            {t("app.search.modes.bm25")}
          </ToggleGroupItem>
          <ToggleGroupItem value="boolean" className="text-sm">
            {t("app.search.modes.boolean")}
          </ToggleGroupItem>
        </ToggleGroup>
        {showModeHelp && (
          <p className="min-w-0 flex-1 text-xs text-muted-foreground max-sm:hidden">
            {t(`app.search.modeHelp.${mode}`)}
          </p>
        )}
        <Button
          type="submit"
          size="icon"
          className="ms-auto rounded-full"
          disabled={searching || disabled}
          aria-label={t("app.search.button")}
        >
          {searching ? <Spinner /> : <ArrowUpIcon />}
        </Button>
      </div>
    </form>
  )
}
