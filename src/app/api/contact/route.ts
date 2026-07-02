import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contact } from "../../../../content/site";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "We couldn't read that submission. Please try again." },
      { status: 400 }
    );
  }

  const { name, company, email, budget, message } = body as Record<string, string>;

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
