"use client";

import { useState, useEffect } from "react";

const FIELDS = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  type: "note" as "essay" | "note",
  tags: "",
};

function buildMdx(fields: typeof FIELDS, body: string): string {
  const tags = fields.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return `---
title: "${fields.title}"
description: "${fields.description}"
date: "${fields.date}"
type: "${fields.type}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
---

${body}`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── password gate ──────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (input === process.env.NEXT_PUBLIC_STUDIO_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted mb-6 text-center">
          nahal. studio
        </p>
        <div className={`transition-transform ${shake ? "animate-bounce" : ""}`}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            placeholder="password"
            autoFocus
            className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-4 py-3 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
          />
          {error && (
            <p className="font-mono text-[10px] text-red-400/70 mt-2 text-center">incorrect</p>
          )}
        </div>
        <button
          onClick={attempt}
          className="w-full mt-3 py-2.5 rounded-lg bg-accent-deep/20 border border-accent-deep/30 font-mono text-xs text-fg-secondary hover:text-fg-primary hover:border-accent-cyan/40 transition-all"
        >
          enter
        </button>
      </div>
    </div>
  );
}

// ── editor ─────────────────────────────────────────────────────────────────
function Editor() {
  const [fields, setFields] = useState(FIELDS);
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "publishing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const mdx = buildMdx(fields, body);
  const slug = slugify(fields.title);

  const publish = async () => {
    if (!fields.title || !body) return;
    setStatus("publishing");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-secret": process.env.NEXT_PUBLIC_STUDIO_SECRET ?? "",
        },
        body: JSON.stringify({ slug, content: mdx }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "unknown error");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 md:py-12">
      <div className="max-w-4xl mx-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
            nahal. studio
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border border-accent-deep/30 text-fg-muted hover:text-fg-secondary hover:border-accent-cyan/30 transition-all"
            >
              {preview ? "edit" : "preview"}
            </button>
            <button
              onClick={publish}
              disabled={!fields.title || !body || status === "publishing"}
              className="font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {status === "publishing" ? "publishing..." : status === "done" ? "published ✓" : "publish"}
            </button>
          </div>
        </div>

        {status === "error" && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-red-400/30 bg-red-900/10">
            <p className="font-mono text-xs text-red-300">{errorMsg}</p>
          </div>
        )}

        {status === "done" && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5">
            <p className="font-mono text-xs text-accent-cyan">
              committed to repo &rarr; Vercel is rebuilding &rarr; live in ~45s
            </p>
          </div>
        )}

        {!preview ? (
          <div className="space-y-4">
            {/* frontmatter fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted block mb-1.5">Title</label>
                <input
                  value={fields.title}
                  onChange={(e) => setFields({ ...fields, title: e.target.value })}
                  placeholder="Post title"
                  className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-3 py-2.5 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
                />
                {fields.title && (
                  <p className="font-mono text-[9px] text-fg-muted mt-1">slug: {slug}</p>
                )}
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted block mb-1.5">Date</label>
                <input
                  type="date"
                  value={fields.date}
                  onChange={(e) => setFields({ ...fields, date: e.target.value })}
                  className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-3 py-2.5 font-mono text-sm text-fg-primary focus:outline-none focus:border-accent-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted block mb-1.5">Description</label>
                <input
                  value={fields.description}
                  onChange={(e) => setFields({ ...fields, description: e.target.value })}
                  placeholder="One line summary"
                  className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-3 py-2.5 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted block mb-1.5">Tags (comma-separated)</label>
                <input
                  value={fields.tags}
                  onChange={(e) => setFields({ ...fields, tags: e.target.value })}
                  placeholder="AI, grad school, research"
                  className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-3 py-2.5 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
                />
              </div>
            </div>

            {/* type toggle */}
            <div className="flex items-center gap-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted">Type</label>
              {(["note", "essay"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFields({ ...fields, type: t })}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded border transition-all ${
                    fields.type === t
                      ? "border-accent-cyan/50 text-accent-cyan bg-accent-cyan/10"
                      : "border-accent-deep/30 text-fg-muted hover:text-fg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* body */}
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-fg-muted block mb-1.5">Body (markdown)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Start writing..."
                rows={24}
                className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-4 py-3 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        ) : (
          // raw MDX preview
          <div className="rounded-xl border border-accent-deep/20 bg-elevated/40 p-8">
            <pre className="font-mono text-xs text-fg-secondary whitespace-pre-wrap leading-relaxed overflow-auto">
              {mdx}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}

// ── page ───────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const [unlocked, setUnlocked] = useState(false);

  // persist unlock in session so refresh doesn't kick you out
  useEffect(() => {
    if (sessionStorage.getItem("studio_unlocked") === "1") setUnlocked(true);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("studio_unlocked", "1");
    setUnlocked(true);
  };

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />;
  return <Editor />;
}