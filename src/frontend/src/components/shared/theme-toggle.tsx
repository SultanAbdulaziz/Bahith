import { useTranslation } from "react-i18next"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { buttonVariants } from "@/components/ui/button"
import { useTheme } from "@/providers/theme-provider"

// Magic UI's animated theme toggler: the new theme grows in a circle from this button. It's driven by our theme
// provider, and styled like a ghost icon button. No animation for people who ask for reduced motion.
export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={toggleTheme}
      duration={reduceMotion ? 0 : 550}
      aria-label={t("common.switchTheme")}
      data-slot="button"
      data-variant="ghost"
      data-size="icon"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    />
  )
}
