import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const WRITING_DIR = path.join(process.cwd(), "src/content/writing");

// GET /api/posts          → list all posts (meta only)
// GET /api/posts?slug=x   → single post with body (for editing)
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!fs.existsSync(WRITING_DIR)) {
    return NextResponse.json(slug ? null : []);
  }

  if (slug) {
    const filePath = path.join(WRITING_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return NextResponse.json(null, { status: 404 });
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return NextResponse.json({ ...data, body: content.trim() });
  }

  // list all
  const posts = fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(WRITING_DIR, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug: f.replace(".mdx", ""),
        title: data.title ?? "Untitled",
        date: data.date ?? "",
        type: data.type ?? "note",
        draft: data.draft ?? false,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return NextResponse.json(posts);
}