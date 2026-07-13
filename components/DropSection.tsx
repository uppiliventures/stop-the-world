// ============================================================================
// DropSection.tsx  —  "The Founder's Drop" merch page, Stop the World aesthetic
// Dark ink + bone, thin weights, lowercase, quiet. Matches the books page.
//
// Route via app/drop/page.tsx (or /merch). Drop image + Stripe links into CONFIG.
// ============================================================================

"use client";

import { useState } from "react";

// ----------------------------------------------------------------------------
const CONFIG = {
  // Three Stripe Payment Links — one per size. Create each in Stripe with
  // "collect shipping address" ON. UK delivery included; add international
  // shipping rates in Stripe if you want it calculated at checkout.
  links: {
    S: "https://buy.stripe.com/dRmcN4fGP50W5US4YTbZe07",
    M: "https://buy.stripe.com/dRmfZg3Y7fFA3MKajdbZe08",
    L: "https://buy.stripe.com/fZu28qcuDbpk1ECdvpbZe09",
    XL: "https://buy.stripe.com/5kQfZg9ir6506YW1MHbZe0a",
  },
  price: "£34.99",
  priceNote: "+ shipping", // shipping charged at checkout by destination
  totalPieces: 500,
  giftedPieces: 50, // 10%
  // Path to the real shirt photo. File must live in public/drop/ (NOT app/drop/).
  imageUrl: "/drop/tshirtdrop1.png",
  homeUrl: "/",
  contactEmail: "hello@stoptheworld.app",
  handle: "@UppiliRa",
  hashtags: ["#stoptheworld", "#stoptheworlddrop1"],
};

const INK = "#111214";
const BONE = "#f3f3f1";

type Size = "S" | "M" | "L" | "XL";

