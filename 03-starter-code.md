# Starter code — copy these into your repo

Every code block below is ready to drop into the indicated file. Nothing is pseudocode.

---

## `src/lib/nodes.ts`

The single source of truth for what nodes exist, where they sit, and what they route to.

```ts
export type NodeData = {
  id: string;
  label: string;      // e.g. "NODE_01"
  title: string;      // e.g. "About"
  description: string;
  route: string;      // "/about"
  position: [number, number, number];
};

export const NODES: NodeData[] = [
  {
    id: "about",
    label: "NODE_01",
    title: "About",
    description: "Bio, current focus, timeline.",
    route: "/about",
    position: [-6.5, 4.5, 2],
  },
  {
    id: "projects",
    label: "NODE_02",
    title: "Projects",
    description: "Shipped code and writeups.",
    route: "/projects",
    position: [7, 3.2, -2],
  },
  {
    id: "writing",
    label: "NODE_03",
    title: "Writing",
    description: "Notes from comp neuro and ML.",
    route: "/writing",
    position: [5.8, -4.2, 3],
  },
  {
    id: "cv",
    label: "NODE_04",
    title: "CV",
    description: "Publications, experience, education.",
    route: "/cv",
    position: [-6, -3.3, -2.5],
  },
  {
    id: "contact",
    label: "NODE_05",
    title: "Contact",
    description: "Email, GitHub, socials.",
    route: "/contact",
    position: [0.5, 6.5, -3],
  },
  {
    id: "now",
    label: "NODE_06",
    title: "Now",
    description: "What I'm working on this week.",
    route: "/now",
    position: [-0.3, -6, 3.5],
  },
];
```

---

## `src/components/scene/NetworkScene.tsx` (weekend version — simple)

This is the minimal scene to finish Phase 3. Labeled nodes only, OrbitControls, no particle cloud yet. That comes in week 2.

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { NODES } from "@/lib/nodes";

function Node({
  position,
  index,
}: {
  position: [number, number, number];
  index: number;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 1.8 + index * 0.7) * 0.1 + 1;
    coreRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color="#7ff0ff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[1.4, 20, 20]} />
        <meshBasicMaterial color="#9dc8ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function NodeConnections() {
  const lines = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (Math.random() > 0.5) {
        const points = [
          new THREE.Vector3(...NODES[i].position),
          new THREE.Vector3(...NODES[j].position),
        ];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        lines.push(
          <line key={`${i}-${j}`}>
            <bufferGeometry attach="geometry" {...geom} />
            <lineBasicMaterial
              attach="material"
              color="#9dc8ff"
              transparent
              opacity={0.22}
            />
          </line>
        );
      }
    }
  }
  return <>{lines}</>;
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0012;
  });

  return (
    <group ref={groupRef}>
      {NODES.map((node, i) => (
        <Node key={node.id} position={node.position} index={i} />
      ))}
      <NodeConnections />
    </group>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 26], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#050814"]} />
      <fog attach="fog" args={["#050814", 18, 38]} />
      <SceneContent />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
```

### Why this code is structured this way

- `SceneContent` is a separate component inside `<Canvas>` so it can use `useFrame`. Hooks need to live inside the Canvas tree.
- The rotation is on a `<group>` containing everything — rotating the group rotates all children together. Cheap and idiomatic.
- OrbitControls with `enableZoom={false}` because we don't want users scroll-zooming into the scene during your weekend. We'll replace this with a custom camera controller in week 2.
- The `<color attach="background">` sets the scene background color inside the Canvas. The `<fog>` fades distant particles (but we don't have particles yet — you'll see the effect next week).

---

## `src/components/scene/ParticleCloud.tsx` (week 2 — don't worry about this this weekend)

For when you're ready to add the dense particle cloud. This uses `InstancedMesh` for performance — 900 particles, 1 draw call.

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 900;
const MAX_RADIUS = 16;

function colorAtRadius(r: number): THREE.Color {
  const t = Math.min(r / MAX_RADIUS, 1);
  const cyan = new THREE.Color("#7ff0ff");
  const light = new THREE.Color("#9dc8ff");
  const mid = new THREE.Color("#5a9eff");
  const dark = new THREE.Color("#1a3978");

  if (t < 0.33) return cyan.clone().lerp(light, t / 0.33);
  if (t < 0.66) return light.clone().lerp(mid, (t - 0.33) / 0.33);
  return mid.clone().lerp(dark, (t - 0.66) / 0.34);
}

export default function ParticleCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 4 + Math.pow(Math.random(), 0.55) * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      arr.push({
        origin: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2,
        size: 0.025 + Math.random() * 0.11,
        baseOpacity: 0.35 + Math.random() * 0.55,
        twinkleSpeed: 1.2 + Math.random() * 2,
        color: colorAtRadius(r),
      });
    }
    return arr;
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const x = p.origin.x + Math.sin(t * 0.7 + p.phase) * 0.14;
      const y = p.origin.y + Math.cos(t * 0.6 + p.phase * 1.3) * 0.14;
      const z = p.origin.z + Math.sin(t * 0.5 + p.phase * 0.7) * 0.14;

      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(p.size * 4); // InstancedMesh uses base geom at size 0.25
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      const twinkle = Math.sin(t * p.twinkleSpeed + p.phase * 2) * 0.25 + 0.75;
      const mult = p.baseOpacity * twinkle;
      tempColor.copy(p.color).multiplyScalar(mult);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.25, 6, 6]} />
      <meshBasicMaterial transparent vertexColors />
    </instancedMesh>
  );
}
```

