import Link from "next/link";
import { contact, nav, socials } from "../../content/site";

export default function Footer() {
  return (
    <footer data-theme="ink" className="w-full px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="display-type text-2xl">The Republic</p>
            <p className="measure mt-4 text-sm text-smoke">
              {contact.address.full}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="mono-label text-smoke">Navigate</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm hover:text-republic">
                {item.label}
              </Link>
            ))}
            <Link href="/legal/privacy" className="text-sm hover:text-republic">
              Privacy
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="mono-label text-smoke">Reach us</p>
            <a href={`mailto:${contact.email}`} className="text-sm hover:text-republic">
              {contact.email}
            </a>
            <a href={`tel:${contact.phoneHref}`} className="text-sm hover:text-republic">
              {contact.phone}
            </a>
            {socials.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {socials.map((s) => (
                  <a key={s.href} href={s.href} className="text-sm hover:text-republic" target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-paper/15 pt-6 text-xs text-smoke sm:flex-row">
          <p>© 2026 The Republic. Lagos.</p>
          <Link href="/legal/privacy" className="hover:text-republic">
            Legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
