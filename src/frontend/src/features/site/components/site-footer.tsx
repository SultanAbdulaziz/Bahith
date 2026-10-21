import { ArrowUpIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Logo } from "@/components/shared/logo"
import { useSiteLinks } from "@/features/site/hooks/use-site-links"
import { SlideUp } from "@/components/shared/reveal"
import { SiteLink } from "./site-link"

export function SiteFooter() {
  const { t } = useTranslation()
  const groups = useSiteLinks()

  return (
    <footer className="px-4">
      <div className="mx-auto max-w-6xl">
        <SlideUp stagger={0.08} className="grid gap-10 border-t-2 border-ink py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-base font-extrabold">{group.label}</p>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <SiteLink href={link.href} className="font-medium underline-offset-4 hover:underline">
                      {link.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SlideUp>
        <div className="flex items-center justify-between border-t-2 border-ink py-6 text-sm font-semibold text-muted-foreground">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <button
            onClick={() => window.scrollTo({ top: 0 })}
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            {t("footer.backToTop")}
            <ArrowUpIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
