import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { Mascot } from "@/components/shared/mascot"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { PopIn } from "@/components/shared/reveal"

// The empty and loading states of the search page, each with the mascot in a matching mood.

export function NoVideosYet() {
  const { t } = useTranslation()
  return (
    <PopIn onMount>
      <Empty className="mx-auto mt-12 max-w-md">
        <EmptyHeader>
          <Mascot mood="sad" className="mb-4 w-24" />
          <EmptyTitle className="text-xl font-extrabold">{t("app.search.noVideosTitle")}</EmptyTitle>
          <EmptyDescription>{t("app.search.noVideosBody")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/app/files">{t("app.search.noVideosAction")}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </PopIn>
  )
}

export function SearchStart() {
  const { t } = useTranslation()
  return (
    <PopIn onMount>
      <Empty className="rounded-3xl chunky bg-card">
        <EmptyHeader>
          <Mascot className="mb-4 w-24" />
          <EmptyTitle className="text-xl font-extrabold">{t("app.search.startTitle")}</EmptyTitle>
          <EmptyDescription>{t("app.search.startBody")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PopIn>
  )
}

export function NoResults() {
  const { t } = useTranslation()
  return (
    <PopIn onMount>
      <Empty className="rounded-3xl chunky bg-card">
        <EmptyHeader>
          <Mascot mood="sad" className="mb-4 w-24" />
          <EmptyTitle className="text-xl font-extrabold">{t("app.search.noResultsTitle")}</EmptyTitle>
          <EmptyDescription>{t("app.search.noResultsBody")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PopIn>
  )
}

export function SearchLoading() {
  return (
    <div className="space-y-3">
      <Mascot mood="searching" className="mx-auto mb-2 w-20" />
      <Skeleton className="h-24 rounded-3xl" />
      <Skeleton className="h-24 rounded-3xl" />
    </div>
  )
}
