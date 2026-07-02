"use client";

import { process } from "@/lib/content";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section className="border-t border-line bg-[#0d0d0c] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
            How we work
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.08} y={20} className="h-full">
              <div className="flex h-full flex-col bg-background p-8">
                <span className="font-display text-3xl text-accent">{`0${i + 1}`}</span>
                <h3 className="font-display mt-6 text-xl font-medium">{item.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
