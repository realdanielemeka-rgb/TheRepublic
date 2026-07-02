import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-40">
        <section className="mx-auto max-w-3xl px-6 pb-28 sm:px-10 sm:pb-36">
          <Reveal>
            <span className="mb-6 block text-sm uppercase tracking-[0.25em] text-muted">
              Legal
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>

            <div className="prose-legal mt-12 space-y-6 text-foreground/70">{children}</div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
