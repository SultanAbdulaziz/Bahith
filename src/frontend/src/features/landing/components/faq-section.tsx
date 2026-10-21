import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/shared/eyebrow"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/providers/language-provider"
import { SlideUp } from "@/components/shared/reveal"

const FAQ = ["account", "languages", "time", "privacy", "words", "delete"] as const

export function FaqSection() {
  const { t } = useTranslation()
  const { dir } = useLanguage()

  return (
    <section id="faq" className="scroll-mt-24 px-4 pt-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow={t("landing.faq.eyebrow")} title={t("landing.faq.title")} />
        <SlideUp>
          <Accordion type="single" collapsible dir={dir} className="rounded-3xl chunky-lg bg-card">
            {FAQ.map((key) => (
              <AccordionItem key={key} value={key} className="px-6">
                <AccordionTrigger className="py-5 text-base">{t(`landing.faq.items.${key}.q`)}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {t(`landing.faq.items.${key}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SlideUp>
      </div>
    </section>
  )
}
