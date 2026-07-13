// ============================================================================
// EventsSection.tsx  —  Stop the World gatherings: expression of interest.
// Ink + bone, thin, lowercase. Same pattern as the drop & books pages.
// No backend — email CTAs with pre-sorted subject lines. Route via app/events.
// ============================================================================

"use client";

const CONFIG = {
  email: "hello@stoptheworld.app",
  homeUrl: "/",
};

const INK = "#111214";
const BONE = "#f3f3f1";

// mailto helper — pre-fills a sorted subject so replies self-organise
function mailto(subject: string) {
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}`;
}

const tracks = [
  {
    label: "attend",
    line: "be in the room when we gather.",
    body: "if you'd like to sit in a future space with us, tell us. we'll let you know when and where the first ones open.",
    subject: "Gatherings: attend",
    cta: "put your name down",
  },
  {
    label: "sponsor",
    line: "help a gathering happen.",
    body: "if your work aligns with stillness and you'd like to support a gathering, we'd like to hear from you. we review each one for fit before we say yes.",
    subject: "Gatherings: sponsor",
    cta: "start a conversation",
  },
  {
    label: "partner",
    line: "a space, a table, a craft.",
    body: "venues, hosts, food, and practitioners — if you could hold or help shape a gathering, put yourself forward. we choose partners slowly and carefully.",
    subject: "Gatherings: partner",
    cta: "offer what you bring",
  },
];

export default function EventsSection() {
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
            gatherings
          </p>
          <h1 className="text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            gatherings are on the horizon.
          </h1>
          <p
            className="mt-5 max-w-md text-[15px] font-light leading-relaxed"
            style={{ color: BONE, opacity: 0.6 }}
          >
            spaces to stop the world together &mdash; quiet rooms, shared breath,
            time set apart. they&rsquo;re forming slowly. if you&rsquo;d like to be
            part of one, in any way, this is where it starts.
          </p>
        </header>

        {/* three tracks */}
        <div>
          {tracks.map((t) => (
            <article
              key={t.label}
              className="border-t py-12 first:border-t-0"
              style={{ borderColor: "rgba(243,243,241,0.12)" }}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <p
                    className="mb-3 text-[11px] font-light uppercase tracking-[0.28em]"
                    style={{ color: BONE, opacity: 0.4 }}
                  >
                    {t.label}
                  </p>
                  <h2 className="text-2xl font-light leading-snug tracking-tight">
                    {t.line}
                  </h2>
                  <p
                    className="mt-4 max-w-xl text-[15px] font-light leading-relaxed"
                    style={{ color: BONE, opacity: 0.7 }}
                  >
                    {t.body}
                  </p>
                </div>

                <div className="sm:pt-9">
                  <a
                    href={mailto(t.subject)}
                    className="inline-block whitespace-nowrap rounded-full border px-6 py-2.5 text-sm font-light transition-opacity hover:opacity-70"
                    style={{ borderColor: "rgba(243,243,241,0.35)", color: BONE }}
                  >
                    {t.cta}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ethos + fit note */}
        <p
          className="mt-20 text-[15px] font-light italic"
          style={{ color: BONE, opacity: 0.4 }}
        >
          nothing is asked of you.
        </p>
        <p
          className="mt-6 text-[13px] font-light leading-relaxed"
          style={{ color: BONE, opacity: 0.4 }}
        >
          every note is read. we reply to the ones that feel like a fit, in our
          own time &mdash; there is no hurry here. {CONFIG.email}
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// SETUP:
// 1. Route: create app/events/page.tsx importing this component.
// 2. Footer: point 04 Events at "/events" (internal), replacing FORGE_LINKS.events.
// No backend needed — the three CTAs open the mail client with a pre-sorted
// subject line, so replies land already labelled (attend / sponsor / partner).
// Later, swap the mailto CTAs for a form (Formspree/Resend) if volume grows.
// ============================================================================
