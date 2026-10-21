import { FilmIcon, SearchIcon } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { GuestCard } from "./guest-card"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { SidebarBrand } from "./sidebar-brand"

// From the shadcn sidebar-07 block: collapses to icons, user menu in the footer.
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { dir } = useLanguage()
  const { user } = useAuth()

  const navMain = [
    { title: t("app.nav.search"), url: "/app/search", icon: <SearchIcon /> },
    { title: t("app.nav.files"), url: "/app/files", icon: <FilmIcon /> },
  ]

  return (
    <Sidebar collapsible="icon" side={dir === "rtl" ? "right" : "left"} dir={dir} {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain label={t("app.nav.section")} items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user?.is_guest && <GuestCard />}
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
