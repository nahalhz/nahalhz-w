# react-three-fiber primer — how r3f thinks

You asked for this, and it's the most important doc in the stack. If you get the mental model right, the rest is just looking up specific APIs.

## The one-sentence version

**react-three-fiber is React, but the DOM is a 3D scene graph.** That's it. Everything else follows from that.

## The mental shift

In normal React, you write:
```tsx
<div><p>Hello</p></div>
```
and React produces HTML elements.

In r3f, you write:
```tsx
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshBasicMaterial color="blue" />
</mesh>
```
and r3f produces Three.js objects in a 3D scene.

Every three.js class (Mesh, SphereGeometry, PointLight, etc.) is available as a lowercase JSX tag. The `args` prop is the constructor arguments. Props that aren't `args` are assigned as properties after construction.

So `<meshBasicMaterial color="blue" transparent opacity={0.5} />` is roughly:
```js
const mat = new THREE.MeshBasicMaterial();
mat.color = new THREE.Color("blue");
mat.transparent = true;
mat.opacity = 0.5;
```

## The Canvas is the root

Everything 3D happens inside a `<Canvas>`:
```tsx
import { Canvas } from "@react-three/fiber";

<Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
  <mesh>...</mesh>
  <ambientLight intensity={0.5} />
</Canvas>
```

The Canvas handles: creating the renderer, the scene, the camera, the render loop, resizing on window resize, and cleanup on unmount. You don't think about any of that.

**Important:** Anything that uses three.js APIs or r3f hooks must be *inside* the Canvas component tree. You can't `useFrame` from a component that's outside `<Canvas>`.

## The three essential hooks

### `useFrame` — the render loop

Runs every frame (~60 times/sec). Use it for animation.

```tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function SpinningCube() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta;  // delta = seconds since last frame
  });

  return (
    <mesh ref={ref}>
      <boxGeometry />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}
```

**Critical rule:** don't call `setState` in `useFrame` unless you really mean to. It triggers a React re-render 60 times a second and will tank your performance. Instead, mutate refs directly — three.js objects are not React state.

### `useThree` — access the scene/camera/renderer

```tsx
const { camera, scene, gl, size } = useThree();
```

You'll use this for things like moving the camera, getting the viewport size, or imperatively calling renderer APIs.

### `useRef` + typed refs

You'll use a lot of these:
```tsx
const meshRef = useRef<THREE.Mesh>(null);
const groupRef = useRef<THREE.Group>(null);
```

Always check `if (!ref.current) return;` inside useFrame because the ref is null on first render.

## The golden rules

### 1. Mutate, don't set state

```tsx
// ❌ BAD — triggers React re-render every frame
const [rotation, setRotation] = useState(0);
useFrame(() => setRotation(r => r + 0.01));

// ✅ GOOD — direct mutation, React doesn't know or care
useFrame(() => {
  if (meshRef.current) meshRef.current.rotation.y += 0.01;
});
```

### 2. Declarative for structure, imperative for animation

Structure (what objects exist, where they are initially) → JSX.
Animation (how they change over time) → `useFrame` with ref mutations.

```tsx
// Structure: JSX
<mesh ref={ref} position={[0, 0, 0]}>
  <sphereGeometry args={[1]} />
  <meshBasicMaterial color="blue" />
</mesh>

// Animation: useFrame
useFrame((state) => {
  ref.current.position.y = Math.sin(state.clock.elapsedTime) * 2;
});
```

### 3. Dispose of things r3f doesn't manage

If you create a `BufferGeometry` or `Material` imperatively (outside JSX), you must dispose it on unmount:
```tsx
useEffect(() => {
  const geom = new THREE.BufferGeometry();
  // ...
  return () => geom.dispose();
}, []);
```
If you use JSX (`<bufferGeometry />`), r3f handles disposal for you. **Prefer JSX.**

### 4. Performance: instance when you can

For 900 particles, making 900 separate `<mesh>` elements technically works but creates 900 draw calls. The better pattern is `InstancedMesh` (one draw call, many instances) — we'll use this for the particle cloud in week 2. For the weekend, don't worry about it.

## The drei library (essentials you'll actually use)

`@react-three/drei` is a collection of helpers. The ones you care about:

- **`OrbitControls`** — drag-to-rotate, scroll-to-zoom. Your weekend dev tool.
- **`Html`** — render HTML (divs, buttons) positioned in 3D space. Useful for labels.
- **`Text`** — render crisp text in 3D (better than canvas textures).
- **`PerspectiveCamera`** — declarative camera you can control with refs.
- **`Environment`** — skybox/lighting presets.

Import pattern:
```tsx
import { OrbitControls, Html, Text } from "@react-three/drei";
```

## Coordinate system

Three.js uses right-handed coordinates:
- **+X** = right
- **+Y** = up
- **+Z** = toward you (out of the screen)

Default camera looks at -Z (into the screen). So if you put something at `[0, 0, -5]` it's in front of you at distance 5. At `[0, 0, 5]` it's behind you.

Units are arbitrary. We'll use "1 unit ≈ 1 meter" as a loose convention. Your nodes sit at radius ~7, camera at z=26. Feels roomy.

## The gotchas that will cost you an hour each

1. **SSR + three.js don't mix.** Any file importing from `three` or `@react-three/fiber` needs `"use client";` at the top. Next.js will throw hydration errors otherwise.

2. **Hook-outside-Canvas error.** The error "R3F: Hooks can only be used within the Canvas component" means you tried to `useFrame` from a component that isn't a descendant of `<Canvas>`. Fix: extract the hook-using code into a child component rendered inside Canvas.

3. **Everything is a ref dance.** You'll write `const ref = useRef<THREE.Mesh>(null)` more times than you can count. Get comfortable with it. Set up a snippet.

4. **`args` vs props is subtle.** `args` is constructor arguments (positional, array). Props are post-construction assignments. `<sphereGeometry args={[1, 32, 32]} />` = `new SphereGeometry(1, 32, 32)`. `<meshBasicMaterial color="blue" />` = `mat.color = "blue"`. You can do both.

5. **Children render AFTER parents transform.** If you rotate a `<group>`, all children rotate with it. Composition is cheap and powerful — use groups liberally for the network, labels, etc.

## Minimum viable scene

For your weekend, this is all you need to understand:

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Sphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    );
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.5, 24, 24]} />
      <meshBasicMaterial color="#9dc8ff" />
    </mesh>
  );
}

export default function NetworkScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
      <Sphere position={[-3, 0, 0]} />
      <Sphere position={[3, 0, 0]} />
      <Sphere position={[0, 3, 0]} />
      <OrbitControls />
    </Canvas>
  );
}
```

If you can read that and know what each line does, you're ready to build. If not, re-read this doc.

## Further reading (optional)

- [r3f docs](https://r3f.docs.pmnd.rs/getting-started/introduction) — the official tutorial is actually good
- [drei storybook](https://drei.docs.pmnd.rs/) — visual demos of every helper
- Poimandres Discord — the community is unusually helpful if you get genuinely stuck

But honestly, you probably won't need any of this during the weekend. The starter code has everything you need to copy, and by week 2 you'll have internalized the mental model.
