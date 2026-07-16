import Link from "next/link";
import LagosClock from "./LagosClock";
import { contact, socials } from "../../content/site";

/**
 * §11 step 7 — the lean, four-element footer. Deliberately NOT the v2
 * three-column sitemap-style footer (no multi-office grid, no newsletter,
 * no credits line, no nav column sprawl) — rebuilt outright per spec.
 *
 * The four elements, in order: wordmark · LAGOS + live local time ·
 * "New Business" → office@therepublic.agency (+ Instagram/LinkedIn, only
 * if a real URL is confirmed in content/site.ts's `socials`) · © + Privacy.
 */
export default function Footer() {
  return (
    <footer data-theme="ink" className="w-full px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <p className="display-type text-lg">The Republic</p>
          <LagosClock />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-baseline gap-2">
            <span className="mono-label text-smoke">New Business</span>
            <a href={`mailto:${contact.email}`} className="mono-label hover:text-republic">
              {contact.email}
            </a>
          </div>
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="mono-label hover:text-republic"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-smoke sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Republic.</p>
        <Link href="/legal/privacy" className="hover:text-republic">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
