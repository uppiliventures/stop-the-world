# Stop the World

A Forge of the Soul apparatus. Next.js + Tailwind. Database-free.

## Run

    npm install
    cp .env.example .env.local   # fill in Resend values
    npm run dev

## Where signups go

The violet button posts to `app/api/email/route.ts`, which:
1. Adds the email to your **Resend Audience** (`RESEND_AUDIENCE_ID`) — this is your exportable ledger.
2. Sends a confirmation email from `RESEND_FROM`.

No database. The Audience is the list. Export it from the Resend dashboard.

## Assets to drop in

- `public/audio/meditationspherev2.mp3`
- `public/imagery/` — stage1–7.png plus the ocean/mist horizons named in `lib/imagery.ts`

## Tiers & Stripe

`lib/tiers.ts` holds the three tiers and empty `stripeLink` constants.
Paste live Stripe Payment Links there. Empty links render as disabled (no dead links).

- AWARE — 10 min, free on email capture
- PEACE — 20/30 min, £29.99 lifetime
- HARMONY — 60 min, £49.99 lifetime
