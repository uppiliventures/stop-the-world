"use client";

import { TIERS, FORGE_LINKS } from "@/lib/tiers";
import Link from "next/link";

export default function MovementFooter({ hidden }: { hidden: boolean }) {
  return (
    <footer
      className={`fixed inset-x-0 bottom-0 z-20 hidden px-6 py-5 transition-opacity duration-700 sm:block ${
        hidden ? "pointer-events-none opacity-0" : "opacity-40 hover:opacity-90"
      }`}
    >
      <nav className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-bone sm:grid-cols-5">
        <ProtocolItem />
        <Item index="02" label="Books" sub="Forge series & Book 2" href={FORGE_LINKS.books} />
        <Item index="03" label="Merch" sub="Heavy streetwear & desk" href={FORGE_LINKS.merch} />
        <Item index="04" label="Events" sub="Cohorts & sanctuary" href={FORGE_LINKS.events} />
        
        <Link href="/privacy" className="hover:text-violet-glow flex flex-col gap-1">
          <span className="text-bone/50">05</span>
          <span className="text-bone">Privacy</span>
          <span className="text-[10px] normal-case tracking-normal text-bone/40">Data & terms</span>
        </Link>
      </nav>
    </footer>
  );
}

function ProtocolItem() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-bone/50">01</span>
      <span className="text-bone">Extend Protocols</span>
      <div className="flex flex-col gap-1 text-[10px] normal-case tracking-normal text-bone/40">
        <a href={TIERS.PEACE.stripeLink} target="_blank" rel="noreferrer" className="hover:text-violet-glow">
          {TIERS.PEACE.label} · {TIERS.PEACE.price}
        </a>
        <a href={TIERS.HARMONY.stripeLink} target="_blank" rel="noreferrer" className="hover:text-violet-glow">
          {TIERS.HARMONY.label} · {TIERS.HARMONY.price}
        </a>
      </div>
    </div>
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
  return (
    <a href={href} target="_blank" rel="noreferrer" className="hover:text-violet-glow">
      {content}
    </a>
  );
}