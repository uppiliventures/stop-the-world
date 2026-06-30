import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "privacy — Stop the World",
  description: "How Stop the World collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink text-bone/80">
      <div className="mx-auto max-w-2xl px-6 py-20 font-light leading-relaxed">
        <Link href="/" className="text-sm lowercase tracking-[0.15em] text-bone/40 transition-colors hover:text-bone/70">← back</Link>

        <h1 className="mt-12 text-2xl font-light tracking-tight text-bone">privacy policy</h1>
        <p className="mt-2 text-sm text-bone/40">last updated: 30 june 2026</p>

        <p className="mt-8">This Privacy Policy explains how <strong className="font-normal text-bone">UNREALISED LIMITED</strong> ("we", "us", "our") collects, uses, and protects your personal information when you use <strong className="font-normal text-bone">Stop the World</strong> — our website and web application at stoptheworld.app, and our forthcoming mobile application (together, the "Service").</p>
        <p className="mt-4">We are committed to protecting your privacy and handling your data openly and transparently. This policy is written to comply with the EU General Data Protection Regulation (GDPR), the UK GDPR and Data Protection Act 2018, and to give clear information to users worldwide.</p>

        <Section title="1. who we are">
          <p>UNREALISED LIMITED is the data controller responsible for your personal data.</p>
          <p className="mt-3">If you have any questions about this policy or your data, contact us at <a href="mailto:hello@stoptheworld.app" className="text-bone underline-offset-4 hover:underline">hello@stoptheworld.app</a>.</p>
        </Section>

        <Section title="2. what we collect">
          <p>We aim to collect as little as possible.</p>
          <p className="mt-3"><strong className="font-normal text-bone">Information you give us:</strong> your email address, if you choose to provide it (for example, to join our list or receive updates).</p>
          <p className="mt-3"><strong className="font-normal text-bone">Information collected automatically:</strong> usage and analytics data via PostHog, our analytics provider. This may include pages visited, actions taken within the Service, approximate location, device and browser type, and IP address.</p>
          <p className="mt-3">We do not intentionally collect sensitive personal data, and we do not handle payment card details directly (any payments, where offered, are handled by a third-party payment provider).</p>
        </Section>

        <Section title="3. how we use it">
          <p>We use your information to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-bone/30">
            <li>Send you updates, our newsletter, and information about Stop the World and related products and services from us (where you have provided your email);</li>
            <li>Operate, maintain, and improve the Service;</li>
            <li>Understand how the Service is used through analytics;</li>
            <li>Comply with our legal obligations.</li>
          </ul>
          <p className="mt-3">We only send marketing communications where you have given consent (for example, by submitting your email), and you can withdraw that consent at any time. We <strong className="font-normal text-bone">do not sell your personal data</strong>, and we do not share it with third parties for their own marketing.</p>
        </Section>

        <Section title="4. legal bases (EU/UK)">
          <ul className="list-disc space-y-1 pl-5 marker:text-bone/30">
            <li><strong className="font-normal text-bone">Consent</strong> — for marketing and newsletter emails. You can withdraw at any time.</li>
            <li><strong className="font-normal text-bone">Legitimate interests</strong> — for analytics and improving the Service, balanced against your rights.</li>
            <li><strong className="font-normal text-bone">Legal obligation</strong> — where required to comply with the law.</li>
          </ul>
        </Section>

        <Section title="5. cookies and analytics">
          <p>Our analytics provider (PostHog) may set cookies or similar technologies to recognise your device and collect usage data. You can control or disable cookies through your browser settings. Where required by law, we will seek your consent before setting non-essential cookies.</p>
        </Section>

        <Section title="6. sharing and processors">
          <p>We share data only with trusted service providers who process it on our behalf, under appropriate safeguards. These currently include:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-bone/30">
            <li><strong className="font-normal text-bone">PostHog</strong> — product analytics;</li>
            <li><strong className="font-normal text-bone">Resend</strong> — email delivery;</li>
            <li><strong className="font-normal text-bone">Vercel</strong> — website hosting.</li>
          </ul>
          <p className="mt-3">These providers may process data outside your country, including outside the EU/UK. Where data is transferred internationally, we take steps to ensure an appropriate level of protection (such as Standard Contractual Clauses or equivalent safeguards).</p>
        </Section>

        <Section title="7. your rights">
          <p>Depending on your location, you may have the right to access, correct, delete, object to or restrict processing, withdraw consent, request data portability, and lodge a complaint with a supervisory authority (in the UK, the Information Commissioner's Office, ico.org.uk).</p>
          <p className="mt-3">To unsubscribe from emails, use the unsubscribe link in any message, or contact <a href="mailto:hello@stoptheworld.app" className="text-bone underline-offset-4 hover:underline">hello@stoptheworld.app</a>. To exercise any other right, contact us at the same address and we will respond within the timeframe required by law.</p>
        </Section>

        <Section title="8. data retention">
          <p>We keep your email address for as long as you remain subscribed or until you ask us to delete it. Analytics data is retained only as long as needed for the purposes described above. When data is no longer needed, we delete or anonymise it.</p>
        </Section>

        <Section title="9. children">
          <p>The Service is not directed at children under 16, and we do not knowingly collect their data. If you believe a child has provided us with personal data, please contact us and we will delete it.</p>
        </Section>

        <Section title="10. changes">
          <p>We may update this policy from time to time. When we do, we will revise the "last updated" date above. Significant changes will be communicated where appropriate.</p>
        </Section>

        <Section title="11. contact">
          <p><strong className="font-normal text-bone">UNREALISED LIMITED</strong><br /><a href="mailto:hello@stoptheworld.app" className="text-bone underline-offset-4 hover:underline">hello@stoptheworld.app</a></p>
          <p className="mt-3">If you have concerns we have not resolved, you have the right to complain to your local data protection authority.</p>
        </Section>

        <div className="mt-16 border-t border-bone/10 pt-8">
          <Link href="/" className="text-sm lowercase tracking-[0.15em] text-bone/40 transition-colors hover:text-bone/70">← back to stillness</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-normal lowercase tracking-wide text-bone">{title}</h2>
      <div className="mt-3 text-bone/70">{children}</div>
    </section>
  );
}
