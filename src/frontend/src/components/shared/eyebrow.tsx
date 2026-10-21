import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SlideUp } from "./reveal"

// The small yellow pill above section titles, e.g. "#01 / Features".
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center rounded-full chunky-sm bg-primary px-3 py-0.5 text-sm font-extrabold text-primary-foreground",
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <SlideUp stagger={0.08} className="mx-auto mb-12 max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-4xl leading-tight font-extrabold text-balance md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </SlideUp>
  )
}
