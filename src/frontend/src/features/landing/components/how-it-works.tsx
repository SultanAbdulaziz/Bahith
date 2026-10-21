import { AudioLinesIcon, MousePointerClickIcon, UploadIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/shared/eyebrow"
import { SlideUp } from "@/components/shared/reveal"

const STEPS = [
  { key: "upload", icon: UploadIcon },
  { key: "wait", icon: AudioLinesIcon },
  { key: "search", icon: MousePointerClickIcon },
] as const

export function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section id="how" className="scroll-mt-24 px-4 pt-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t("landing.how.eyebrow")}
          title={t("landing.how.title")}
          subtitle={t("landing.how.subtitle")}
        />
        <SlideUp stagger={0.1} className="overflow-hidden rounded-3xl chunky-lg bg-card">
          {STEPS.map((step, i) => (
            <div
              key={step.key}
              className="grid gap-3 border-b p-6 last:border-b-0 md:grid-cols-[1fr_1.4fr_1fr] md:items-center md:gap-8 md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full chunky-sm bg-primary text-sm font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="text-xl font-extrabold">{t(`landing.how.steps.${step.key}.title`)}</h3>
              </div>
              <p className="text-muted-foreground">{t(`landing.how.steps.${step.key}.body`)}</p>
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground md:justify-end">
                <step.icon className="size-4" />
                {t(`landing.how.steps.${step.key}.detail`)}
              </p>
            </div>
          ))}
        </SlideUp>
      </div>
    </section>
  )
}
