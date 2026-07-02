"use client";

import { motion } from "framer-motion";

const items = [
  "Brand Strategy",
  "Digital Product",
  "Growth Marketing",
  "Motion & Film",
  "Identity Systems",
  "Web Development",
];

export default function Marquee() {
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line bg-background py-6">
      <motion.div
        className="flex w-max gap-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-display text-2xl text-foreground/25 sm:text-4xl">{item}</span>
            <span className="text-2xl text-accent sm:text-4xl">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
