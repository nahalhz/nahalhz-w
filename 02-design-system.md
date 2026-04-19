# Design system — nahalhz.com

The aesthetic target: **scientific visualization meets premium dev portfolio.** Not gamer, not academic-stuffy, not generic-SaaS-landing-page. Think Distill.pub × Linear × an Apple Watch pairing screen.

Every decision below is deliberate. Stick to the palette until you've been on the site for a month — then iterate.

---

## Fonts

Two fonts, used purposefully.

**Sans (UI + body text): Inter**
- Clean, neutral, workhorse. Used for everything that's prose, navigation, buttons.
- Weights needed: 400 (body), 500 (headings/emphasis).

**Mono (accents, code, metadata): JetBrains Mono**
- Technical signal. Used for: the `nahal.` lockup, node labels, dates, reading times, code blocks, URLs, anything that should read as "technical artifact."
- Weights needed: 400, 500.

### Install

In `src/app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-[#050814] text-[#eaf4ff] antialiased">
        {children}
      </body>
    </html>
  );
}
```

In `tailwind.config.ts`:
```ts
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
  },
},
```

Then use `font-sans` (default) and `font-mono` (override) in your classes.

---

## Color palette

The whole palette is defined in relationship to the cyan-to-deep-blue gradient we settled on. Don't introduce a new color without a reason.

### Background layers

| Token | Hex | Use |
|-------|-----|-----|
| `bg-base` | `#050814` | Page background, near-black with a blue cast |
| `bg-elevated` | `#0a1530` | Cards, raised surfaces |
| `bg-panel` | `rgba(8, 18, 40, 0.82)` | The content overlay panel (with backdrop-blur) |

### Foreground layers

| Token | Hex | Use |
|-------|-----|-----|
| `fg-primary` | `#eaf4ff` | Main text, headings |
| `fg-secondary` | `rgba(200, 225, 255, 0.68)` | Body prose, descriptions |
| `fg-tertiary` | `rgba(140, 185, 235, 0.6)` | Metadata, subtitles, "read time" |
| `fg-muted` | `rgba(130, 190, 255, 0.4)` | Hints, decorative text, "DRAG · HOVER · CLICK" |

### Accent ramp (the cyan-to-blue gradient)

| Token | Hex | Use |
|-------|-----|-----|
| `accent-cyan` | `#7ff0ff` | Brightest glow cores, hover accents |
| `accent-light` | `#9dc8ff` | Inner-network nodes, links, hover states |
| `accent-mid` | `#5a9eff` | Mid-distance particles, active states |
| `accent-deep` | `#2a5eb8` | Outer network, subtle borders |
| `accent-dark` | `#1a3978` | Outermost particles, fog blend |

### Add to `tailwind.config.ts`

```ts
theme: {
  extend: {
    colors: {
      base: "#050814",
      elevated: "#0a1530",
      panel: "rgba(8, 18, 40, 0.82)",
      fg: {
        primary: "#eaf4ff",
        secondary: "rgba(200, 225, 255, 0.68)",
        tertiary: "rgba(140, 185, 235, 0.6)",
        muted: "rgba(130, 190, 255, 0.4)",
      },
      accent: {
        cyan: "#7ff0ff",
        light: "#9dc8ff",
        mid: "#5a9eff",
        deep: "#2a5eb8",
        dark: "#1a3978",
      },
    },
  },
},
```

Usage: `bg-base`, `text-fg-primary`, `text-accent-light`, `border-accent-deep/30`, etc.

---

## Typography scale

Minimal. You don't need 8 sizes.

| Class | Size | Use |
|-------|------|-----|
| Display | 48px / 500 / -0.02em | Homepage name lockup (mobile scales down to 36) |
| H1 | 32px / 500 / -0.01em | Page titles (About, Projects, etc.) |
| H2 | 22px / 500 | Section headings within pages |
| H3 | 16px / 500 | Subsection headings |
| Body | 16px / 400 / line-height 1.7 | Prose |
| Small | 14px / 400 / line-height 1.6 | Captions, secondary text |
| Micro | 11px / 500 / letter-spacing 0.12em / uppercase | Labels, metadata (mono) |

Sentence case everywhere. Never Title Case.

### Typography rules

- **Body line-height is 1.7.** This is generous but correct for comfortable reading on a dark background.
- **Max prose width: 68ch** (~650px). Longer lines hurt readability.
- **Body text never goes below 15px** on desktop, 16px on mobile (a11y).
- **Mono for metadata, never for prose.** Reading a full paragraph in JetBrains Mono is exhausting.