Add it to the scene later:
```tsx
<SceneContent>
  <ParticleCloud />
  {/* ...existing nodes */}
</SceneContent>
```

---

## `src/app/layout.tsx` (update once, leave alone)

Replace the entire file with this:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "nahal — comp neuro × ml",
  description:
    "Computational neuroscience and brain-inspired machine learning. Projects, writing, research.",
  metadataBase: new URL("https://nahalhz.com"),
  openGraph: {
    title: "nahal",
    description: "comp neuro × ml",
    url: "https://nahalhz.com",
    siteName: "nahal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-base text-fg-primary antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## `tailwind.config.ts` (full replacement)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
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
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        ui: "cubic-bezier(0.4, 0, 0.2, 1)",
        snap: "cubic-bezier(0.65, 0, 0.35, 1)",
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## `src/app/globals.css` (minimal — replace the default)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-feature-settings: "cv02", "cv03", "cv04", "cv11"; /* Inter stylistic alternates */
  }

  ::selection {
    background: rgba(127, 240, 255, 0.25);
    color: #eaf4ff;
  }
}
```

---

## Placeholder page template (use for every page you haven't built yet)

For `src/app/about/page.tsx`, `projects/page.tsx`, etc. — any page you want to stub:

```tsx
export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-fg-tertiary mb-6">
          UNDER CONSTRUCTION
        </p>
        <h1 className="text-3xl md:text-4xl font-medium mb-4">
          Coming soon.
        </h1>
        <p className="text-fg-secondary leading-relaxed">
          Building this page. Check back in a bit.
        </p>
      </div>
    </main>
  );
}
```

---

## Homepage (`src/app/page.tsx`)

```tsx
"use client";

import NetworkScene from "@/components/scene/NetworkScene";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-base">
      {/* Skip link for accessibility */}
      <a
        href="#content-skip"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-elevated focus:px-4 focus:py-2 focus:rounded-md focus:text-accent-cyan"
      >
        Skip 3D scene
      </a>

      <NetworkScene />

      {/* Name lockup */}
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 font-mono pointer-events-none z-10">
        <div className="text-[36px] md:text-[48px] font-medium tracking-[-0.02em] text-fg-primary leading-none">
          nahal.
        </div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-fg-tertiary">
          COMP NEURO × ML
        </div>
      </div>

      {/* Hint */}
      <div
        className="absolute top-4 left-4 md:top-5 md:left-5 font-mono text-[10px] tracking-[0.12em] text-fg-muted pointer-events-none z-10"
        aria-hidden
      >
        DRAG · HOVER · CLICK
      </div>

      {/* Screen-reader fallback navigation */}
      <nav id="content-skip" className="sr-only">
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/writing">Writing</a></li>
          <li><a href="/cv">CV</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </main>
  );
}
```

---

## That's it for the weekend

By the end of Phase 3, you have: a live 3D scene with 6 pulsing nodes you can orbit, the name lockup, and a screen-reader-accessible fallback nav. By Phase 4, placeholder pages exist at every route.

Next week's code (hover detection, labels, camera zoom, the content overlay) builds on this foundation. Don't try to do it this weekend.
