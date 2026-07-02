"use client";

import { studio, focusAreas } from "@/lib/content";
import Reveal from "./Reveal";

export default function Studio() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="mb-6 block text-sm uppercase tracking-[0.25em] text-muted">
              {studio.eyebrow}
            </span>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {studio.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-lg text-foreground/60">{studio.description}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:grid-cols-2">
          {focusAreas.map((item, i) => (
            <Reveal key={item.label} delay={0.1 + i * 0.08}>
              <div className="border-t border-line pt-5">
                <p className="font-display text-lg font-semibold text-accent sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-foreground/50">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
