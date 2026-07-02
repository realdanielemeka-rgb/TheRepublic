import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { work } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work — The Republic Studios",
  description:
    "Real campaigns The Republic Studios has run for clients including Chivita, I-invest, Heirs Insurance, and Prudential Zenith Life Insurance.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-40">
        <section className="mx-auto max-w-7xl px-6 pb-28 sm:px-10 sm:pb-36">
          <Reveal>
            <span className="mb-6 block text-sm uppercase tracking-[0.25em] text-muted">
              Work
            </span>
            <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">
              Campaigns we&apos;ve run for real clients.
            </h1>
          </Reveal>

          <div className="mt-16 border-t border-line">
            {work.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-line py-8 transition-colors sm:py-10"
                >
                  <div className="flex items-baseline gap-4 sm:gap-8">
                    <span className="text-sm text-muted">{`0${i + 1}`}</span>
                    <h2 className="font-display text-3xl font-medium transition-colors group-hover:text-accent sm:text-5xl">
                      {project.client}
                    </h2>
                  </div>

                  <div className="hidden text-right text-sm text-foreground/50 sm:block">
                    <p>{project.campaignType}</p>
                  </div>

                  <ArrowUpRight
                    className="shrink-0 text-foreground/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                    size={26}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
