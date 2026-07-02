"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { business } from "@/lib/content";

const headline = "We build brands worth talking about.";

export default function Hero() {
  const words = headline.split(" ");

  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-end overflow-hidden pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Design &amp; Marketing Studio · {business.city}, {business.country}
        </motion.p>

        <h1 className="font-display max-w-5xl text-[13vw] font-semibold leading-[0.95] tracking-tight sm:text-[7.5vw] lg:text-[6vw]">
          {words.map((word, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 flex flex-col items-start justify-between gap-8 border-t border-line pt-8 sm:flex-row sm:items-end"
        >
          <p className="max-w-md text-lg text-foreground/70">
            {business.tagline} Strategy, identity, product and campaigns — under one roof.
          </p>

          <a
            href="#work"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/90"
          >
            See our work
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
              <ArrowDownRight size={16} />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
