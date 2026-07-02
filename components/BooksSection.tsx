// ============================================================================
// BooksSection.tsx  —  simple, dark, no accent colour. Fixed price £4.99.
//
// Drop into components/ and route via app/books/page.tsx.
// WIRING: paste your Stripe Payment Link into CONFIG.stillnessCheckoutUrl.
// ============================================================================

"use client";

// ----------------------------------------------------------------------------
const CONFIG = {
  // Stripe Payment Link for the little book of stillness (£4.99).
  stillnessCheckoutUrl: "https://buy.stripe.com/9B64gyeCL50Wcjg2QLbZe06",
  stillnessPrice: "£4.99",
  // Forge — singular subdomain.
  forgeUrl: "https://book.forgeofthesoul.com",
  // Link back into the app / home.
  homeUrl: "/",
};

// app palette — ink + bone only, no accent
const INK = "#111214";
const BONE = "#f3f3f1";

const books = [
  {
    id: "stillness",
    title: "the little book of stillness",
    tagline: "stop the world for a while",
    role: "the doorway",
    blurb:
      "a short, quiet book for people with too much noise and too little time. one move — stopping the world for a few minutes — and every room of an ordinary day you can use it in. no belief required. nothing is asked of you.",
    meta: "ebook · ~45 pages · read in one sitting",
    price: CONFIG.stillnessPrice,
    href: CONFIG.stillnessCheckoutUrl,
    cta: "read the little book",
  },
  {
    id: "forge",
    title: "forge of the soul",
    tagline: "the courage to become",
    role: "the deeper path",
    blurb:
      "for those ready for the harder work. a mythic path to inner strength and purpose, built around the 12 Cs of transformation — twenty years to arrive at, five to write. where the little book invites calm, this one asks for change.",
    meta: "full-length book · available now",
    price: null,
    href: CONFIG.forgeUrl,
    cta: "read forge of the soul",
  },
];

export default function BooksSection() {
  return (
    <section
      className="min-h-screen w-full"
      style={{ background: INK, color: BONE }}
    >
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        {/* quiet way back into the app */}
        <a
          href={CONFIG.homeUrl}
          className="mb-20 inline-block text-xs font-light tracking-[0.25em] transition-opacity hover:opacity-80"
          style={{ color: BONE, opacity: 0.5 }}
        >
          stop the world
        </a>

        {/* header */}
        <header className="mb-20">
          <p
            className="mb-6 text-[11px] font-light uppercase tracking-[0.34em]"
            style={{ color: BONE, opacity: 0.4 }}
          >
            unrealised books
          </p>
          <h1 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            two books, two depths.
          </h1>
          <p
            className="mt-5 max-w-md text-[15px] font-light leading-relaxed"
            style={{ color: BONE, opacity: 0.6 }}
          >
            one to help you pause. one to help you change. start wherever you
            are — there is no hurry here.
          </p>
        </header>

        {/* books */}
        <div>
          {books.map((book) => (
            <article
              key={book.id}
              className="border-t py-14 first:border-t-0"
              style={{ borderColor: "rgba(243,243,241,0.12)" }}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <p
                    className="mb-3 text-[11px] font-light uppercase tracking-[0.28em]"
                    style={{ color: BONE, opacity: 0.4 }}
                  >
                    {book.role}
                  </p>
                  <h2 className="text-2xl font-light leading-snug tracking-tight">
                    {book.title}
                  </h2>
                  <p
                    className="mt-1 text-[15px] font-light italic"
                    style={{ color: BONE, opacity: 0.55 }}
                  >
                    {book.tagline}
                  </p>
                  <p
                    className="mt-5 max-w-xl text-[15px] font-light leading-relaxed"
                    style={{ color: BONE, opacity: 0.75 }}
                  >
                    {book.blurb}
                  </p>
                  <p
                    className="mt-4 text-xs font-light tracking-wide"
                    style={{ color: BONE, opacity: 0.35 }}
                  >
                    {book.meta}
                    {book.price ? " · " + book.price : ""}
                  </p>
                </div>

                <div className="sm:pt-9">
                  <a
                    href={book.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block whitespace-nowrap rounded-full border px-6 py-2.5 text-sm font-light transition-opacity hover:opacity-70"
                    style={{ borderColor: "rgba(243,243,241,0.35)", color: BONE }}
                  >
                    {book.cta}
                    {book.price ? " · " + book.price : ""}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ethos footer line */}
        <p
          className="mt-20 text-[15px] font-light italic"
          style={{ color: BONE, opacity: 0.4 }}
        >
          nothing is asked of you.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// STRIPE SETUP — see the message accompanying this file for exact fields.
// Once your Payment Link is created, paste it into
// CONFIG.stillnessCheckoutUrl above. That's the only change needed.
// ============================================================================
