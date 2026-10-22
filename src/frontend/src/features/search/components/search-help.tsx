import { CircleHelpIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// A "?" button next to the search modes that explains them, with examples of the Exact words rules
// (a space means OR, & means AND, whole words only).
export function SearchHelp() {
  const { t } = useTranslation()
  const examples = t("app.search.help.examples", { returnObjects: true })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={t("app.search.help.open")}>
          <CircleHelpIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-3 rounded-2xl text-sm">
        <h3 className="font-extrabold">{t("app.search.help.title")}</h3>
        <p>
          <span className="font-bold">{t("app.search.modes.bm25")}: </span>
          {t("app.search.help.bm25")}
        </p>
        <div className="space-y-2">
          <p>
            <span className="font-bold">{t("app.search.modes.boolean")}: </span>
            {t("app.search.help.boolean")}
          </p>
          <dl className="divide-y overflow-hidden rounded-xl chunky-sm">
            {examples.map(({ query, meaning }) => (
              <div key={query} className="flex items-center gap-3 px-3 py-2">
                <dt className="shrink-0">
                  <code dir="auto" className="rounded-md bg-secondary px-1.5 py-0.5 font-sans font-bold">
                    {query}
                  </code>
                </dt>
                <dd className="text-muted-foreground">{meaning}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-foreground">{t("app.search.help.wholeWords")}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
