import { MoonIcon, SunIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme-provider"

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t("common.switchTheme")}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
