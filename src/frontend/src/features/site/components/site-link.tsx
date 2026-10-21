import type { ComponentProps } from "react"
import { Link } from "react-router"

// Renders a site link: app routes go through the router, "/#section" links stay plain anchors.
export function SiteLink({ href, ...props }: ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("/") && !href.includes("#")) return <Link to={href} {...props} />
  return <a href={href} {...props} />
}
