"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { work } from "@/lib/content";
import Reveal from "./Reveal";

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative border-t border-line bg-[#0d0d0c] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="font-display max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
              Selected work
            </h2>
            <p className="max-w-sm text-foreground/60">
              Real campaigns we&apos;ve run for clients across diverse industries.
            </p>
          </div>
        </Reveal>

        <div onMouseLeave={() => setHovered(null)} className="border-t border-line">
          {work.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.04}>
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => setHovered(i)}
                className="group flex items-center justify-between gap-6 border-b border-line py-8 transition-colors sm:py-10"
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="text-sm text-muted">{`0${i + 1}`}</span>
                  <h3 className="font-display text-3xl font-medium transition-colors group-hover:text-accent sm:text-5xl">
                    {project.client}
                  </h3>
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
      </div>

      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed right-16 top-1/2 hidden h-56 w-72 -translate-y-1/2 rounded-2xl opacity-90 lg:block"
            style={{ backgroundColor: work[hovered].color }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