---

## Spacing

Use Tailwind's scale. Common values in this project:

- `gap-2` (8px) — icon + text
- `gap-4` (16px) — inline related items
- `gap-6` (24px) — card internals
- `gap-8` (32px) — section-to-section within a page
- `gap-16` (64px) — major section breaks on long pages

Page padding: `px-6 py-10` on mobile, `px-12 py-16` on desktop.

---

## Border radius

Two values, pick one per context:

- `rounded-md` (8px) — buttons, badges, small cards
- `rounded-xl` (12px) — large panels, the content overlay

Never `rounded-full` unless it's a literal circle (avatar, node glow). Never bare square corners — looks brutal against the soft 3D glow aesthetic.

---

## Borders

On this dark palette, borders should be low-opacity accent colors, not gray.

- Default: `border-[0.5px] border-accent-deep/30`
- Hover: `border-[0.5px] border-accent-mid/50`
- Active/focused: `border-[0.5px] border-accent-cyan/60`

Use `border-[0.5px]` (hairline). Regular `border` (1px) looks heavy here.

---

## Glow effects

Avoid CSS `box-shadow` for glows — it looks fake and laggy. Real glow comes from:
1. The 3D scene itself (bloom post-processing)
2. Backdrop-blur on overlay panels
3. Radial gradients on backgrounds

When you *must* add a glow in HTML (e.g., a hovered button), use:
```css
box-shadow: 0 0 0 1px theme(colors.accent.cyan / 40%),
            0 0 24px -4px theme(colors.accent.cyan / 20%);
```
Never raw `box-shadow: 0 0 40px cyan`. Too much.

---

## Motion

Three durations, three easings. No more.

| Duration | Use |
|----------|-----|
| 150ms | Hover states, button presses, micro-interactions |
| 400ms | Panel slide-ins, label fades |
| 1000ms | Camera zoom to node (the big cinematic one) |

| Easing | Use |
|--------|-----|
| `cubic-bezier(0.4, 0, 0.2, 1)` | Default for UI (Material's "standard") |
| `cubic-bezier(0.65, 0, 0.35, 1)` | Panel transitions (a bit more snap) |
| `cubic-bezier(0.22, 1, 0.36, 1)` | Camera zooms (slow-out, cinematic) |

Export these as Tailwind extensions so you're not typing cubic-bezier strings:
```ts
transitionTimingFunction: {
  ui: "cubic-bezier(0.4, 0, 0.2, 1)",
  snap: "cubic-bezier(0.65, 0, 0.35, 1)",
  cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
},
```

---

## The "nahal." lockup

The homepage name treatment is the single most important typographic moment on the site.

**Desktop:**
- Font: JetBrains Mono 500
- Size: 48px (mobile: 36px)
- Letter-spacing: -0.02em
- Color: `fg-primary`
- The period at the end is the whole move. Do not remove it.

**Subtitle underneath:**
- Font: JetBrains Mono 400
- Size: 11px, letter-spacing: 0.18em, uppercase
- Color: `fg-tertiary`
- Text: `COMP NEURO × ML`

This pairing — oversized + all-caps-tiny — is the entire brand in two lines.

---

## Images and icons

- **No stock photography.** Ever. If you need an image, it's a figure from your work, a screenshot, or nothing.
- **No generic tech illustrations** (undraw, humans.design, etc.). These are the AI-generic tell.
- **Icons:** `lucide-react` only (not `react-icons`, not emoji). Size 16px–20px inline, 24px for feature icons. Always `stroke-width: 1.5`.

---

## Dark-mode-only (for now)

This is a dark-mode-first site. A light mode toggle is a v2 feature, not launch. Don't waste time on it.

---

## Accessibility non-negotiables

- Every interactive element must be keyboard-accessible (tab, enter to click)
- Visible focus ring on every button/link: `focus-visible:ring-2 ring-accent-cyan/60`
- The 3D scene must have a "Skip to content" link at the top for screen readers
- Minimum contrast 4.5:1 for body text, 3:1 for large text — check with a tool like WebAIM's contrast checker
- Respect `prefers-reduced-motion`: slow or stop the auto-rotation, cut animation durations, skip camera zooms

```tsx
// Example: opt out of animation if user has reduced motion
const prefersReducedMotion = useReducedMotion();
useFrame(() => {
  if (prefersReducedMotion) return;
  groupRef.current.rotation.y += 0.0012;
});
```

(`useReducedMotion` is from `framer-motion` or you can roll your own.)
