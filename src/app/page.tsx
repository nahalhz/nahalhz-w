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