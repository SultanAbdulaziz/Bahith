import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"

// Asks guests to create an account. Hidden when the sidebar is collapsed to icons.
export function GuestCard() {
  const { t } = useTranslation()

  return (
    <div className="space-y-3 rounded-2xl chunky-sm bg-card p-3 text-sm group-data-[collapsible=icon]:hidden">
      <p className="font-medium">{t("app.guestCard.title")}</p>
      <p className="text-muted-foreground">{t("app.guestCard.body")}</p>
      <Button asChild size="sm" className="w-full">
        <Link to="/auth?tab=register">{t("common.signUp")}</Link>
      </Button>
    </div>
  )
}
