import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DirectionProvider } from "@/components/ui/direction"
import i18n, { type Lang } from "@/i18n"

type LanguageContextValue = {
  lang: Lang
  dir: "ltr" | "rtl"
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(i18n.language as Lang)
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    i18n.changeLanguage(lang)
    document.title = i18n.t("common.appName")
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    localStorage.setItem("lang", lang)
  }, [lang, dir])

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang }}>
      <DirectionProvider dir={dir}>{children}</DirectionProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider")
  return context
}
