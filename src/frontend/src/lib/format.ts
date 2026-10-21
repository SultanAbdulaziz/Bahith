import type { Lang } from "@/i18n"

// 75 -> "1:15", 3725 -> "1:02:05"
export function formatTime(seconds: number) {
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function formatDate(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-u-nu-latn" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}
