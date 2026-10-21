import { useTranslation } from "react-i18next"
import { Eyebrow } from "@/components/shared/eyebrow"
import { SiteFooter } from "@/features/site/components/site-footer"
import { SiteNav } from "@/features/site/components/site-nav"
import { SlideUp } from "@/components/shared/reveal"

const SECTIONS = ["account", "videos", "transcription", "cookies", "tracking", "deletion"] as const

export default function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-svh">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 py-20 md:py-28">
        <SlideUp onMount stagger={0.08} className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t("privacy.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-5xl font-extrabold md:text-6xl">{t("privacy.title")}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{t("privacy.intro")}</p>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">{t("privacy.updated")}</p>
        </SlideUp>

        <SlideUp stagger={0.08} className="mt-16 overflow-hidden rounded-3xl chunky-lg bg-card">
          {SECTIONS.map((key, i) => (
            <section
              key={key}
              className="grid gap-4 border-b p-6 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10 md:p-10"
            >
              <div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full chunky-sm bg-primary text-sm font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <h2 className="mt-3 text-xl font-extrabold">{t(`privacy.sections.${key}.title`)}</h2>
              </div>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {t(`privacy.sections.${key}.body`, { returnObjects: true }).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </SlideUp>
      </main>
      <SiteFooter />
    </div>
  )
}
