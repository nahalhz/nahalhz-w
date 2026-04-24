"use client";

import { useEffect, useRef, useState } from "react";
import { projects, clusterMeta, type ResearchProject } from "@/lib/research";
import dynamic from "next/dynamic";

const ResearchScene = dynamic<{ onNavigate: (clusterId: string) => void }>(
  () => import("@/components/scene/ResearchScene"),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function StatusBadge({ status, label }: { status: ResearchProject["status"]; label: string }) {
  if (status === "published") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-accent-cyan/40 text-accent-cyan/90">
        {label}
      </span>
    );
  }
  if (status === "ongoing") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-purple-400/30 text-purple-300/80">
        {label}
      </span>
    );
  }
  return (
    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-fg-muted/30 text-fg-muted/70">
      {label}
    </span>
  );
}

function PrimaryProjectCard({ project }: { project: ResearchProject }) {
  const meta = clusterMeta[project.cluster];
  const borderColor = project.cluster === "compneuro"
    ? "border-cyan-400/30"
    : project.cluster === "robotics"
    ? "border-purple-400/30"
    : "border-emerald-400/30";
  const accentText = project.cluster === "compneuro"
    ? "text-cyan-300"
    : project.cluster === "robotics"
    ? "text-purple-300"
    : "text-emerald-300";
  const accentBullet = project.cluster === "compneuro"
    ? "text-cyan-400"
    : project.cluster === "robotics"
    ? "text-purple-400"
    : "text-emerald-400";
  const tagBg = project.cluster === "compneuro"
    ? "bg-cyan-900/20 border-cyan-400/20 text-cyan-200/60"
    : project.cluster === "robotics"
    ? "bg-purple-900/20 border-purple-400/20 text-purple-200/60"
    : "bg-emerald-900/20 border-emerald-400/20 text-emerald-200/60";

  return (
    <article
      id={"proj-" + project.slug}
      className={`relative p-8 md:p-10 rounded-xl border ${borderColor} bg-elevated/40 backdrop-blur-sm scroll-mt-24`}
    >
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">{project.period}</span>
        <StatusBadge status={project.status} label={project.statusLabel} />
        <span className={`font-mono text-[9px] uppercase tracking-widest ${accentText}/70`}>
          {meta.label}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-medium text-fg-primary mb-1">{project.title}</h3>
      <p className={`font-mono text-sm ${accentText} mb-1`}>{project.subtitle}</p>
      <p className="font-mono text-xs text-fg-muted mb-5">
        {project.supervisors[0] !== "Course project"
          ? `${project.supervisors.join(", ")} · ${project.lab.split(",")[0]}`
          : project.lab.split(",")[0]}
      </p>
      <p className="text-fg-secondary leading-relaxed text-base md:text-lg mb-5">{project.abstract}</p>
      <ul className="space-y-3 mb-6">
        {project.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-fg-secondary leading-relaxed">
            <span className={`${accentBullet} mt-1 shrink-0 text-[10px]`}>&#9670;</span>
            {b}
          </li>
        ))}
      </ul>
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className={`font-mono text-[11px] px-2.5 py-1 rounded-md border ${tagBg}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
      {project.links && project.links.length > 0 && (
        <div className="flex gap-4 mt-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-xs ${accentText} underline underline-offset-4 hover:opacity-80 transition-opacity`}
            >
              {link.label} &#8599;
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function SecondaryProjectCard({ project }: { project: ResearchProject }) {
  return (
    <article
      id={"proj-" + project.slug}
      className="relative py-5 px-6 border-l-2 border-accent-deep/40 bg-transparent scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-1 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">{project.period}</span>
        <StatusBadge status={project.status} label={project.statusLabel} />
      </div>
      <h3 className="text-base font-medium text-fg-primary mb-1">
        {project.title}{" "}
        <span className="text-fg-tertiary">· {project.subtitle}</span>
      </h3>
      <p className="text-sm text-fg-secondary leading-relaxed">{project.abstract}</p>
    </article>
  );
}

