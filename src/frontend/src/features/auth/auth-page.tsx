import { useTranslation } from "react-i18next"
import { Link, Navigate, useSearchParams } from "react-router"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStartApp } from "@/features/site/hooks/use-start-app"
import { ctaButton } from "@/lib/styles"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { SlideUp } from "@/components/shared/reveal"
import { AuthAside } from "./components/auth-aside"
import { LoginForm } from "./components/login-form"
import { RegisterForm } from "./components/register-form"

export default function AuthPage() {
  const { t } = useTranslation()
  const { dir } = useLanguage()
  const { user, loading } = useAuth()
  const { start, starting } = useStartApp()
  const [params, setParams] = useSearchParams()
  const tab = params.get("tab") === "register" ? "register" : "login"

  if (!loading && user && !user.is_guest) return <Navigate to="/app" replace />

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <SlideUp onMount stagger={0.06} className="w-full max-w-sm">
            <h1 className="text-4xl font-extrabold">{t("auth.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("auth.subtitle")}</p>

            <Tabs
              value={tab}
              onValueChange={(value) => setParams({ tab: value }, { replace: true })}
              dir={dir}
              className="mt-8"
            >
              <TabsList className="w-full">
                <TabsTrigger value="login">{t("auth.tabs.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.tabs.register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="pt-6">
                <RegisterForm />
              </TabsContent>
            </Tabs>

            <div className="my-6 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
              <Separator className="flex-1" />
              {t("auth.or")}
              <Separator className="flex-1" />
            </div>

            {user?.is_guest ? (
              <Button variant="outline" className={cn(ctaButton, "w-full")} asChild>
                <Link to="/app">{t("auth.backToApp")}</Link>
              </Button>
            ) : (
              <Button variant="outline" className={cn(ctaButton, "w-full")} onClick={start} disabled={starting}>
                {starting && <Spinner />}
                {t("auth.continueAsGuest")}
              </Button>
            )}
          </SlideUp>
        </main>
      </div>

      <AuthAside />
    </div>
  )
}
