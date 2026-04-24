"use client";

import { useState } from "react";

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

type CourseGroup = {
  area: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  courses: string[];
};

const COURSE_GROUPS: CourseGroup[] = [
  {
    area: "ML & Neural Computation",
    colorClass: "text-cyan-300",
    bgClass: "bg-cyan-900/20",
    borderClass: "border-cyan-400/25",
    courses: [
      "STAT 444 · Statistical Learning",
      "CS 479 · Neural Networks",
      "CS 475 · Computational Linear Algebra",
      "BIOL 487 · Computational Neuroscience",
    ],
  },
  {
    area: "Computational Mathematics",
    colorClass: "text-violet-300",
    bgClass: "bg-violet-900/20",
    borderClass: "border-violet-400/25",
    courses: [
      "AMATH 382 · Computational Modelling of Cellular Systems",
      "CS 476 · Numerical Computation for Financial Modelling",
      "CS 246 · Object-Oriented Software Development",
      "CS 370 · Numerical Computation",
    ],
  },
  {
    area: "Theory & Systems",
    colorClass: "text-blue-300",
    bgClass: "bg-blue-900/20",
    borderClass: "border-blue-400/25",
    courses: [
      "CS 234 · Data Types and Structures",
      "CS 230 · Introduction to Computers and Computer Systems",
      "MATH 235 · Linear Algebra 2",
      "CO 250 · Introduction to Optimization",
    ],
  },
  {
    area: "Cognitive Science",
    colorClass: "text-emerald-300",
    bgClass: "bg-emerald-900/20",
    borderClass: "border-emerald-400/25",
    courses: [
      "COGSCI 300 · Intelligence in Machines, Humans & Animals",
      "PSYCH 207 · Cognitive Processes",
      "PHIL 447 · Seminar in Cognitive Science: Dissident Cognition",
      "PHIL 256 · Introduction to Cognitive Science",
    ],
  },
];

export default function EducationPage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <main className="min-h-screen px-6 py-10 md:px-16 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* back nav */}
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-16"
        >
          <ArrowLeftIcon />
          Back to network
        </a>

        <h1 className="text-3xl md:text-4xl font-medium mb-16 text-fg-primary">Education</h1>

        {/* ── node spine ─────────────────────────────────────────────── */}
        <div className="relative mb-24">

          {/* vertical spine line */}
          <div
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(to bottom, rgba(167,139,250,0.6) 0%, rgba(127,240,255,0.4) 60%, rgba(127,240,255,0.05) 100%)",
            }}
          />

          <div className="space-y-16 md:space-y-20">

            {/* ── CMU node ─────────────────────────────────────────── */}
            <div
              className="relative flex items-start gap-8 md:gap-12 cursor-default"
              onMouseEnter={() => setHoveredNode("cmu")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="relative shrink-0 flex items-center justify-center w-12 md:w-16">
                <div
                  className="w-4 h-4 rounded-full border-2 border-purple-400 transition-all duration-300"
                  style={{
                    background: hoveredNode === "cmu" ? "rgba(167,139,250,0.9)" : "rgba(167,139,250,0.3)",
                    boxShadow: hoveredNode === "cmu"
                      ? "0 0 20px rgba(167,139,250,0.7), 0 0 40px rgba(167,139,250,0.3)"
                      : "0 0 8px rgba(167,139,250,0.3)",
                    transform: hoveredNode === "cmu" ? "scale(1.4)" : "scale(1)",
                  }}
                />
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400/70">Fall 2026</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-purple-400/30 text-purple-300/80">
                    Incoming
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-fg-primary mb-1 leading-tight">
                  Carnegie Mellon University
                </h2>
                <p className="font-mono text-sm text-purple-300 mb-3">
                  MS in Neural Technologies (MiNT-R-NCAI)
                </p>
                <p className="text-fg-muted text-sm leading-relaxed max-w-lg">
                  Neural Computation &amp; AI track. Where I hope to explore the frontier of brain-inspired AI. 
                </p>
              </div>
            </div>

            {/* ── UW node ──────────────────────────────────────────── */}
            <div
              className="relative flex items-start gap-8 md:gap-12 cursor-default"
              onMouseEnter={() => setHoveredNode("uw")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="relative shrink-0 flex items-center justify-center w-12 md:w-16">
                <div
                  className="w-4 h-4 rounded-full border-2 border-cyan-400 transition-all duration-300"
                  style={{
                    background: hoveredNode === "uw" ? "rgba(127,240,255,0.9)" : "rgba(127,240,255,0.3)",
                    boxShadow: hoveredNode === "uw"
                      ? "0 0 20px rgba(127,240,255,0.7), 0 0 40px rgba(127,240,255,0.3)"
                      : "0 0 8px rgba(127,240,255,0.3)",
                    transform: hoveredNode === "uw" ? "scale(1.4)" : "scale(1)",
                  }}
                />
              </div>
              <div className="pt-0.5 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">Sept 2021 — June 2026</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-accent-cyan/40 text-accent-cyan/90">
                    Graduated
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-medium text-fg-primary mb-1 leading-tight">
                  University of Waterloo
                </h2>
                <p className="font-mono text-sm text-accent-light mb-1">
                  Bachelor of Mathematics
                </p>
                <p className="font-mono text-xs text-fg-muted mb-3">
                  Computational Mathematics · Minors in CS &amp; Cognitive Science
                </p>
                <p className="text-fg-muted text-sm leading-relaxed max-w-lg">
                  Five years of co-op, coursework, and research. The combination of math, CS, and cogsci kept pulling me toward how minds and machines compute.
                </p>
                {/* awards */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {["President's Scholarship of Distinction", "President's Research Award 2026"].map((a) => (
                    <span key={a} className="font-mono text-[10px] px-2.5 py-1 rounded-md border border-accent-deep/30 bg-accent-deep/10 text-fg-muted">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── coursework ─────────────────────────────────────────────── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted mb-8">
            Relevant Coursework · UW
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {COURSE_GROUPS.map((group) => (
              <div key={group.area}>
                <p className={`font-mono text-[10px] uppercase tracking-widest mb-4 ${group.colorClass}`}>
                  {group.area}
                </p>
                <div className="flex flex-col gap-2">
                  {group.courses.map((course) => (
                    <span
                      key={course}
                      className={`font-mono text-[11px] px-2.5 py-1.5 rounded-md border ${group.bgClass} ${group.borderClass} text-fg-tertiary`}
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}