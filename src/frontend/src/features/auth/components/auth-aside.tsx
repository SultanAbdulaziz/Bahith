import { LanguagesIcon, PlayIcon, SearchIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Eyebrow } from "@/components/shared/eyebrow"
import { Mascot } from "@/components/shared/mascot"
import { highlight } from "@/lib/highlight"
import { dotPattern } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { PopIn } from "@/components/shared/reveal"

const POINTS = [
  { key: "find", icon: SearchIcon },
  { key: "jump", icon: PlayIcon },
  { key: "languages", icon: LanguagesIcon },
] as const

// The decorative half of the login page: the mascot answering with a sample result, and three short points.
export function AuthAside() {
  const { t } = useTranslation()

  return (
    <aside
      className={cn(
        "relative hidden flex-col justify-between overflow-hidden border-s-2 border-ink bg-secondary p-12 lg:flex",
        dotPattern,
      )}
    >
      <PopIn onMount stagger={0.15} className="contents">
        <Eyebrow className="self-start">{t("auth.aside.eyebrow")}</Eyebrow>

        <div className="mx-auto flex w-full max-w-md items-end gap-4">
          <Mascot mood="talking" className="w-24 shrink-0" />
          <div dir="rtl" lang="ar" className="flex-1 space-y-2 rounded-3xl rounded-es-md chunky bg-card p-4">
            <span className="inline-flex items-center gap-1 rounded-full chunky-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground tabular-nums">
              <PlayIcon className="size-3" />
              0:30
            </span>
            <p className="text-sm leading-relaxed">
              {highlight(
                "بعدها اكتب أي كلمة تتذكرها مثل موعد الاختبار، وستظهر لك النتائج مع وقت كل لحظة",
                "موعد الاختبار",
              )}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl leading-tight font-extrabold xl:text-5xl">
            {t("auth.aside.title")}
            <br />
            <span className="mt-2 inline-block -rotate-2 rounded-2xl chunky bg-primary px-4 pb-1 text-primary-foreground">
              {t("auth.aside.titleAccent")}
            </span>
          </h2>
          <ul className="mt-10 space-y-4 text-lg font-semibold">
            {POINTS.map((point) => (
              <li key={point.key} className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl chunky-sm bg-primary text-primary-foreground">
                  <point.icon className="size-5" />
                </span>
                {t(`auth.aside.points.${point.key}`)}
              </li>
            ))}
          </ul>
        </div>
      </PopIn>
    </aside>
  )
}
