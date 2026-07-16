import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact } from "../../../../content/site";

/**
 * Spam/abuse protection, added as a competition-readiness pass — this
 * route is a public, unauthenticated POST endpoint, so it needs both:
 *
 * 1. An in-memory sliding-window rate limit keyed by IP. KNOWN LIMITATION,
 *    documented here and in DECISIONS.md rather than left as a silent gap:
 *    this `Map` lives in one server process's memory. On Vercel's
 *    serverless runtime, a cold start gets a fresh empty Map, and separate
 *    concurrent instances don't share state with each other — so this is a
 *    best-effort deterrent against a single scripted client hammering a
 *    single warm instance, not a hard multi-instance guarantee. A durable
 *    store (Upstash/Redis, Vercel KV, etc.) would be needed for that. Still
 *    meaningfully better than no protection at all, and dependency-free,
 *    which matched this stage's constraints.
 * 2. A honeypot field (`hp_field`, see ContactForm.tsx) — a real visitor
 *    never sees or can tab to it; a filled value means a bot submitted
 *    every field it could find in the DOM. Rejected with a normal-looking
 *    200 rather than a 4xx, so a scripted client gets no signal to adapt
 *    against.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestLog.set(ip, recent);

  // Opportunistic cleanup so this Map can't grow unbounded across a
  // long-lived process — drop any IP with nothing inside the current
  // window. Cheap (only runs once the log has grown past a small bound),
  // not a scheduled job.
  if (requestLog.size > 500) {
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please try again in a minute." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "We couldn't read that submission. Please try again." },
      { status: 400 }
    );
  }

  const { name, company, email, budget, message, hp_field } = body as Record<string, string>;

  // Honeypot: see the doc comment above and ContactForm.tsx. A real visitor
  // never fills this field (visually hidden, removed from the tab order
  // and the accessibility tree) — silently accept-and-drop rather than
  // reveal the check with a 4xx.
  if (hp_field) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name — please tell us who you are." }, { status: 400 });
  }
  if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Email — please enter a valid address." },
      { status: 400 }
    );
  }
  if (!message?.trim()) {
    return NextResponse.json(
      { error: "Message — tell us what you're trying to make happen." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Graceful fallback: no Resend key configured in this environment.
    return NextResponse.json(
      {
        fallback: true,
        mailto: `mailto:${contact.email}?subject=${encodeURIComponent(
          `New project enquiry — ${name}`
        )}&body=${encodeURIComponent(
          `Name: ${name}\nCompany: ${company ?? "—"}\nEmail: ${email}\nBudget: ${budget ?? "—"}\n\n${message}`
        )}`,
      },
      { status: 200 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const domain = contact.email.split("@")[1] ?? "therepublic.agency";
    await resend.emails.send({
      from: `The Republic <noreply@${domain}>`,
      to: contact.email,
      replyTo: email,
      subject: `New project enquiry — ${name}`,
      text: `Name: ${name}\nCompany: ${company ?? "—"}\nEmail: ${email}\nBudget: ${budget ?? "—"}\n\n${message}`,
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "We couldn't send that just now. Please email us directly." },
      { status: 502 }
    );
  }
}
