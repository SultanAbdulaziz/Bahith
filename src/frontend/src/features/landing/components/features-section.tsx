import { ClockIcon, LanguagesIcon, ListFilterIcon, UserRoundIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/shared/eyebrow"
import { cn } from "@/lib/utils"
import { PopIn } from "@/components/shared/reveal"

const FEATURES = [
  { key: "jump", icon: ClockIcon },
  { key: "modes", icon: ListFilterIcon },
  { key: "languages", icon: LanguagesIcon },
  { key: "guest", icon: UserRoundIcon },
] as const

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section id="features" className="scroll-mt-24 px-4 pt-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t("landing.features.eyebrow")}
          title={t("landing.features.title")}
          subtitle={t("landing.features.subtitle")}
        />
        <PopIn stagger={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.key}
              // Every other card tilts the other way, like stickers.
              className={cn(
                "pressable rounded-3xl chunky bg-card p-6 hover:shadow-[6px_6px_0_0_var(--shadow)]",
                i % 2 ? "rotate-1" : "-rotate-1",
              )}
            >
              <span className="flex size-12 items-center justify-center rounded-2xl chunky-sm bg-primary text-primary-foreground">
                <feature.icon className="size-6" />
              </span>
              <h3 className="mt-6 text-xl font-extrabold">{t(`landing.features.items.${feature.key}.title`)}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {t(`landing.features.items.${feature.key}.body`)}
              </p>
            </div>
          ))}
        </PopIn>
      </div>
    </section>
  )
}
