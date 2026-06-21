import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: string;

  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Send your email as JSON." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "that email doesn't look right. check it and try again." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !audienceId || !from) {
    return NextResponse.json(
      { ok: false, error: "the gate isn't configured yet. try again shortly." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const contact = await resend.contacts.create({ email, audienceId, unsubscribed: false });

  if (contact.error) {
    console.error("CONTACT CREATE FAILED:", JSON.stringify(contact.error));
    const already = /already/i.test(contact.error.message ?? "");
    if (!already) {
      return NextResponse.json(
        { ok: false, error: "we couldn't add you just now. try again in a moment." },
        { status: 502 }
      );
    }
  }

  const sent = await resend.emails.send({
    from,
    to: email,
    subject: "the world has stopped.",
    text: [
      "welcome",
      "",
      "you are here",
      "with us now",
      "",
      "we have been awaiting you",
      "",
      "breathe in with us",
      "deeply",
      "",
      "it's ok",
      "you have time",
      "",
      "pause and reflect",
      "inwardly",
      "",
      "you can rest",
      "here",
      "now",
      "",
      "when you're ready",
      "open the app",
      "and let us begin",
      "",
      "to stop the world",
      "",
      "just breathe",
      "",
      "nothing is asked of you",
      "",
      "there is nothing to do",
      "there is nowhere to be",
      "",
      "just breathe",
      "with us",
      "",
      "slowly",
      "deeply",
      "",
      "be still",
      "be here",
      "",
      "this is but the first stillness",
      "",
      "there are deeper ones to explore",
      "",
      "so welcome my friend",
      "peace and love",
      "",
      "stop the world family",
      "from forge of the soul",
    ].join("\n"),
  });

  if (sent.error) {
    console.error("EMAIL SEND FAILED:", JSON.stringify(sent.error));
  }

  return NextResponse.json({ ok: true });
}
