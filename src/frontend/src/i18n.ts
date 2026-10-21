import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import ar from "@/locales/ar.json"
import en from "@/locales/en.json"

export type Lang = "en" | "ar"

// Type check only: fails to compile if ar.json is missing a key that en.json has.
const arabic: typeof en = ar

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: arabic },
  },
  lng: localStorage.getItem("lang") === "en" ? "en" : "ar",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

declare module "i18next" {
  interface CustomTypeOptions {
    resources: { translation: typeof en }
  }
}

export default i18n
