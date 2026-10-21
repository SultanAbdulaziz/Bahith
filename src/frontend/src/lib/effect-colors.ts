import type { Theme } from "@/providers/theme-provider"

// Hex colors for the ReactBits effects, which take color strings instead of CSS variables.
export const EFFECT_COLORS: Record<Theme, { muted: string; text: string }> = {
  light: {
    muted: "#57534e",
    text: "#0a0a0a",
  },
  dark: {
    muted: "#c2b29c",
    text: "#f5f0e1",
  },
}
