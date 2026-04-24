"use client";
import { useState, useEffect } from "react";

import NetworkScene from "@/components/scene/NetworkScene";

function GitHubIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedInIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}


function ChatBubble() {
  const FULL_MESSAGE = "Hi there! I'm an ML engineer and researcher passionate about building intelligent systems and brain-inspired AI.";
  const [displayed, setDisplayed] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < FULL_MESSAGE.length) {
        setDisplayed(FULL_MESSAGE.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        // After typing finishes, wait 3.5 seconds then fade
        setTimeout(() => setVisible(false), 3500);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <div
      className="absolute bottom-40 left-8 md:bottom-48 md:left-10 max-w-xs md:max-w-sm z-10 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease-out",
      }}
    >
      <div
        className="relative px-5 py-4 rounded-2xl rounded-bl-sm"
        style={{
          background: "rgba(10, 25, 55, 0.75)",
          backdropFilter: "blur(12px)",
          border: "0.5px solid rgba(130, 190, 255, 0.25)",
        }}
      >
        <p
          className="font-sans text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(230, 242, 255, 0.92)" }}
        >
          {displayed}
          <span
            className="inline-block w-[2px] h-[1em] ml-[1px] align-middle"
            style={{
              background: "rgba(127, 240, 255, 0.8)",
              animation: "chatCursorBlink 1s steps(2) infinite",
            }}
          />
        </p>
        {/* tail */}
        <div
          className="absolute -bottom-2 left-5 w-4 h-4"
          style={{
            background: "rgba(10, 25, 55, 0.75)",
            backdropFilter: "blur(12px)",
            borderLeft: "0.5px solid rgba(130, 190, 255, 0.25)",
            borderBottom: "0.5px solid rgba(130, 190, 255, 0.25)",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes chatCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden" style={{ background: "radial-gradient(ellipse at center, #0d1e42 0%, #05080f 70%, #020510 100%)" }}>
      <NetworkScene />
      <ChatBubble />
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 font-mono pointer-events-none z-10">
      <div className="text-7xl md:text-8xl font-medium tracking-tight text-fg-primary leading-none">nahal🌱</div>
      <div className="mt-3 text-lg uppercase tracking-widest text-fg-tertiary">ML X COMP NEURO</div>
      </div>
      <div className="absolute top-4 left-4 font-mono text-xs tracking-widest text-fg-muted pointer-events-none z-10" aria-hidden>
        DRAG HOVER CLICK
      </div>
      <nav className="absolute bottom-8 right-8 md:bottom-10 md:right-10 flex flex-col items-center gap-5 z-10">
        <a href="https://github.com/nahalhz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-fg-muted hover:text-accent-cyan transition-colors">
          <GitHubIcon size={37} />
        </a>
        <a href="https://linkedin.com/in/nahalhz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-fg-muted hover:text-accent-cyan transition-colors">
          <LinkedInIcon size={37} />
        </a>
        <a href="mailto:nhabibiz@uwaterloo.ca" aria-label="Email" className="text-fg-muted hover:text-accent-cyan transition-colors">
          <MailIcon size={37} />
        </a>
      </nav>
    </main>
  );
}