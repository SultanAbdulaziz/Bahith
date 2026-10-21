import { ChevronsUpDownIcon, LogOutIcon, UserPlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import type { User } from "@/features/auth/api"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"

// From the shadcn sidebar-07 block: the user button in the sidebar footer and its menu.
export function NavUser({ user }: { user: User }) {
  const { t } = useTranslation()
  const { dir } = useLanguage()
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const name = user.is_guest ? t("common.guest") : user.name || user.email || ""
  const email = user.is_guest ? "" : user.name ? (user.email ?? "") : ""
  const initials = name.slice(0, 1).toUpperCase()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const identity = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        {email && <span className="truncate text-xs">{email}</span>}
      </div>
    </>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir={dir}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {identity}
              <ChevronsUpDownIcon className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : dir === "rtl" ? "left" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">{identity}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.is_guest && (
              <DropdownMenuItem asChild>
                <Link to="/auth?tab=register">
                  <UserPlusIcon />
                  {t("common.signUp")}
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOutIcon />
              {t("common.logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
