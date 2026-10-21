import { useTranslation } from "react-i18next"
import { useAuth } from "@/providers/auth-provider"

// The site's links, grouped the same way in the card nav and the footer.
export function useSiteLinks() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return [
    {
      label: t("nav.explore.label"),
      description: t("nav.explore.description"),
      links: [
        { label: t("nav.explore.demo"), href: "/#demo" },
        { label: t("nav.explore.how"), href: "/#how" },
        { label: t("nav.explore.features"), href: "/#features" },
      ],
    },
    {
      label: t("nav.help.label"),
      description: t("nav.help.description"),
      links: [
        { label: t("nav.help.faq"), href: "/#faq" },
        { label: t("nav.help.privacy"), href: "/privacy" },
      ],
    },
    {
      label: t("nav.account.label"),
      description: t("nav.account.description"),
      links: user
        ? [{ label: t("common.openApp"), href: "/app" }]
        : [
            { label: t("nav.account.logIn"), href: "/auth" },
            { label: t("nav.account.signUp"), href: "/auth?tab=register" },
          ],
    },
  ]
}
