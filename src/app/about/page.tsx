function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

const PHOTO_STYLE: "hero" | "avatar" | "none" = "hero";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-tertiary hover:text-accent-cyan transition-colors mb-10">
          <ArrowLeftIcon />
          Back to network
        </a>
        <h1 className="text-3xl md:text-4xl font-medium mb-8 text-fg-primary">About</h1>

        {PHOTO_STYLE === "hero" && (
          <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden mb-10 border border-accent-deep/20">
            <img src="/images/profile.jpg" alt="Nahal" className="w-full h-full object-cover object-center" />
          </div>
        )}

        <div className="space-y-8 text-fg-secondary leading-relaxed">
          <div className="flex items-start gap-4">
            {PHOTO_STYLE === "avatar" && (
              <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border border-accent-deep/30" style={{ background: "linear-gradient(135deg, rgba(127, 240, 255, 0.1) 0%, rgba(26, 57, 120, 0.3) 100%)" }} aria-label="Avatar placeholder">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-mono text-xs text-fg-muted">N</span>
                </div>
              </div>
            )}
            <p className="text-base md:text-lg text-fg-primary pt-1">
              Hi, I&apos;m Nahal, a soon-to-be Waterloo alum, heading to Carnegie Mellon this fall for the new Neural Technologies program, where I&apos;ll be focusing on Neural Computation and AI.
            </p>
          </div>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent-light mb-4">how I got here</h2>
            <p className="mb-4">
              I started out in more traditional ML and software through a few co-ops — building models, shipping things, and learning what it feels like to write code in fast-paced, production-intensive startup environments. Somewhere along the way, I kept running into the edges of what these systems could do. Not just <em>that</em> they failed, but <em>how</em> they failed.
            </p>
            <p className="mb-4">
              That curiosity pulled me sideways into computational neuroscience. It&apos;s a field that cares about representation, dynamics, and constraints — the internal story, not just the output. What I find most compelling about this space is the shift in questions. Less about whether somng works, and more about what&apos;s actually happening inside the system.
            </p>
            <p>
              The more I learn, the more it feels like a two-way process: using AI to probe the brain, and using the brain to rethink AI. I&apos;m still figuring out where I stand in all of that, which is part of what makes it interesting.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent-light mb-4">what I&apos;m exploring right now</h2>
            <p className="mb-4">
              Over the past year, I&apos;ve been spending time in computational neuroscience research at Waterloo, thinking about decision-making, dynamics, and how small changes in a system can lead to very different behaviors.
            </p>
            <p className="mb-4">
              Alongside that, I&apos;ve been working in applied ML, pushing agentic AI systems to their limits. This keeps me grounded in what works today while I try to understand what might come next.
            </p>
            <p>
              CMU, for me, is less about a destination and more about having the space to go deeper into these questions — especially at the intersection of neural computation and AI.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent-light mb-4">non-career related facts</h2>
            <p>
              I dance. I roller skate. I get way too competitive over board games (Catan is my favorite). I read a lot, and I used to run a creative writing club in high school, which is probably where this habit of thinking out loud on a page started. 
              My hyperfixation as a kid were dinosaurs and I used to want to be paleontologist and then a genticist (I'm sure you can guess why)!
            </p>
          </section>

          <section>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent-light mb-4">why this site exists</h2>
            <p>
              Mostly as a record of learning in progress — ideas I&apos;m trying to understand, things I&apos;m building, and questions I don&apos;t have answers to yet. If you&apos;re also figuring things out in this space, I&apos;d love to hear what you&apos;re thinking about. And if you&apos;re further along, I&apos;d <em>really</em> value your perspective :)
            </p>
          </section>

          <p className="font-mono text-sm text-fg-tertiary pt-4">— N🌱</p>
        </div>
      </div>
    </main>
  );
}
