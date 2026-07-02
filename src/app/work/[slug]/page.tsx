import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { work } from "@/lib/content";

export function generateStaticParams() {
  return work.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = work.find((item) => item.slug === slug);

  if (!project) {
    return { title: "Work — The Republic Studios" };
  }

  return {
    title: `${project.client} — The Republic Studios`,
    description: project.summary,
  };
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = work.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-40">
        <section className="mx-auto max-w-4xl px-6 pb-28 sm:px-10 sm:pb-36">
          <Reveal>
            <Link
              href="/work"
              className="mb-10 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent"
            >
              <ArrowLeft size={16} />
              All work
            </Link>

            <div
              className="mb-10 h-56 w-full rounded-2xl border border-line sm:h-72"
              style={{ backgroundColor: project.color }}
            />

            <span className="mb-4 block text-sm uppercase tracking-[0.25em] text-muted">
              {project.campaignType}
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
              {project.client}
            </h1>

            <p className="mt-8 max-w-2xl text-lg text-foreground/70">{project.summary}</p>

            <div className="mt-12 border-t border-line pt-8">
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">
                Strategies applied
              </p>
              <div className="flex flex-wrap gap-3">
                {project.strategies.map((strategy) => (
                  <span
                    key={strategy}
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-foreground/70"
                  >
                    {strategy}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="group mt-16 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-white"
            >
              Start a project
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
