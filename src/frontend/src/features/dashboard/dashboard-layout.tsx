import { useTranslation } from "react-i18next"
import { Link, Navigate, Outlet, useLocation } from "react-router"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Mascot } from "@/components/shared/mascot"
import { UploadDialog } from "@/features/files/components/upload-dialog"
import { FilesProvider } from "@/features/files/files-provider"
import { useAuth } from "@/providers/auth-provider"
import { AppSidebar } from "./components/app-sidebar"

// The logged-in area, laid out like the shadcn sidebar-07 block's page. Sends visitors without a session home.
export default function DashboardLayout() {
  const { t } = useTranslation()
  const { user, loading } = useAuth()
  const { pathname } = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Mascot mood="searching" className="w-20" />
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />

  const page = pathname.startsWith("/app/files") ? t("app.nav.files") : t("app.nav.search")

  return (
    <FilesProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b-2 border-ink bg-background/90 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ms-1" />
              <Separator orientation="vertical" className="me-2 data-vertical:h-4 data-vertical:self-auto" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/app">{t("common.appName")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{page}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ms-auto flex items-center gap-1 px-4">
              <LanguageToggle />
              <ThemeToggle />
              <UploadDialog />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </FilesProvider>
  )
}
