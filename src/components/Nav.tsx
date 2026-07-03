"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import MixBlendHover from "./MixBlendHover";
import CharHoverLink from "./CharHoverLink";
import AppearanceToggle from "./AppearanceToggle";
import { nav } from "../../content/site";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="display-type text-lg mix-blend-difference text-paper"
          onClick={() => setOpen(false)}
        >
          The Republic
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative overflow-hidden rounded-sm",
                pathname === item.href && "opacity-60"
              )}
            >
              <MixBlendHover className="mono-label px-2 py-1">
                <CharHoverLink text={item.label} />
              </MixBlendHover>
            </Link>
          ))}
          <Link
            href="/contact"
            className="group relative ml-2 overflow-hidden rounded-full border border-paper/40 transition-colors hover:border-paper"
          >
            <MixBlendHover className="mono-label px-4 py-2">
              <CharHoverLink text="Start a project" />
            </MixBlendHover>
          </Link>

          {/* §4.7.3 — global dark/light appearance toggle, nav secondary group. */}
          <AppearanceToggle className="ml-2" />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="mono-label mix-blend-difference text-paper sm:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-ink px-8 sm:hidden"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group relative w-fit overflow-hidden rounded-sm"
              >
                <MixBlendHover className="display-type px-2 py-1 text-4xl">{item.label}</MixBlendHover>
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="group relative mt-4 w-fit overflow-hidden rounded-full border border-paper/40"
            >
              <MixBlendHover className="mono-label px-5 py-3">Start a project</MixBlendHover>
            </Link>
            <AppearanceToggle className="mt-2 w-fit" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
