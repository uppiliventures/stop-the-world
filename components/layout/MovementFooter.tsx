"use client";

import { TIERS, FORGE_LINKS } from "@/lib/tiers";

export default function MovementFooter({ hidden }: { hidden: boolean }) {
  return (
    <footer
      className={`fixed inset-x-0 bottom-0 z-20 px-6 py-5 transition-opacity duration-700 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-40 hover:opacity-90"
      }`}
    >
      <nav className="mx-auto grid max-w-4xl grid-cols-2 gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-bone sm:grid-cols-4">
        <Item
          index="01"
          label="Extend Protocols"
          sub={`${TIERS.PEACE.price} · ${TIERS.HARMONY.price}`}
          href={TIERS.PEACE.stripeLink}
        />
        <Item index="02" label="Books" sub="Forge series & Book 2" href={FORGE_LINKS.books} />
        <Item index="03" label="Merch" sub="Heavy streetwear & desk" href={FORGE_LINKS.merch} />
        <Item index="04" label="Events" sub="Cohorts & sanctuary" href={FORGE_LINKS.events} />
      </nav>
    </footer>
  );
}

function Item({
  index,
  label,
  sub,
  href,
}: {
  index: string;
  label: string;
  sub: string;
  href: string;
}) {
  const content = (
    <div className="flex flex-col gap-1">
      <span className="text-bone/50">{index}</span>
      <span className="text-bone">{label}</span>
      <span className="text-[10px] normal-case tracking-normal text-bone/40">{sub}</span>
    </div>
  );

  if (!href) {
    return <div className="cursor-default">{content}</div>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="hover:text-violet-glow">
      {content}
    </a>
  );
}
