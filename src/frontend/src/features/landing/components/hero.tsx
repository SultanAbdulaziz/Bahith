import { useTranslation } from "react-i18next"
import Balatro from "@/components/Balatro"
import HoloCard from "@/components/HoloCard"
import SplitText from "@/components/SplitText"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/language-provider"
import { useTheme } from "@/providers/theme-provider"

// Full-screen hero: the headline on one side and the mascot's trading card (a ReactBits holo card) on the other.
// The card art is a rendered image per language: public/brand/bahith-card-{en,ar}.webp.
export function Hero() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { theme } = useTheme()

  return (
    // Pulled up under the sticky nav, so the background shows behind it.
    <section className="relative isolate -mt-18 flex min-h-svh flex-col justify-center overflow-hidden pt-18">
      {/* React Bits Balatro swirl in the brand colors, faded out over the lower half on an eased curve, so it melts into the page. It ignores the mouse. */}
      <div className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_0%,#000_35%,rgb(0_0_0/0.82)_50%,rgb(0_0_0/0.58)_63%,rgb(0_0_0/0.34)_75%,rgb(0_0_0/0.15)_86%,rgb(0_0_0/0.04)_94%,transparent_100%)]">
        <Balatro
          key={theme}
          color1="#f5c542"
          color2={theme === "dark" ? "#7a5f14" : "#ffe48a"}
          color3={theme === "dark" ? "#140d08" : "#fff8e7"}
          lightMode={theme === "light"}
          contrast={2.5}
          speed={0.6}
          opacity={theme === "dark" ? 0.7 : 0.85}
          mouseInteraction={false}
          clickSwirl={false}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <h1 className="text-center text-5xl leading-[1.2] font-extrabold md:text-6xl lg:text-start xl:text-7xl">
          <SplitText
            text={t("landing.hero.title")}
            tag="span"
            splitType="words"
            effect="rise"
            mask
            trigger="load"
            delay={80}
            duration={0.9}
            textAlign="inherit"
            className="pb-1"
          />
          <br />
          {/* The accent line is a tilted yellow sticker. The English line is longer, so it's set smaller to stay on one line like the Arabic. */}
          <span className={cn("mt-3 inline-block -rotate-2 rounded-2xl chunky-lg bg-primary px-5 pb-1 text-primary-foreground animate-in animation-duration-700 [--tw-animation-delay:300ms] fade-in slide-in-from-bottom-4 fill-mode-both", lang === "en" && "text-[0.75em]")}>
            {t("landing.hero.titleAccent")}
          </span>
        </h1>

        <div className="flex justify-center">
          <HoloCard
            key={lang}
            image={`/brand/bahith-card-${lang}.webp`}
            alt={t("common.appName")}
            preset="rainbow"
            width={340}
            radius={34}
            intensity={0.45}
            glare={0.35}
            className="animate-in animation-duration-700 zoom-in-75 fill-mode-both"
          />
        </div>
      </div>
    </section>
  )
}