export default function ResearchPage() {
  const [activeSlug, setActiveSlug] = useState<string>(projects[0].slug);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible.length > 0) {
          const slug = visible[0].target.id.replace("proj-", "");
          setActiveSlug(slug);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );

    projects.forEach((p) => {
      const el = document.getElementById("proj-" + p.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (slug: string) => {
    const el = document.getElementById("proj-" + slug);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSceneNavigate = (clusterId: string) => {
    const first = projects.find((p) => p.cluster === clusterId);
    if (first) scrollTo(first.slug);
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto">

        {/* back nav — exact same as Experience */}
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeftIcon />
          Back to network
        </a>

        <h1 className="text-3xl md:text-4xl font-medium mb-4 text-fg-primary">Research</h1>
        <p className="text-fg-secondary leading-relaxed mb-10 max-w-2xl">
          The work I care most about. Computational neuroscience, brain-inspired AI, and whatever falls between a math department and a robotics lab.
        </p>

        {/* 3D scene */}
        <div className="w-full h-64 md:h-80 mb-4 rounded-xl overflow-hidden border border-accent-deep/20 relative">
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(103,232,249,0.04) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 70% 50%, rgba(167,139,250,0.04) 0%, transparent 65%)"
            }}
          />
          <ResearchScene onNavigate={handleSceneNavigate} />
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
              click a node to jump &darr;
            </p>
          </div>
        </div>

        {/* cluster legend */}
        <div className="flex gap-6 mb-16 flex-wrap">
          {(Object.entries(clusterMeta) as [keyof typeof clusterMeta, typeof clusterMeta[keyof typeof clusterMeta]][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { const first = projects.find((p) => p.cluster === key); if (first) scrollTo(first.slug); }}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-fg-secondary transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}88` }}
              />
              {meta.label}
            </button>
          ))}
        </div>

        {/* timeline + cards — same grid as Experience */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12">

          {/* cards */}
          <div className="space-y-6 md:space-y-8 min-w-0">
            {projects.map((project) =>
              project.status === "published" || project.status === "ongoing" ? (
                <PrimaryProjectCard key={project.slug} project={project} />
              ) : (
                <SecondaryProjectCard key={project.slug} project={project} />
              )
            )}
          </div>

          {/* sticky timeline — same structure as Experience */}
          <aside className="hidden md:block relative w-44">
            <div className="sticky top-16">
              <div className="font-mono text-[10px] uppercase tracking-widest text-fg-muted mb-4">
                Timeline
              </div>
              <div className="relative">
                <div
                  className="absolute left-[7px] top-2 bottom-2 w-px"
                  style={{ background: "linear-gradient(to bottom, rgba(127,240,255,0.35), rgba(167,139,250,0.2))" }}
                />
                <ul className="space-y-4">
                  {projects.map((project) => {
                    const isActive = activeSlug === project.slug;
                    const isHovered = hoveredSlug === project.slug;
                    const showLabel = isActive || isHovered;
                    const isPrimary = project.status === "published" || project.status === "ongoing";
                    const dotColor = isPrimary
                      ? (isActive ? "rgba(127,240,255,0.9)" : "rgba(127,240,255,0.3)")
                      : (isActive ? "rgba(90,158,255,0.7)" : "rgba(42,94,184,0.35)");
                    const borderColor = isPrimary
                      ? (isActive ? "rgba(127,240,255,1)" : "rgba(127,240,255,0.5)")
                      : (isActive ? "rgba(90,158,255,0.9)" : "rgba(42,94,184,0.5)");

                    return (
                      <li
                        key={project.slug}
                        className="relative pl-6 group cursor-pointer"
                        onMouseEnter={() => setHoveredSlug(project.slug)}
                        onMouseLeave={() => setHoveredSlug(null)}
                        onClick={() => scrollTo(project.slug)}
                      >
                        <span
                          className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full border transition-all duration-200"
                          style={{
                            background: dotColor,
                            borderColor: borderColor,
                            transform: isActive ? "scale(1.3)" : isHovered ? "scale(1.15)" : "scale(1)",
                            boxShadow: isActive ? "0 0 12px rgba(127,240,255,0.5)" : "none"
                          }}
                        />
                        <div
                          className="font-mono text-[10px] leading-tight transition-all duration-200"
                          style={{
                            color: isActive ? "rgba(230,242,255,0.95)" : "rgba(140,185,235,0.6)",
                            opacity: showLabel ? 0 : 1
                          }}
                        >
                          {project.period.split("\u2013")[0].trim()}
                        </div>
                        {showLabel ? (
                          <div
                            className="absolute left-7 top-0 font-mono text-[11px] text-fg-primary whitespace-nowrap pointer-events-none px-2.5 py-1 rounded-md transition-all duration-150"
                            style={{
                              background: "rgba(10,25,55,0.88)",
                              backdropFilter: "blur(8px)",
                              border: "0.5px solid rgba(130,190,255,0.25)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
                            }}
                          >
                            {project.title.split(" ").slice(0, 3).join(" ")}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* CMU note */}
              <div className="mt-8 p-3 rounded-lg border border-accent-cyan/20 bg-accent-deep/10">
                <p className="font-mono text-[10px] text-fg-muted leading-relaxed">
                  Starting MiNT-R<br />@ CMU Fall 2026.<br />More to come.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}