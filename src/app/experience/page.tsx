"use client";

import { useEffect, useRef, useState } from "react";
import { EXPERIENCES, type Experience } from "@/lib/experiences";

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function roleTypeLabel(type?: Experience["roleType"]): string | null {
  if (!type) return null;
  const map: Record<string, string> = {
    internship: "INTERNSHIP",
    leadership: "LEADERSHIP",
    "design-team": "DESIGN TEAM",
    event: "EVENT"
  };
  return map[type] || null;
}

function PrimaryCard({ exp }: { exp: Experience }) {
  const label = roleTypeLabel(exp.roleType);
  return (
    <article id={"exp-" + exp.id} className="relative p-8 md:p-10 rounded-xl border border-accent-deep/25 bg-elevated/40 backdrop-blur-sm scroll-mt-24">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">{exp.dateRange}</span>
        {exp.location ? <span className="font-mono text-[10px] text-fg-muted/60">· {exp.location}</span> : null}
        {label ? (
          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-accent-mid/30 text-accent-light/80">
            {label}
          </span>
        ) : null}
      </div>
      <h3 className="text-xl md:text-2xl font-medium text-fg-primary mb-1">{exp.company}</h3>
      <p className="font-mono text-sm text-accent-light mb-4">{exp.role}</p>
      <p className="text-fg-secondary leading-relaxed text-base md:text-lg mb-5">{exp.headline}</p>
      {exp.description ? <p className="text-fg-secondary leading-relaxed mb-6">{exp.description}</p> : null}
      {exp.stack && exp.stack.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {exp.stack.map((tool) => (
            <span key={tool} className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-accent-deep/15 border border-accent-deep/30 text-fg-tertiary">
              {tool}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function SecondaryCard({ exp }: { exp: Experience }) {
  const label = roleTypeLabel(exp.roleType);
  return (
    <article id={"exp-" + exp.id} className="relative py-5 px-6 border-l-2 border-accent-deep/40 bg-transparent scroll-mt-24">
      <div className="flex items-center gap-3 mb-1 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">{exp.dateRange}</span>
        {label ? <span className="font-mono text-[9px] uppercase tracking-widest text-fg-muted/70">· {label}</span> : null}
      </div>
      <h3 className="text-base font-medium text-fg-primary mb-1">
        {exp.company} <span className="text-fg-tertiary">· {exp.role}</span>
      </h3>
      <p className="text-sm text-fg-secondary leading-relaxed">{exp.headline}</p>
    </article>
  );
}

export default function ExperiencePage() {
  const [activeId, setActiveId] = useState<string>(EXPERIENCES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            return Math.abs(aRect.top) - Math.abs(bRect.top);
          });
        if (visible.length > 0) {
          const id = visible[0].target.id.replace("exp-", "");
          setActiveId(id);
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0
      }
    );
    observerRef.current = observer;

    EXPERIENCES.forEach((exp) => {
      const el = document.getElementById("exp-" + exp.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleDotClick = (id: string) => {
    const el = document.getElementById("exp-" + id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeftIcon />
          Back to network
        </a>

        <h1 className="text-3xl md:text-4xl font-medium mb-4 text-fg-primary">Experience</h1>
        <p className="text-fg-secondary leading-relaxed mb-16 max-w-2xl">
          Where I&apos;ve worked, what I&apos;ve built. All in the past 3 years. 
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12">
          <div className="space-y-6 md:space-y-8 min-w-0">
            {EXPERIENCES.map((exp) =>
              exp.tier === "primary" ? (
                <PrimaryCard key={exp.id} exp={exp} />
              ) : (
                <SecondaryCard key={exp.id} exp={exp} />
              )
            )}
          </div>

          <aside className="hidden md:block relative w-44">
            <div className="sticky top-16">
              <div className="font-mono text-[10px] uppercase tracking-widest text-fg-muted mb-4">
                Timeline
              </div>
              <div className="relative">
                <div
                  className="absolute left-[7px] top-2 bottom-2 w-px"
                  style={{ background: "linear-gradient(to bottom, rgba(127, 240, 255, 0.35), rgba(42, 94, 184, 0.2))" }}
                />
                <ul className="space-y-4">
                  {EXPERIENCES.map((exp) => {
                    const isActive = activeId === exp.id;
                    const isHovered = hoveredId === exp.id;
                    const showLabel = isActive || isHovered;
                    const dotColor = exp.tier === "primary"
                      ? (isActive ? "rgba(127, 240, 255, 0.9)" : "rgba(127, 240, 255, 0.3)")
                      : (isActive ? "rgba(90, 158, 255, 0.7)" : "rgba(42, 94, 184, 0.35)");
                    const borderColor = exp.tier === "primary"
                      ? (isActive ? "rgba(127, 240, 255, 1)" : "rgba(127, 240, 255, 0.5)")
                      : (isActive ? "rgba(90, 158, 255, 0.9)" : "rgba(42, 94, 184, 0.5)");

                    return (
                      <li
                        key={exp.id}
                        className="relative pl-6 group cursor-pointer"
                        onMouseEnter={() => setHoveredId(exp.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleDotClick(exp.id)}
                      >
                        <span
                          className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border transition-all duration-200"
                          style={{
                            background: dotColor,
                            borderColor: borderColor,
                            transform: isActive ? "scale(1.3)" : isHovered ? "scale(1.15)" : "scale(1)",
                            boxShadow: isActive ? "0 0 12px rgba(127, 240, 255, 0.5)" : "none"
                          }}
                        />
                        <div
                          className="font-mono text-[10px] leading-tight transition-all duration-200"
                          style={{
                            color: isActive ? "rgba(230, 242, 255, 0.95)" : "rgba(140, 185, 235, 0.6)",
                            opacity: showLabel ? 0 : 1
                          }}
                        >
                          {exp.startDate}
                        </div>
                        {showLabel ? (
                          <div
                            className="absolute left-7 top-0 font-mono text-[11px] text-fg-primary whitespace-nowrap pointer-events-none px-2.5 py-1 rounded-md transition-all duration-150"
                            style={{
                              background: "rgba(10, 25, 55, 0.88)",
                              backdropFilter: "blur(8px)",
                              border: "0.5px solid rgba(130, 190, 255, 0.25)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
                            }}
                          >
                            {exp.company}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
