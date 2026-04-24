import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

export async function POST(req: NextRequest) {
  // verify internal secret so only your studio page can call this
  const auth = req.headers.get("x-studio-secret");
  if (auth !== process.env.STUDIO_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, content } = await req.json();

  if (!slug || !content) {
    return NextResponse.json({ error: "Missing slug or content" }, { status: 400 });
  }

  const path = `src/content/writing/${slug}.mdx`;
  const encoded = Buffer.from(content).toString("base64");

  // check if file already exists (needed to get sha for update)
  let sha: string | undefined;
  const checkRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (checkRes.ok) {
    const existing = await checkRes.json();
    sha = existing.sha;
  }

  // commit the file
  const commitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sha ? `update: ${slug}` : `post: ${slug}`,
        content: encoded,
        branch: GITHUB_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!commitRes.ok) {
    const err = await commitRes.json();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path });
}