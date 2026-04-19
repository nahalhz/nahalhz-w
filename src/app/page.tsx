"use client";

import NetworkScene from "@/components/scene/NetworkScene";

export default function Home() {
  return (
    <main
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #0d1e42 0%, #05080f 70%, #020510 100%)",
      }}
    >
      <NetworkScene />
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 font-mono pointer-events-none z-10">
        <div className="text-4xl md:text-5xl font-medium tracking-tight text-fg-primary leading-none">
          nahal.
        </div>
        <div className="mt-2 text-xs uppercase tracking-widest text-fg-tertiary">
          COMP NEURO x ML
        </div>
      </div>
      <div
        className="absolute top-4 left-4 font-mono text-xs tracking-widest text-fg-muted pointer-events-none z-10"
        aria-hidden
      >
        DRAG HOVER CLICK
      </div>
    </main>
  );
}