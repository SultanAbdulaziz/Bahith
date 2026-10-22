# باحث / Bahith design system

How the frontend looks and why, so new screens stay consistent. The tokens and shared styles live in
`src/index.css`; this file explains how to use them.

## Brand

- **Name:** باحث in Arabic, Bahith in English. Always use `t("common.appName")`, never hard-code it.
- **Assets** (`public/brand/`):

  | File | Use |
  |---|---|
  | `bahith-favicon.svg` | Browser tab icon, and the logo tile next to the name (`Logo` / `LogoMark`). |
  | `bahith-logo.svg`, `bahith-logo-transparent.svg` | Full logo with the Arabic name, for outside the app (social, docs). |
  | `bahith-mark.svg` | The mascot alone. The animated version is the `Mascot` component. |
  | `bahith-card-en.webp`, `bahith-card-ar.webp` | Trading card art for the hero's holo card (see "Mascot"). |

- The logo tile appears in the footer, the login page and the dashboard sidebar. **Not in the landing page nav bar.**

## Look: bold & chunky

Flat yellow and black like the mascot, with thick outlines and hard shadows. Things look like stickers you can press.

### Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | `#f5c542` | `#f5c542` | The brand yellow: main buttons, active states, stickers, chips. |
| `--primary-foreground` | `#0a0a0a` | `#0a0a0a` | Text on yellow. Always black. |
| `--ink` | `#0a0a0a` | `#f5f0e1` | Outlines (`border-ink`, `chunky*`). |
| `--shadow` | `#0a0a0a` | `#f5c542` | Hard offset shadows. Yellow in dark mode so they stay visible. |
| `--background` | `#fff8e7` | `#140d08` | Page background (warm cream / very dark brown). |
| `--card` | `#ffffff` | `#2b1f15` | Panels, cards, inputs. |
| `--secondary` | `#ffeeb8` | `#3b2b1d` | Soft yellow fills: speech bubbles, selected rows. |
| `--muted` / `--muted-foreground` | `#fdf1cf` / `#57534e` | `#33251a` / `#c2b29c` | Quiet fills and secondary text. |
| `--border` | ink at 14% | cream at 14% | Thin dividers **inside** panels only. |
| `--destructive` | `#e5484d` | `#ff6b6f` | Delete, errors. |

Yellow means "do this" or "look here". Don't use it as plain decoration.

### Type

- **Baloo Bhaijaan 2** for everything, both languages (`@fontsource-variable/baloo-bhaijaan-2`).
- Titles: `font-extrabold`. Page titles `text-4xl`, section titles `text-4xl md:text-5xl`, hero `text-5xl` up to `xl:text-7xl`.
- Small labels: `text-sm font-semibold text-muted-foreground`.
- No `uppercase` and no letter-spacing. Both break Arabic.
- Times and numbers use Western digits with `tabular-nums`.

### Shape

- Base radius `--radius: 1rem`. Panels `rounded-3xl`, buttons `rounded-2xl` (from `ctaButton` or the default), chips and badges `rounded-full`.
- Outline + hard shadow utilities (in `index.css`):
  - `chunky-sm`: chips, small icon tiles, speech bubbles. 2px outline, 2px shadow.
  - `chunky`: cards and panels. 2px outline, 4px shadow.
  - `chunky-lg`: the big blocks (demo results and video, feature grid, "how it works", call-to-action, hero sticker). 2px outline, 6px shadow.
- `pressable`: lifts on hover and squishes into its shadow when pressed. Put it on clickable things that aren't shadcn buttons (suggestion chips, feature cards).
- Dividers between rows inside a panel use the thin `--border`, not ink.

## Components

### shadcn

Installed with `npx shadcn@latest add …`. **Don't edit the files in `src/components/ui/`.** They're restyled through their
`data-slot` attributes in `index.css`, so they can be re-added with the CLI without losing the look:

- `button`: ink outline, hard shadow, press effect. `default` is yellow, `outline`/`secondary` are white cards,
  `ghost`/`link` have no outline. Background colors come from these rules, so a `className` can't override a button's background.
