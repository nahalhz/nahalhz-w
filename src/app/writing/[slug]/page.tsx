import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

type Props = { params: Promise<{ slug: string }> };

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/writing", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "src/content/writing");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(".mdx", "") }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { data, content } = post;

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-2xl mx-auto">

        <a
          href="/writing"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeftIcon />
          All writing
        </a>

        {/* post header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-accent-deep/30 text-fg-muted">
              {data.type}
            </span>
            <span className="font-mono text-[10px] text-fg-muted">
              {new Date(data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-fg-primary mb-4 leading-tight">
            {data.title}
          </h1>
          {data.description && (
            <p className="text-lg text-fg-secondary leading-relaxed">{data.description}</p>
          )}
          {data.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tags.map((tag: string) => (
                <span key={tag} className="font-mono text-[10px] px-2.5 py-1 rounded-md border border-accent-deep/25 bg-accent-deep/10 text-fg-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* post body */}
        <article className="prose prose-invert prose-p:text-fg-secondary prose-p:leading-relaxed prose-headings:text-fg-primary prose-headings:font-medium prose-a:text-accent-cyan prose-a:no-underline hover:prose-a:underline prose-code:text-accent-cyan prose-code:bg-accent-deep/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-elevated prose-pre:border prose-pre:border-accent-deep/30 max-w-none">
          <MDXRemote source={content} />
        </article>

        <div className="mt-16 pt-8 border-t border-accent-deep/20">
          <a
            href="/writing"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors"
          >
            <ArrowLeftIcon />
            All writing
          </a>
        </div>

      </div>
    </main>
  );
}