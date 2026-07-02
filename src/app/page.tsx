import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectStrip from "@/components/ProjectStrip";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { services, business } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProjectStrip />
        <Marquee />

        <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
          <Reveal>
            <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <h2 className="font-display max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                What we do
              </h2>
              <Link
                href="/services"
                className="group flex items-center gap-2 text-sm uppercase tracking-widest text-foreground/90"
              >
                All services
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service, i) => (
              <Reveal key={service.index} delay={i * 0.08}>
                <div className="border-t border-line pt-6">
                  <span className="font-display text-sm text-muted">{service.index}</span>
                  <h3 className="font-display mt-3 text-2xl font-medium">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-[#0d0d0c] py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-6 text-center sm:px-10">
            <Reveal>
              <h2 className="font-display mx-auto max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-foreground/60">
                Let&apos;s talk about brand building, campaign execution, and driving growth for
                your business.
              </p>
              <Link
                href="/contact"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-white"
              >
                Start a project
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <p className="mt-6 text-sm text-muted">
                {business.email} · {business.address}
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
