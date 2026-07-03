import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
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
    <html lang="en-GB" className={`${spaceMono.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <Preloader frames={getFeaturedMedia()} />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
