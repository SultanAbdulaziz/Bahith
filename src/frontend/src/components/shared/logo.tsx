import { useTranslation } from "react-i18next"
import { Link } from "react-router"

// The favicon tile (public/brand/bahith-favicon.svg) next to the name: باحث in Arabic, Bahith in English.
export function LogoMark() {
  const { t } = useTranslation()
  return (
    <span className="flex items-center gap-2 text-xl font-extrabold">
      {/* Sized inline: the card nav forces its own height on images inside the logo. */}
      <img
        src="/brand/bahith-favicon.svg"
        alt=""
        className="rounded-[22%] chunky-sm"
        style={{ width: 32, height: 32 }}
      />
      {t("common.appName")}
    </span>
  )
}

export function Logo() {
  return (
    <Link to="/">
      <LogoMark />
    </Link>
  )
}
