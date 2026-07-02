import Link from "next/link";
import { business, nav, legalNav } from "@/lib/content";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
              {business.shortName}
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-foreground/50">{business.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">Navigate</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">Connect</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href={`mailto:${business.email}`} className="hover:text-accent">
                    {business.email}
                  </a>
                </li>
                <li className="text-foreground/50">{business.address}</li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">Legal</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {business.name}. All rights reserved.
          </p>
          <p>{business.address}</p>
        </div>
      </div>
    </footer>
  );
}
