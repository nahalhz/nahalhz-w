import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  type: "essay" | "note";
  tags: string[];
};

function getPosts(): PostMeta[] {
  const dir = path.join(process.cwd(), "src/content/writing");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug: f.replace(".mdx", ""),
        title: data.title ?? "Untitled",
        description: data.description ?? "",
        date: data.date ?? "",
        type: data.type ?? "note",
        tags: data.tags ?? [],
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function WritingPage() {
  const posts = getPosts();

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-3xl mx-auto">

        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeftIcon />
          Back to network
        </a>

        <h1 className="text-3xl md:text-4xl font-medium mb-4 text-fg-primary">Writing</h1>
        <p className="text-fg-secondary leading-relaxed mb-16 max-w-xl">
          Essays and notes on brain-inspired AI, grad school, and whatever I'm thinking about.
        </p>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-fg-muted">Nothing here yet.</p>
        ) : (
          <div className="space-y-0">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group block py-6 border-b border-accent-deep/20 hover:border-accent-cyan/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-accent-deep/30 text-fg-muted">
                        {post.type}
                      </span>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="font-mono text-[9px] text-fg-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-lg font-medium text-fg-primary group-hover:text-accent-cyan transition-colors mb-1">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-sm text-fg-secondary leading-relaxed">{post.description}</p>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-fg-muted flex-shrink-0 mt-1">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}