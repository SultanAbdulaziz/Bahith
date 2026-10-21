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

export function LoginForm() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    try {
      await login(String(form.get("email")), String(form.get("password")))
      navigate("/app")
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401 ? t("auth.errors.wrongCredentials") : t("common.somethingWrong"),
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">{t("auth.email")}</Label>
        <Input id="login-email" name="email" type="email" autoComplete="email" dir="ltr" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">{t("auth.password")}</Label>
        <Input id="login-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className={cn(ctaButton, "w-full")} disabled={pending}>
        {pending && <Spinner />}
        {t("auth.submitLogin")}
      </Button>
    </form>
  )
}
