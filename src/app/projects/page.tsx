"use client";

import { useState } from "react";

type Project = {
  title: string;
  description: string;
  year: string;
  tags: string[];
  image?: string;
  gradient: string;
};

const PROJECTS: Project[] = [
  {
    title: "Dopamine ODE Model",
    description: "A JAX port of the Best et al. dopamine terminal model, with autodiff-based parameter fitting. An exploration of how neural circuit dynamics shape action selection in healthy and Parkinsonian basal ganglia.",
    year: "2026",
    tags: ["JAX", "Comp Neuro", "ODE"],
    gradient: "linear-gradient(135deg, #2a5eb8 0%, #7ff0ff 100%)",
  },
  {
    title: "Inverse RL for Risk-Aware MPC",
    description: "Recovering reward functions for skid-steer robots using Bayesian Optimization. Explores how agents can learn costs from demonstration in uncertain terrain.",
    year: "2026",
    tags: ["RL", "Robotics", "BO"],
    gradient: "linear-gradient(135deg, #5a9eff 0%, #9dc8ff 100%)",
  },
  {
    title: "Agentic AI Evaluation",
    description: "Building evaluation pipelines for agentic LLM systems at Cognichip — token efficiency, tool-use reliability, planning accuracy. The tricky part isn't the metrics, it's asking the right questions.",
    year: "2025—",
    tags: ["LLMs", "Agents", "Eval"],
    gradient: "linear-gradient(135deg, #1a3978 0%, #5a9eff 100%)",
  },
  {
    title: "Predictive Coding From Scratch",
    description: "A minimal implementation of predictive coding networks, trained on MNIST. An attempt to understand one of the more elegant theories of how cortical hierarchies might actually work.",
    year: "2026",
    tags: ["Comp Neuro", "PyTorch"],
    gradient: "linear-gradient(135deg, #7ff0ff 0%, #2a5eb8 100%)",
  },
];

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stronejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function getCardStyle(offset: number): React.CSSProperties {
  const absOffset = Math.abs(offset);
  const translateX = offset * 140;
  const translateZ = -Math.abs(offset) * 120;
  const rotateY = offset * -25;
  const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.3;
  const zIndex = 100 - absOffset;
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
    opacity,
    zIndex,
    transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
    pointerEvents: absOffset === 0 ? "auto" : "none",
  };
}

export default function ProjectsPage() {
  const [active, setActive] = useState(0);
  const total = PROJECTS.length;
  const prev = () => setActive((active - 1 + total) % total);
  const next = () => setActive((active + 1) % total);
  const current = PROJECTS[active];

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeftIcon />
          Back to network
        </a>

        <p className="font-mono text-xs uppercase tracking-widest text-fg-tertiary mb-4">NODE_05</p>
        <h1 className="text-3xl md:text-4xl font-medium mb-3 text-fg-primary">Projects</h1>
        <p className="text-fg-secondary mb-16 max-w-2xl">
          Things I&apos;m actively building or have shipped recently. Tap an arrow to flip through.
        </p>

        <div className="relative flex items-center justify-center mb-12" style={{ perspective: "1200px", height: "420px" }}>
          <button
            onClick={prev}
            aria-label="Previous project"
            className="absolute left-2 md:left-8 z-[200] text-fg-tertiary hover:text-accent-cyan transition-colors p-3"
          >
            <ChevronLeftIcon size={28} />
          </button>

          <div className="relative w-[280px] h-[380px]" style={{ transformStyle: "preserve-3d" }}>
            {PROJECTS.map((project, i) => {
              let offset = i - active;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-accent-deep/30"
                  style={{
                    ...getCardStyle(offset),
                    background: project.gradient,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-between p-6" style={{ background: "linear-gradient(180deg, rgba(5, 8, 20, 0.1) 0%, rgba(5, 8, 20, 0.75) 100%)" }}>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">{project.year}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-fg-primary mb-2 leading-tight">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-fg-tertiary px-2 py-1 rounded border border-accent-deep/40" style={{ background: "rgba(5, 8, 20, 0.4)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={next}
            aria-label="Next project"
            className="absolute right-2 md:right-8 z-[200] text-fg-tertiary hover:text-accent-cyan transition-colors p-3"
          >
            <ChevronRightIcon size={28} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to project ${i + 1}`}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === active ? "24px" : "8px",
                background: i === active ? "rgba(127, 240, 255, 0.8)" : "rgba(130, 190, 255, 0.3)",
              }}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-medium text-fg-primary mb-4">{current.title}</h2>
          <p className="text-fg-secondary leading-relaxed">{current.description}</p>
        </div>
      </div>
    </main>
  );
}
