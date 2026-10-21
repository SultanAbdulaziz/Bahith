import { SparkleIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useStartApp } from "@/features/site/hooks/use-start-app"
import { ctaButton } from "@/lib/styles"
import { useAuth } from "@/providers/auth-provider"
import { PopIn } from "@/components/shared/reveal"

export function CallToAction() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { start, starting } = useStartApp()

  return (
    <section className="px-4 py-28">
      <PopIn className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] chunky-lg bg-primary px-6 py-20 text-center text-primary-foreground md:py-24">
        {/* Decorative shapes in black, so they look the same on the yellow in both themes. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -start-20 -top-20 size-36 rounded-full border-[3px] sm:-start-12 sm:-top-12 sm:size-44 border-primary-foreground" />
          <span className="absolute -end-10 -bottom-14 size-28 rounded-full bg-primary-foreground/10 sm:size-40" />
          <span className="absolute end-[12%] top-10 size-7 rotate-45 rounded-[3px] bg-primary-foreground" />
          <span className="absolute start-[16%] bottom-12 size-6 rotate-12 rounded-[3px] border-[3px] border-primary-foreground max-sm:hidden" />
          <SparkleIcon className="absolute end-[22%] bottom-10 size-9 fill-primary-foreground max-sm:hidden" />
          <SparkleIcon className="absolute start-[10%] top-1/2 size-6 fill-primary-foreground max-md:hidden" />
        </div>
        <h2 className="mx-auto max-w-2xl text-4xl leading-tight font-extrabold text-balance md:text-6xl">
          {t("landing.cta.title")}
        </h2>
        <p className="mt-4 text-lg font-semibold">{t("landing.cta.subtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="outline" onClick={start} disabled={starting} className={ctaButton}>
            {starting && <Spinner />}
            {user ? t("common.openApp") : t("common.tryAsGuest")}
          </Button>
          {!user && (
            <Button size="lg" variant="outline" asChild className={ctaButton}>
              <Link to="/auth?tab=register">{t("common.signUp")}</Link>
            </Button>
          )}
        </div>
      </PopIn>
    </section>
  )
}
