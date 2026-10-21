import type { ReactNode } from "react"
import AnimatedContent from "@/components/AnimatedContent"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  // With a stagger, each direct child animates in turn instead of the whole block at once.
  stagger?: number
  // Animate when the page opens instead of when scrolled into view.
  onMount?: boolean
}

// Both wrap React Bits AnimatedContent with the app's two entrance styles (see design.md, "Motion").

// Slides up a little and fades in.
export function SlideUp({ children, className, delay = 0, stagger = 0, onMount = false }: RevealProps) {
  return (
    <AnimatedContent
      distance={28}
      duration={0.6}
      ease="power3.out"
      delay={delay}
      stagger={stagger}
      trigger={onMount ? "mount" : "scroll"}
      threshold={0.15}
      className={className}
    >
      {children}
    </AnimatedContent>
  )
}

// Pops in: grows from a bit smaller with a small overshoot.
export function PopIn({ children, className, delay = 0, stagger = 0, onMount = false }: RevealProps) {
  return (
    <AnimatedContent
      distance={12}
      scale={0.85}
      duration={0.55}
      ease="back.out(1.8)"
      delay={delay}
      stagger={stagger}
      trigger={onMount ? "mount" : "scroll"}
      threshold={0.15}
      className={className}
    >
      {children}
    </AnimatedContent>
  )
}
