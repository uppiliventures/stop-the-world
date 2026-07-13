"use client";

import { FORGE_LINKS } from "@/lib/tiers";
import Link from "next/link";

export default function MovementFooter({ hidden }: { hidden: boolean }) {
  return (
    <footer
      className={`fixed inset-x-0 bottom-0 z-20 block px-6 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] transition-opacity duration-700 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-40 hover:opacity-90"
      }`}
    >
      <nav className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-bone sm:grid-cols-5">
        <Item index="01" label="The Forge" sub="the courage to become" href={FORGE_LINKS.movement} />

        {/* 02 BOOKS — clean local link to the catalog */}
        <Item index="02" label="Books" sub="stillness & forge" href="/books" />

        {/* 03 MERCH — the founder's drop, local /drop page */}
        <Item index="03" label="Merch" sub="the founder's drop" href="/drop" />

        <Item index="04" label="Events" sub="gatherings on the horizon" href="/events" />

        <Link href="/privacy" className="hover:text-violet-glow flex flex-col gap-1">
          <span className="text-bone/50">05</span>
          <span className="text-bone">Privacy</span>
          <span className="text-[10px] normal-case tracking-normal text-bone/40">data &amp; terms</span>
        </Link>
      </nav>
    </footer>
  );
}

function Item({ index, label, sub, href }: { index: string; label: string; sub: string; href: string; }) {
  const content = (
    <div className="flex flex-col gap-1">
      <span className="text-bone/50">{index}</span>
      <span className="text-bone">{label}</span>
      <span className="text-[10px] normal-case tracking-normal text-bone/40">{sub}</span>
    </div>
  );
  if (!href) return <div className="cursor-default">{content}</div>;

  // Internal routing check so Next.js handles local links smoothly without a hard refresh
  if (href.startsWith("/")) {
    return (
      <Link href={href} className="hover:text-violet-glow">
        {content}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="hover:text-violet-glow">
      {content}
    </a>
  );
}
