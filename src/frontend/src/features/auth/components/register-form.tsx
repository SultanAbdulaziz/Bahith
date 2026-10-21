import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api"
import { ctaButton } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { validatePassword } from "../validate-password"

export function RegisterForm() {
  const { t } = useTranslation()
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = String(form.get("password"))
    const problem = validatePassword(password)
    if (problem) return setError(t(problem))

    setPending(true)
    setError(null)
    try {
      await register(String(form.get("email")), password, String(form.get("name")).trim() || null)
      navigate("/app")
    } catch (err) {
      setError(
        err instanceof ApiError && err.message.includes("email")
          ? t("auth.errors.emailTaken")
          : t("common.somethingWrong"),
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user?.is_guest && (
        <p className="rounded-lg bg-primary/10 p-3 text-sm text-foreground">{t("auth.guestKeepsFiles")}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="register-name">
          {t("auth.name")} <span className="font-normal text-muted-foreground">{t("auth.optional")}</span>
        </Label>
        <Input id="register-name" name="name" autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">{t("auth.email")}</Label>
        <Input id="register-email" name="email" type="email" autoComplete="email" dir="ltr" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">{t("auth.password")}</Label>
        <Input id="register-password" name="password" type="password" autoComplete="new-password" required />
        <p className="text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className={cn(ctaButton, "w-full")} disabled={pending}>
        {pending && <Spinner />}
        {t("auth.submitRegister")}
      </Button>
    </form>
  )
}
