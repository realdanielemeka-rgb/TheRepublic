"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { work } from "@/lib/content";

export default function ProjectStrip() {
  const loop = [...work, ...work];

  return (
    <section className="relative overflow-hidden border-y border-line py-10">
      <motion.div
        className="flex w-max gap-6 px-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, ease: "linear", repeat: Infinity }}
      >
        {loop.map((project, i) => (
          <Link
            key={`${project.slug}-${i}`}
            href={`/work/${project.slug}`}
            className="group relative block h-40 w-64 shrink-0 overflow-hidden rounded-xl border border-line sm:h-52 sm:w-80"
            style={{ backgroundColor: project.color }}
          >
            <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex translate-y-3 flex-col justify-end p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-display text-xl font-medium text-white sm:text-2xl">
                {project.client}
              </p>
              <p className="text-xs text-white/70">{project.campaignType}</p>
            </div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
