# Weekend Session Checklist — nahalhz.com Foundation

**Goal:** End the session with a deployed 3D scene at nahalhz.com that you can orbit around. Not pretty yet. Just working.

**Total budget:** 3–4 hours. If you hit 4.5 hrs, stop and ship whatever state you're in — setup debt is the enemy.

---

## Phase 0 — Before you sit down (~10 min, do earlier)

- [ ] Charge laptop. Get water. Silence phone.
- [ ] Close every tab that isn't this checklist, a terminal, or VS Code.
- [ ] Decide: are you okay with the repo being public? (Recommended yes — public build is on-brand.)
- [ ] Have a credit card handy (for domain purchase).

---

## Phase 1 — Domain + accounts (~20 min)

- [ ] Go to [cloudflare.com/products/registrar](https://www.cloudflare.com/products/registrar/) OR [namecheap.com](https://www.namecheap.com/). Cloudflare is slightly cheaper and has better DNS.
- [ ] Buy `nahalhz.com`. Skip all privacy/email upsells (Cloudflare includes WHOIS privacy free).
- [ ] If new: sign up for [Vercel](https://vercel.com) using your GitHub account. Takes 30 seconds.

**✅ Phase 1 done when:** you own nahalhz.com and you're signed into Vercel.

---

## Phase 2 — Project scaffolding (~30 min)

Open a terminal. Navigate to wherever you keep code projects. Then run:

```bash
npx create-next-app@latest nahalhz-site --typescript --tailwind --app --src-dir --import-alias "@/*"
```

When prompted about Turbopack, say yes. When prompted about ESLint, say yes.

```bash
cd nahalhz-site
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

Verify it runs:
```bash
npm run dev
```

Open `http://localhost:3000`. You should see the default Next.js page. Stop the server (Ctrl+C).

Now push to GitHub:
```bash
git init
git add .
git commit -m "initial scaffold"
```

Create a new repo on GitHub called `nahalhz-site` (public). Follow the GitHub instructions to connect:
```bash
git remote add origin https://github.com/nahalhz/nahalhz-site.git
git branch -M main
git push -u origin main
```

Connect to Vercel:
- Go to vercel.com/new
- Import your `nahalhz-site` repo
- Click "Deploy" (no config needed)
- Wait ~90 seconds. You now have a `.vercel.app` URL live.

Connect your domain:
- In Vercel, go to project → Settings → Domains → Add `nahalhz.com`
- Vercel will tell you which DNS records to add
- Add them in Cloudflare/Namecheap's DNS panel
- Wait ~5–15 min. Verify by visiting `https://nahalhz.com` — you should see the default Next.js page.

**✅ Phase 2 done when:** nahalhz.com loads the default Next.js page in your browser, on HTTPS, with no warnings.

> ⚠️ **Do not skip the domain verification before moving on.** This is the #1 place people get stuck and debugging DNS at hour 3 when you're tired is miserable.

---

## Phase 3 — First 3D scene (~60–90 min)

Now we replace the homepage with a basic 3D scene. Open your editor.

**Create the scene component.** New file at `src/components/scene/NetworkScene.tsx`:

(Copy from `03-starter-code.md` — the `NetworkScene` section.)

**Replace the homepage.** Open `src/app/page.tsx` and replace the entire contents with:

```tsx
"use client";

import NetworkScene from "@/components/scene/NetworkScene";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#050814]">
      <NetworkScene />
    </main>
  );
}
```

**Run it locally:**
```bash
npm run dev
```

Open `http://localhost:3000`. You should see a dark page with a few glowing spheres you can orbit around with your mouse.

**Ship it:**
```bash
git add .
git commit -m "phase 3: basic 3D scene with orbitable spheres"
git push
```

Vercel auto-deploys. Check nahalhz.com in ~60 seconds.

**✅ Phase 3 done when:** you can orbit around glowing spheres at nahalhz.com, from your phone if you want.

---

## Phase 4 — Commit the architecture (~30–60 min)

The final phase is setting up empty folders so week 2 is pure building, not deciding-where-things-go.

**Create this folder structure** (empty files are fine — placeholders):

```bash
# From the project root
mkdir -p src/components/scene
mkdir -p src/components/content
mkdir -p src/content/projects
mkdir -p src/content/writing
mkdir -p src/app/about
mkdir -p src/app/projects
mkdir -p src/app/writing
mkdir -p src/app/cv
mkdir -p src/app/contact

touch src/components/scene/Node.tsx
touch src/components/scene/ParticleCloud.tsx
touch src/components/scene/CameraController.tsx
touch src/components/content/ContentOverlay.tsx
touch src/lib/nodes.ts
touch src/app/about/page.tsx
touch src/app/projects/page.tsx
touch src/app/writing/page.tsx
touch src/app/cv/page.tsx
touch src/app/contact/page.tsx
```

For each empty `page.tsx` file, add a placeholder so Next.js doesn't error:

```tsx
export default function Page() {
  return <div className="p-8 text-white">Coming soon.</div>;
}
```

**Populate `src/lib/nodes.ts`** with the node data (copy from `03-starter-code.md`).

Commit:
```bash
git add .
git commit -m "phase 4: architecture scaffold + node data"
git push
```

**✅ Phase 4 done when:** the folder structure exists, placeholder pages load at /about, /projects, etc., and the node data file is populated.

---

## If you finish early

Bonus moves in order of value:
1. Add a proper favicon (use favicon.io to generate one — use a simple "n" or a blue dot)
2. Add basic meta tags to `src/app/layout.tsx` (title, description, og:image)
3. Set up the Inter + JetBrains Mono fonts (see `02-design-system.md`)
4. Start sketching the particle cloud (copy ParticleCloud code from `03-starter-code.md`)

---

## Stuck? Common issues

**"DNS isn't propagating"** — Wait 15 min. If still broken, double-check you added the exact records Vercel told you to. Cloudflare DNS changes are usually instant; Namecheap can take up to 30 min.

**"r3f errors about hooks outside Canvas"** — Any `useThree`, `useFrame`, etc. must be inside a component rendered *inside* `<Canvas>`. The `NetworkScene` itself is a client component that contains the Canvas; anything using r3f hooks goes in children.

**"Hydration mismatch warnings"** — Three.js is client-only. Make sure any file using r3f starts with `"use client";` at the top.

**"Nothing renders on the 3D canvas"** — Check the browser console (F12). Usually a module-import issue or a missing `"use client"` directive.

**"Vercel deploy failing"** — Check the build log. 90% of the time it's a TypeScript error that worked locally because `npm run dev` is more permissive than `npm run build`. Run `npm run build` locally before pushing to catch these early.

---

## After the weekend

Next steps are in `04-week-by-week-plan.md`. But first: ship what you have, step away, and don't touch it for 24 hours. Come back fresh on Monday.
