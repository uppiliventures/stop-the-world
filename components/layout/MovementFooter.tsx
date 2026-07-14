"use client";

import { useState, useEffect } from "react";
import { FORGE_LINKS } from "@/lib/tiers";
import Link from "next/link";

export default function MovementFooter({ hidden }: { hidden: boolean }) {
  // Gentle mount fade so the footer eases in softly on first load rather than
  // snapping to full opacity.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const visible = mounted && !hidden;

  return (
    <footer
      className={`fixed inset-x-0 bottom-0 z-20 block px-6 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-opacity duration-[1200ms] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <nav className="mx-auto flex max-w-md flex-col items-center gap-3 text-bone">
        {/* primary row — content & commerce */}
        <div className="flex items-center justify-center gap-7 text-[13px] font-light lowercase tracking-[0.18em]">
          <Item label="books" href="/books" />
          <Item label="merch" href="/drop" />
          <Item label="events" href="/events" />
        </div>
        {/* quieter row — the deeper path & the fine print */}
        <div className="flex items-center justify-center gap-7 text-[13px] font-light lowercase tracking-[0.18em]">
          <Item label="forge" href={FORGE_LINKS.movement} />
          <Item label="privacy" href="/privacy" />
        </div>
      </nav>
    </footer>
  );
}

function Item({ label, href }: { label: string; href: string }) {
  const className = "text-bone/70 transition-colors hover:text-bone";

  if (!href) return <span className="text-bone/40">{label}</span>;

  // Internal routes use Next.js <Link> (no hard refresh); external links open in a new tab.
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {label}
    </a>
  );
}
