// Tier definitions and Stripe Payment Links.
// Replace the empty strings with live Stripe Payment Link URLs when ready.
// Leaving them empty keeps the buttons clearly disabled rather than firing dead links.

export type Tier = "AWARE" | "PEACE" | "HARMONY";

export const TIERS: Record<
  Tier,
  { label: string; minutes: number; price: string; stripeLink: string }
> = {
  AWARE: {
    label: "Aware",
    minutes: 10,
    price: "Free on email capture",
    stripeLink: "", // free tier, no link
  },
  PEACE: {
    label: "Peace",
    minutes: 20, // structurally also supports 30
    price: "£29.99 lifetime",
    stripeLink: "", // TODO: paste Stripe Payment Link
  },
  HARMONY: {
    label: "Harmony",
    minutes: 60,
    price: "£49.99 lifetime",
    stripeLink: "", // TODO: paste Stripe Payment Link
  },
};

// Movement footer destinations. Swap placeholders for live URLs.
export const FORGE_LINKS = {
  books: "https://book.forgeofthesoul.com",
  merch: "", // TODO
  events: "", // TODO
};
