import { notFound } from "next/navigation";

/**
 * Everything under /dev is internal QA scaffolding — not part of the
 * site map, not linked from anywhere public. This layout is the single
 * gate: in a production build/serve (`next build` / `next start`, i.e.
 * NODE_ENV === "production", which is also what Vercel's build sets),
 * every /dev/* route resolves to the standard not-found boundary. In
 * `next dev` it renders normally so Phase B/C can use it for visual QA.
 *
 * See DECISIONS.md ("Dev QA routes") for what lives here and why it was
 * kept rather than deleted after Phase A's own verification.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-paper px-6 py-16 text-ink sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mono-label text-smoke">
          /dev — internal QA only, 404s in production builds
        </p>
        {children}
      </div>
    </div>
  );
}
