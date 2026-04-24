"use client";

import { useState, useEffect, useCallback } from "react";

// ── types ──────────────────────────────────────────────────────────────────
type PostMeta = {
  slug: string;
  title: string;
  date: string;
  type: "essay" | "note";
  draft: boolean;
};

type Fields = {
  title: string;
  description: string;
  date: string;
  type: "essay" | "note";
  tags: string;
  draft: boolean;
};

const DEFAULT_FIELDS: Fields = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  type: "note",
  tags: "",
  draft: false,
};

// ── helpers ────────────────────────────────────────────────────────────────
function buildMdx(fields: Fields, body: string): string {
  const tags = fields.tags.split(",").map((t) => t.trim()).filter(Boolean);
  return `---
title: "${fields.title}"
description: "${fields.description}"
date: "${fields.date}"
type: "${fields.type}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
draft: ${fields.draft}
---

${body}`;
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── password gate ──────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (input === process.env.NEXT_PUBLIC_STUDIO_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted mb-6 text-center">nahal. studio</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="password"
          autoFocus
          className="w-full bg-elevated border border-accent-deep/30 rounded-lg px-4 py-3 font-mono text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-cyan/50 transition-colors"
        />
        {error && <p className="font-mono text-[10px] text-red-400/70 mt-2 text-center">incorrect</p>}
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

// ── post list ──────────────────────────────────────────────────────────────
function PostList({
  onNew,
  onEdit,
}: {
  onNew: () => void;
  onEdit: (slug: string) => void;
}) {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    await fetch("/api/publish", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    await fetchPosts();
    setDeleting(null);
  };

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">nahal. studio</p>
          <button
            onClick={onNew}
            className="font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 transition-all"
          >
            + new post
          </button>
        </div>

        {loading ? (
          <p className="font-mono text-xs text-fg-muted">loading...</p>
        ) : posts.length === 0 ? (
          <p className="font-mono text-xs text-fg-muted">no posts yet.</p>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between py-4 border-b border-accent-deep/20 group"
              >
                <div className="min-w-0 flex items-center gap-3 flex-1">
                  {post.draft && (
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-yellow-400/30 text-yellow-300/70 flex-shrink-0">
                      draft
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-fg-primary truncate">{post.title}</p>
                    <p className="font-mono text-[10px] text-fg-muted">{post.slug} · {post.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <button
                    onClick={() => onEdit(post.slug)}
                    className="font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-accent-cyan transition-colors"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deleting === post.slug}
                    className="font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-red-400 transition-colors disabled:opacity-30"
                  >
                    {deleting === post.slug ? "deleting..." : "delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── editor ─────────────────────────────────────────────────────────────────
function Editor({
  initialSlug,
  onBack,
}: {
  initialSlug: string | null;
  onBack: () => void;
}) {
  const [fields, setFields] = useState<Fields>(DEFAULT_FIELDS);
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "publishing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(!!initialSlug);

  // load existing post if editing
  useEffect(() => {
    if (!initialSlug) return;
    fetch(`/api/posts?slug=${initialSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setFields({
          title: data.title ?? "",
          description: data.description ?? "",
          date: data.date ?? new Date().toISOString().split("T")[0],
          type: data.type ?? "note",
          tags: (data.tags ?? []).join(", "),
          draft: data.draft ?? false,
        });
        setBody(data.body ?? "");
        setLoading(false);
      });
  }, [initialSlug]);

  const slug = initialSlug ?? slugify(fields.title);
  const mdx = buildMdx(fields, body);

  const publish = async () => {
    if (!fields.title || !body) return;
    setStatus("publishing");
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-xs text-fg-muted">loading post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 md:py-12">
      <div className="max-w-4xl mx-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button
            onClick={onBack}
            className="font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-fg-secondary transition-colors"
          >
            &larr; all posts
          </button>
          <div className="flex items-center gap-3">
            {/* draft toggle */}
            <button
              onClick={() => setFields({ ...fields, draft: !fields.draft })}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border transition-all ${
                fields.draft
                  ? "border-yellow-400/40 text-yellow-300/80 bg-yellow-900/10"
                  : "border-accent-deep/30 text-fg-muted hover:text-fg-secondary"
              }`}
            >
              {fields.draft ? "draft" : "set as draft"}
            </button>
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
              {status === "publishing" ? "publishing..." : status === "done" ? "saved ✓" : fields.draft ? "save draft" : "publish"}
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
              {fields.draft ? "draft saved — won't appear publicly until published" : "committed → Vercel rebuilding → live in ~45s"}
            </p>
          </div>
        )}

        {!preview ? (
          <div className="space-y-4">
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
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("studio_unlocked") === "1") setUnlocked(true);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("studio_unlocked", "1");
    setUnlocked(true);
  };

  const openEditor = (slug: string | null) => {
    setEditingSlug(slug);
    setView("editor");
  };

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />;
  if (view === "editor") return <Editor initialSlug={editingSlug} onBack={() => setView("list")} />;
  return <PostList onNew={() => openEditor(null)} onEdit={(slug) => openEditor(slug)} />;
}