export default function DropSection() {
  const [size, setSize] = useState<Size | null>(null);

  function buy() {
    if (!size) return;
    const url = CONFIG.links[size];
    if (url.startsWith("REPLACE")) {
      alert("Stripe link for size " + size + " not set yet. Paste it into CONFIG.links.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const sold = CONFIG.totalPieces - CONFIG.giftedPieces;

  return (
    <section className="min-h-screen w-full" style={{ background: INK, color: BONE }}>
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        {/* back into the app */}
        <a
          href={CONFIG.homeUrl}
          className="mb-20 inline-block text-xs font-light tracking-[0.25em] transition-opacity hover:opacity-80"
          style={{ color: BONE, opacity: 0.5 }}
        >
          stop the world
        </a>

        {/* header */}
        <header className="mb-16">
          <p
            className="mb-6 text-[11px] font-light uppercase tracking-[0.34em]"
            style={{ color: BONE, opacity: 0.4 }}
          >
            the founder&rsquo;s drop &middot; 001/{CONFIG.totalPieces}
          </p>
          <h1 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            {CONFIG.totalPieces} pieces. no more.
          </h1>
          <p
            className="mt-5 max-w-md text-[15px] font-light leading-relaxed"
            style={{ color: BONE, opacity: 0.6 }}
          >
            the first physical signal of a quieter way of living. made once,
            in one run, and then never again.
          </p>
        </header>

        {/* product: image + buy */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_1fr] sm:items-start">
          {/* image slot */}
          <div
            className="flex aspect-square w-full items-start justify-center overflow-hidden px-2 pt-0 pb-4 sm:px-4 sm:pb-6"
            style={{ background: "transparent" }}
          >
            {CONFIG.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={CONFIG.imageUrl}
                alt="Stop the World — the founder's drop t-shirt"
                className="h-full w-full object-contain"
              />
            ) : (
              <Placeholder />
            )}
          </div>

          {/* buy panel */}
          <div className="sm:pt-2">
            <p className="text-2xl font-light tracking-tight">
              {CONFIG.price}
              <span
                className="ml-2 text-sm font-light"
                style={{ color: BONE, opacity: 0.45 }}
              >
                {CONFIG.priceNote}
              </span>
            </p>
            <p
              className="mt-4 text-[14px] font-light leading-relaxed"
              style={{ color: BONE, opacity: 0.6 }}
            >
              100% certified organic cotton. premium mid-weight knit.
              responsibly sourced. shipped worldwide.
            </p>

            {/* size selector */}
            <p
              className="mb-3 mt-8 text-[11px] font-light uppercase tracking-[0.28em]"
              style={{ color: BONE, opacity: 0.4 }}
            >
              size
            </p>
            <div className="mb-8 flex gap-2">
              {(["S", "M", "L", "XL"] as Size[]).map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="h-11 w-14 rounded-md border text-sm font-light lowercase transition-all"
                    style={{
                      borderColor: active ? BONE : "rgba(243,243,241,0.2)",
                      backgroundColor: active ? BONE : "transparent",
                      color: active ? INK : BONE,
                    }}
                  >
                    {s.toLowerCase()}
                  </button>
                );
              })}
            </div>

            <button
              onClick={buy}
              disabled={!size}
              className="w-full rounded-full px-6 py-3.5 text-sm font-light transition-all active:scale-[0.98]"
              style={{
                backgroundColor: size ? BONE : "rgba(243,243,241,0.15)",
                color: size ? INK : "rgba(243,243,241,0.5)",
                cursor: size ? "pointer" : "not-allowed",
              }}
            >
              {size ? `take one — ${CONFIG.price}` : "choose a size"}
            </button>
            <p
              className="mt-3 text-xs font-light"
              style={{ color: BONE, opacity: 0.35 }}
            >
              {sold} for sale. {CONFIG.giftedPieces} held back, to be gifted.
            </p>
          </div>
        </div>

        {/* the gift — framed as generosity, not a gate */}
        <div
          className="mt-24 border-t pt-14"
          style={{ borderColor: "rgba(243,243,241,0.12)" }}
        >
          <p
            className="mb-4 text-[11px] font-light uppercase tracking-[0.28em]"
            style={{ color: BONE, opacity: 0.4 }}
          >
            the gift
          </p>
          <h2 className="max-w-lg text-xl font-light leading-snug tracking-tight">
            {CONFIG.giftedPieces} of the {CONFIG.totalPieces} aren&rsquo;t for
            sale. they&rsquo;re ours to give.
          </h2>
          <p
            className="mt-5 max-w-xl text-[15px] font-light leading-relaxed"
            style={{ color: BONE, opacity: 0.7 }}
          >
            if you&rsquo;ve found a way to bring a little silence into your
            world, we&rsquo;d love to see it. share it however feels right &mdash;
            a few quiet seconds to camera, a photo, a sentence &mdash; and tag it
            so we can find you. some of the voices that move us will be sent one
            of these, no charge, no catch.
          </p>
          <p
            className="mt-5 text-[15px] font-light"
            style={{ color: BONE, opacity: 0.85 }}
          >
            {CONFIG.hashtags.join("  ·  ")}
          </p>
        </div>

        {/* ethos + fine print */}
        <p
          className="mt-20 text-[15px] font-light italic"
          style={{ color: BONE, opacity: 0.4 }}
        >
          nothing is asked of you.
        </p>
        <p
          className="mt-6 text-[11px] font-light leading-relaxed"
          style={{ color: BONE, opacity: 0.3 }}
        >
          the gift is open to entrants aged 18 and over. shared posts may be
          viewed by our team to select recipients; sharing is entirely optional
          and grants no obligation on either side. shipping available worldwide.
          questions: {CONFIG.contactEmail}.
        </p>
      </div>
    </section>
  );
}

// Branded placeholder — an orb over a suggestion of a folded shirt, ink + bone.
function Placeholder() {
  return (
    <svg viewBox="0 0 320 400" className="h-3/4 w-3/4" aria-hidden>
      <defs>
        <radialGradient id="ph-orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f3f3f1" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f3f3f1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f3f3f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="150" r="46" fill="url(#ph-orb)" />
      <circle cx="160" cy="150" r="20" fill="#f3f3f1" fillOpacity="0.85" />
      <text
        x="160"
        y="300"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="15"
        fill="#f3f3f1"
        fillOpacity="0.35"
        letterSpacing="3"
      >
        photo coming
      </text>
    </svg>
  );
}

// ============================================================================
// SETUP:
// 1. Stripe: create 3 Payment Links (S/M/L), each £34.99, "collect shipping
//    address" ON. For international shipping charged separately, add Stripe
//    shipping rates; for flat "delivered worldwide", bake it in and skip.
//    Paste the 3 URLs into CONFIG.links.
// 2. Photo: shoot the real shirt, drop it in /public/drop/, set CONFIG.imageUrl
//    (e.g. "/drop/shirt-001.jpg"). Until then the branded placeholder shows.
// 3. Route: create app/drop/page.tsx importing this component.
// ============================================================================
