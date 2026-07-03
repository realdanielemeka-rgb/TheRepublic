import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import GridEngineClient from "@/components/GridEngineClient";
import { GRID_ENGINE_BOOT_SCRIPT } from "@/lib/grid-engine";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance";
import { site, contact, socials } from "../../content/site";
import { getFeaturedMedia } from "../../content/work";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Creative & Digital Agency, Lagos`,
    template: "%s — The Republic",
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${contact.address.line1}, ${contact.address.area}`,
      addressLocality: contact.address.city,
      addressCountry: contact.address.country,
    },
    email: contact.email,
    telephone: contact.phone,
    // Derived from content/site.ts's socials list rather than hardcoded —
    // stays empty today (no confirmed handles) and picks up real URLs
    // automatically the moment one is added, with no risk of this literal
    // staying stale/empty after socials.ts is updated.
    sameAs: socials.map((s) => s.href),
  };

  return (
    <html
      lang="en-GB"
      className={`${spaceMono.variable} ${inter.variable}`}
      // Both boot scripts below mutate attributes/inline styles on this
      // element (data-appearance, --grid-* custom properties) before
      // React hydrates — suppressHydrationWarning tells React that's
      // expected and not a mismatch to reconcile away. Per Next's own
      // documented pattern for this exact "prevent flash before
      // hydration" technique (node_modules/next/dist/docs/01-app/
      // 02-guides/preventing-flash-before-hydration.md).
      suppressHydrationWarning
    >
      <head>
        {/* §4.7.3 — sets data-appearance before first paint, no flash of
            the wrong appearance. Must run before the grid-engine script
            below reads window.innerWidth (order doesn't actually matter
            between the two — neither depends on the other — but keeping
            appearance first mirrors the spec's own listed order). */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        {/* §4.5 — sets --grid-* custom properties before first paint,
            using the fallback char-width ratio; GridEngineClient replaces
            these with the real font-measured values a moment after
            mount. */}
        <script dangerouslySetInnerHTML={{ __html: GRID_ENGINE_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <GridEngineClient />
        <Preloader frames={getFeaturedMedia()} />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
