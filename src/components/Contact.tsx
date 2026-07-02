"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { business } from "@/lib/content";
import Reveal from "./Reveal";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="mb-6 block text-sm uppercase tracking-[0.25em] text-muted">
              Contact
            </span>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Have a project in mind? Let&apos;s talk.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 space-y-6 text-foreground/70">
              <a
                href={`mailto:${business.email}`}
                className="group flex items-center gap-2 text-lg text-foreground hover:text-accent"
              >
                {business.email}
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <p>{business.address}</p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.2}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-line text-center"
              >
                <p className="font-display text-2xl">Thank you.</p>
                <p className="mt-2 text-foreground/60">
                  We&apos;ll be in touch within one business day.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Field label="Name" name="name" placeholder="Jane Doe" />
                  <Field label="Email" name="email" type="email" placeholder="jane@company.com" />
                </div>
                <Field label="Company" name="company" placeholder="Company name" />
                <Field label="Project details" name="message" textarea placeholder="Tell us about your project..." />

                <button
                  type="submit"
                  className="group flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-white"
                >
                  Send message
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const shared =
    "w-full border-0 border-b border-line bg-transparent pb-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors";
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-muted">{label}</span>
      {textarea ? (
        <textarea name={name} rows={3} placeholder={placeholder} required className={shared} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} required className={shared} />
      )}
    </label>
  );
}
