"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/content";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
      <Reveal>
        <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="font-display max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
            What we do
          </h2>
          <p className="max-w-sm text-foreground/60">
            Four disciplines, one team — so strategy, design and execution never lose the thread.
          </p>
        </div>
      </Reveal>

      <div className="divide-y divide-line border-t border-line">
        {services.map((service, i) => (
          <Reveal key={service.index} delay={i * 0.05}>
            <motion.div
              whileHover="hover"
              className="group grid grid-cols-1 gap-6 py-10 sm:grid-cols-12 sm:items-center"
            >
              <span className="font-display text-sm text-muted sm:col-span-1">{service.index}</span>

              <h3 className="font-display text-2xl font-medium sm:col-span-4 sm:text-3xl">
                {service.title}
              </h3>

              <p className="text-foreground/60 sm:col-span-5">{service.description}</p>

              <div className="flex flex-wrap gap-2 sm:col-span-2 sm:justify-end">
                {service.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-xs text-foreground/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <motion.div
                variants={{ hover: { scaleX: 1 } }}
                initial={{ scaleX: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="col-span-full h-px origin-left bg-accent"
              />
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
