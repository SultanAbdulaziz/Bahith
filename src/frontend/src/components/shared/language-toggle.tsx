import { LanguagesIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/language-provider"

export function LanguageToggle() {
  const { t } = useTranslation()
  const { lang, setLang } = useLanguage()
  const other = lang === "ar" ? "en" : "ar"

  return (
    <Button variant="ghost" onClick={() => setLang(other)} lang={other}>
      <LanguagesIcon className="max-sm:hidden" />
      {t("common.otherLanguage")}
    </Button>
  )
}
