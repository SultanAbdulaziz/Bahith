import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

// Takes the place of the block's team switcher: the logo, linking home.
export function SidebarBrand() {
  const { t } = useTranslation()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/">
            <img src="/brand/bahith-favicon.svg" alt="" className="size-8 rounded-[22%] chunky-sm" />
            <span className="truncate text-lg font-extrabold">{t("common.appName")}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
