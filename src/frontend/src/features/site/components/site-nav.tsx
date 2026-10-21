import type { CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import { LanguageToggle } from "@/components/shared/language-toggle"
import CardNav from "@/components/CardNav"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useTheme } from "@/providers/theme-provider"
import { useSiteLinks } from "@/features/site/hooks/use-site-links"
import { SiteLink } from "./site-link"

export function SiteNav() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const groups = useSiteLinks()

  // The last card (Account) is filled with the accent color.
  const items = groups.map((group, i) =>
    i === groups.length - 1 ? { ...group, bgColor: "var(--primary)", textColor: "var(--primary-foreground)" } : group,
  )

  return (
    <header className="sticky top-3 z-50 px-4">
      <CardNav
        items={items}
        actions={
          <>
            <LanguageToggle />
            <ThemeToggle />
          </>
        }
        menuText={t("common.menu")}
        closeText={t("common.close")}
        theme={theme}
        surface="solid"
        maxWidth={1152}
        linkComponent={SiteLink}
        style={
          {
            // Chunky look: solid card, 2px ink outline, hard shadow (see design.md).
            "--cn-radius": "22px",
            "--cn-panel": "var(--card)",
            "--cn-solid": "var(--card)",
            "--cn-edge": "var(--ink)",
            "--cn-highlight": "transparent",
            "--cn-shadow": "4px 4px 0 0 var(--shadow), inset 0 0 0 1px var(--ink)",
            "--cn-text": "var(--foreground)",
            "--cn-muted": "var(--muted-foreground)",
            "--cn-hover": "var(--muted)",
            "--cn-ring": "var(--ink)",
            "--cn-tile": "var(--muted)",
            "--cn-tile-rim": "inset 0 0 0 2px var(--ink)",
            "--cn-cta": "var(--primary)",
            "--cn-cta-ink": "var(--primary-foreground)",
            "--cn-cta-shadow": "inset 0 0 0 2px var(--ink), 2px 2px 0 0 var(--shadow)",
            "--cn-cta-hover": "brightness(1.05)",
          } as CSSProperties
        }
      />
    </header>
  )
}