- `input`, `badge`, `tabs-list`/`tabs-trigger` (active = yellow), `toggle-group-item` (on = yellow), `progress`,
  `dialog-content`, `alert-dialog-content`, `dropdown-menu-content`, `select-content`, `popover-content`, `input-group` (the chat's question box),
  the sidebar edge and active sidebar item, toasts.

The dashboard shell is the shadcn `sidebar-07` block (`src/features/dashboard/components/`).

The theme switch is Magic UI's `animated-theme-toggler` (also a shadcn registry, in `src/components/ui/`), driven by our
theme provider through its `theme` / `onThemeChange` props and styled as a ghost icon button.

### React Bits

Installed with `npx shadcn@latest add @react-bits/<Name>-TS-TW`; they land in `src/components/`. Use them as they come.
Changes made to them, all marked with a comment where they are:

- `CardNav`: lucide icons instead of Hugeicons, translatable Menu/Close text, an `actions` slot (language + theme).
- `ClickSpark`: a `selector` prop, so only buttons and links spark.

In use: `CardNav` (nav), `Balatro` (hero background), `HoloCard` (hero), `SplitText` (hero headline), `ShinyText` ("Getting ready" status),
`AnimatedContent` (result lists), `ClickSpark` (whole app).

### AI Elements

The chat page uses Vercel's AI Elements, a shadcn registry: `npx shadcn@latest add https://registry.ai-sdk.dev/<name>.json`.
They land in `src/components/ai-elements/` and, like `ui/`, aren't edited (ESLint skips them). Style them with `className`
where they're used, or through `data-slot` rules. In use: `Conversation` (scrolls and sticks to the newest message),
`Message` + `MessageResponse` (renders the answer's markdown with Streamdown), `PromptInput` (question box + video picker), `Sources`.

### Patterns

- **Section heading**: `SectionHeading` = a yellow `Eyebrow` pill ("#01 / Features") + an extra-bold title + an optional subtitle.
- **Sticker**: the accent line of a headline: `inline-block -rotate-2 rounded-2xl chunky-lg bg-primary px-5 text-primary-foreground`.
- **Time chip**: `rounded-full chunky-sm bg-primary px-2 text-xs font-bold tabular-nums` with a play icon.
- **Citation chip**: the same yellow round chip with a source's number; `[n]` in a chat answer becomes one, and clicking it plays that moment.
- **Speech bubble**: `rounded-2xl rounded-es-sm chunky-sm bg-secondary`, next to the mascot.
- **Feature cards**: `rounded-3xl chunky bg-card` with a yellow icon tile; neighbors tilt opposite ways (`±rotate-1`).

## Mascot

`src/components/shared/mascot.tsx` draws the mark as SVG parts so they can move. The moods are CSS in `index.css`:

| Mood | What it does | Where |
|---|---|---|
| `idle` | Blinks now and then. | Start states, empty file list. |
| `talking` | The head hinges open and closed. | The demo and the chat, for 1.6s when an answer arrives; the login page. |
| `searching` | Bobs and looks left and right. | While searching or the chat is thinking; while the dashboard loads. |
| `sad` | Head droops, looks down. | No results; no videos to search yet. |

- By default it sits on a yellow sticker tile (`tile`), so it stays visible in dark mode.
- In the hero it's a trading card on a React Bits `HoloCard`. The card art is a rendered image per language
  (`bahith-card-{en,ar}.webp`), made by `scripts/build-card.mjs`. Change the card's text there and run it again.
- Reduced motion turns the mascot's animations off.

## Motion

- Buttons lift on hover and squish when pressed. Click sparks only on buttons and links.
- Entrances use the two wrappers in `src/components/shared/reveal.tsx` (React Bits `AnimatedContent` underneath):
  - `SlideUp`: a short slide up and fade. Most things: section headings, the demo, lists, page contents, the footer.
  - `PopIn`: grows from a bit smaller with a small overshoot. For a few highlights: feature cards, the yellow
    call-to-action block, empty states, the login page side panel.
  - Both animate when scrolled into view, or on page open with `onMount`. Give a container a `stagger` to bring its
    children in one after another.
- Switching light/dark grows the new theme in a circle from the switch (View Transitions; instant with reduced motion).
- Headline words rise in (`SplitText`). Speech bubbles pop when their text changes (`animate-in zoom-in-90`).
- The landing hero has the React Bits **Balatro** swirl behind it, in the brand colors. Nowhere else gets an animated
  background; use the still halftone `dotPattern` (from `lib/styles.ts`) when an area needs texture.

## Layout

- Content is centered: `mx-auto max-w-6xl px-4`. Sections are spaced with `pt-28`.
- Landing hero fills the screen: headline on one side, holo card on the other (stacked on phones).
- **Nav bar: only the menu, language switch and theme switch.** No logo, name or call-to-action button.
- **Each call to action appears once per page.** On the landing page, "Try it as a guest" and "Create account"
  are in the yellow block at the bottom only. The nav menu and footer don't repeat the guest link.

## Language, direction, dark mode

- All text lives in `src/locales/en.json` and `ar.json`, written plainly, no business jargon.
- Arabic is right to left: use logical classes (`ms-`, `me-`, `ps-`, `start-`, `text-start`, `border-s`), never `left`/`right`.
- Transcripts can be in either language whatever the UI language, so text from videos gets `dir="auto"`.
- Every color is a token with a light and a dark value. Check both themes and both languages before shipping a screen.

## Checklist for new UI

1. Is there a shadcn component, block or React Bits component for it? Add it with the CLI instead of writing one.
2. Panels and cards use `chunky*`, not `border`. Clickable non-buttons get `pressable`.
3. Titles `font-extrabold`, labels `text-sm font-semibold`, no uppercase.
4. Yellow only for actions, highlights and the active state.
5. One call to action per page, nothing repeated in the nav.
6. Works in Arabic (RTL) and English, light and dark.
