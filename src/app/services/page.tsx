import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { services, aiNativeCallout } from "../../../content/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Six service lines, one integrated agency.",
};

export default function ServicesPage() {
  return (
    <>
      <ThemeSection theme="ink" className="px-6 pt-32 pb-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="display-type text-[clamp(3rem,7vw,7rem)]">WHAT WE DO.</h1>
          </Reveal>

          <div className="mt-16 divide-y divide-paper/15 border-y border-paper/15">
            {services.map((service) => (
              <Reveal key={service.index}>
                <div className="grid gap-4 py-10 sm:grid-cols-[auto_1fr]">
                  <span className="mono-label text-smoke">{service.index}</span>
                  <div>
                    <p className="display-type text-3xl sm:text-4xl">{service.title}</p>
                    <p className="measure mt-3 text-lg text-paper/80">{service.oneLiner}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {service.tags.map((tag) => (
                        <span key={tag} className="mono-label rounded-full border border-paper/30 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </ThemeSection>

      <ThemeSection theme="republic" className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>{aiNativeCallout.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h3 className="display-type mt-4 text-[clamp(2rem,5vw,3.5rem)]">
              {aiNativeCallout.title}
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="measure mt-6 text-lg opacity-90">{aiNativeCallout.body}</p>
          </Reveal>
        </div>
      </ThemeSection>
    </>
  );
}
