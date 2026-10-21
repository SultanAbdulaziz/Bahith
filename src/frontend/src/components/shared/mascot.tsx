import { cn } from "@/lib/utils"

export type MascotMood = "idle" | "talking" | "searching" | "sad"

type MascotProps = {
  mood?: MascotMood
  // Sits on a yellow sticker so it stays visible in dark mode. Turn off where the background is already yellow.
  tile?: boolean
  className?: string
}

// The باحث mascot, drawn from public/brand/bahith-mark.svg so its parts can move:
// the head (dome, eyes, monocle) hinges open to talk, the eyes blink, the pupils look around while searching.
// The moods are CSS animations in index.css (.mascot.*).
export function Mascot({ mood = "idle", tile = true, className }: MascotProps) {
  const svg = (
    <svg
      viewBox="4 12 56 34"
      className={cn("mascot block h-auto w-[78%] overflow-visible", !tile && "w-full", mood)}
      aria-hidden="true"
    >
      {/* Inside of the mouth: hidden behind the head until it opens. */}
      <path d="M17 36.5Q32 30 47 36.5Z" fill="#7a1f1f" />
      <ellipse cx="37" cy="35.6" rx="6" ry="1.8" fill="#ff8a8a" />
      <g className="head">
        <path d="M16 36.5A16 16 0 0 1 48 36.5Z" fill="#0a0a0a" />
        <g className="eye">
          <circle cx="25" cy="29.5" r="4.5" fill="#ffffff" />
          <circle className="pupil" cx="23.5" cy="28.5" r="2.4" fill="#0a0a0a" />
        </g>
        <path
          d="M44.4 34.4C46.5 38.5 50 40.5 52.5 38.5"
          fill="none"
          stroke="#f5c542"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="39" cy="29" r="8.2" fill="#0a0a0a" />
        <circle cx="39" cy="29" r="7.4" fill="#f5c542" />
        <g className="eye">
          <circle cx="39" cy="29" r="5.9" fill="#ffffff" />
          <circle className="pupil" cx="37.3" cy="28" r="3.2" fill="#0a0a0a" />
        </g>
      </g>
      <path d="M10 40H54" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )

  if (!tile) return <div className={className}>{svg}</div>
  return (
    <div className={cn("grid aspect-[4/3] place-items-center rounded-[26%] chunky bg-primary", className)}>{svg}</div>
  )
}
