# Week-by-week build plan

The weekend gets you Week 1 done. This is the rest.

Assumption: a few hours per week. Each week has one **must-ship** item and optional bonus work. Don't sacrifice the must-ship for bonus.

---

## Week 1 (April 17–23) — Foundation
**Status: tackled in your weekend session. See `01-weekend-checklist.md`.**

Must-ship: nahalhz.com loads a working 3D scene with orbitable nodes.

---

## Week 2 (April 24–30) — The hero scene comes alive
**Budget: 3–4 hours total.**

This week, the scene starts to match the prototype.

**Session A (~2 hrs):**
- Add `ParticleCloud` component (code ready in `03-starter-code.md`)
- Tune particle density, gradient colors, fog
- Commit, deploy, look at it on your phone

**Session B (~1–2 hrs):**
- Add labels to nodes using `<Html>` from drei (easier than sprite textures)
- Add hover detection — nodes pulse bigger, labels grow
- Replace `OrbitControls` with a custom drag-to-rotate handler (OrbitControls feels like a dev tool, not a polished interaction)

**Must-ship by end of week:** homepage looks ~80% like the final prototype. Particle cloud, gradient, labels visible, hover works.

**Skip if tight:** tuning. Don't polish. Week 3 is for polish.

---

## Week 3 (May 1–7) — Polish + the cinematic camera
**Budget: 3–4 hours. Cognichip ramping, so protect this time.**

This is the week the site starts feeling premium.

**Session A (~2 hrs) — Bloom:**
Install `@react-three/postprocessing`. Add EffectComposer with UnrealBloomPass:

```tsx
import { EffectComposer, Bloom } from "@react-three/postprocessing";

<EffectComposer>
  <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
</EffectComposer>
```

Tune `intensity` (0.5–1.2) and `luminanceThreshold` (0.1–0.3) until the glow looks right. This is the single biggest visual jump of the entire build.

**Session B (~2 hrs) — Camera zoom:**
Build `CameraController.tsx`. The pattern:

1. Use `useRouter` from `next/navigation` to read the current path.
2. If path is `/about`, target camera = `nodeWorldPos + offset toward camera`.
3. If path is `/`, target camera = `[0, 0, 26]` (default position).
4. In `useFrame`, lerp current camera position toward target with easing.
5. When user clicks a node, call `router.push("/about")` — the URL change triggers the zoom.

This gets you deep-linking for free: `nahalhz.com/about` loads with the camera already zoomed.

**Session C (~30 min) — Mobile:**
On `window.innerWidth < 768`, swap the 3D scene for a static snapshot or a low-density version without drag. Render the fallback nav inline. The phone experience is: see the pretty thing, tap links.

**Must-ship:** bloom effect, camera zooms to a node on click, mobile doesn't break.

---

## Week 4 (May 8–14) — Content pages
**Budget: 3–4 hours.**

Less glamor, more substance. The 3D scene is the front door; these are the rooms.

**Session A (~2 hrs):**
Build the content overlay component. When you land on `/about`, the 3D scene dims behind a content panel. Design:
- Panel is `bg-panel` with `backdrop-blur`, `rounded-xl`, max-width 2xl (~672px)
- Centered vertically, takes up ~60% of viewport height
- Scrollable internally if content exceeds that
- Close button (X) top-right, navigates to `/` (camera zooms back out)
- Escape key closes it too

**Session B (~2 hrs):**
Write the actual content:
- **About** — ~250 words. Who you are, what you work on, where you're headed (Waterloo → CMU MiNT NCAI).
- **CV** — Education, publications, experience. Static. Link to a downloadable PDF version.
- **Projects** — An index page listing each project (start with 1–2 stubs). Each project has its own route `/projects/[slug]`.
- **Writing** — Same pattern. Index + individual post pages.
- **Contact** — Email, GitHub, LinkedIn, Twitter/X if you want.
- **Now** (optional, lovely touch) — A [nownownow.com](https://nownownow.com/about)-style page describing what you're currently focused on. Updated monthly.

**Must-ship:** every route has real content. Not Lorem Ipsum.

---

## Week 5+ (May 15 onward) — Content momentum
**Budget: 1–2 hours per week, indefinite.**

At this point the site is *done* as a structural project. Now it's a living thing.

**Ongoing work:**
- Write one project writeup per 2 weeks
- Write one blog post per 2 weeks
- Add paper-notes as you read papers (this is the low-effort compounding content)
- Tune small things based on feedback from friends

**First writing post suggestions** (pick one to start):
1. *"Reproducing a classic dopamine ODE model in JAX"* — derives from your existing compneuro work, easiest first post
2. *"Why I chose MiNT NCAI at CMU over the BME track"* — personal, sharable, useful for future students
3. *"Building a 3D portfolio in react-three-fiber — a walkthrough"* — meta, the site itself is content

**First project writeup candidates:**
1. `dopamine-ode-jax` — finish the JAX port, write up the methodology
2. `paper-notes` — a living repo of notes, published as it grows

---

## Before CMU (September 2026)

Goal state by move-in day:
- [ ] 4+ project writeups live
- [ ] 6+ writing posts live
- [ ] Custom domain email (`hi@nahalhz.com` or similar — set up forwarding in Cloudflare)
- [ ] Analytics (use [Plausible](https://plausible.io) — $9/mo, privacy-respecting, no GDPR banner nonsense)
- [ ] Open Graph image for every post (use a simple template)
- [ ] RSS feed for the writing section
- [ ] Newsletter signup integrated (Substack iframe or Beehiiv)

That's ~5 months of "a couple hours a week" work. Completely sustainable.

---

## What to cut if you're behind

In order of what to drop first:

1. **Now page** — nice to have, not essential
2. **Newsletter integration** — Substack URL link is fine for launch
3. **Custom email forwarding** — use your regular email until after CMU starts
4. **Analytics** — you can add later
5. **RSS feed** — add when you have 5+ posts

Never cut:
- The 3D hero scene (it's the whole point)
- Mobile fallback (accessibility + SEO)
- At least one real project writeup
- The About page

---

## When to ask me for help

I can help with:
- Debugging r3f errors (paste the error + the code around it)
- Tuning the bloom / motion / colors (describe what feels off)
- Writing the content (drafts of About, post outlines, CV formatting)
- Reviewing drafts before you publish
- Deciding between implementation approaches

Bring me a specific stuck moment, not "the site needs work." The more focused the question, the better the help.
