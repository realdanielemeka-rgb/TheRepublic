import Link from "next/link";
import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ServiceSwap, { type ServiceSwapItem } from "@/components/ServiceSwap";
import { SERVICE_IMAGE_CATEGORY } from "@/lib/serviceCategories";
import { services, aiNativeCallout } from "../../../content/services";
import { getLiveCaseBySlug } from "../../../content/work";

export const metadata: Metadata = {
  title: "Services",
  description: "Six service lines, one integrated agency.",
};

export default function ServicesPage() {
  const serviceItems: ServiceSwapItem[] = services.map((service) => ({
    index: service.index,
    title: service.title,
    oneLiner: service.oneLiner,
    tags: service.tags,
    image: {
      category: SERVICE_IMAGE_CATEGORY[service.index] ?? "generic",
      label: `${service.title} — representative placeholder`,
      seed: `services-${service.index}`,
    },
  }));

  // Case link stays hidden unless caseSlug is set AND actually resolves to
  // a live case — belt-and-braces even though content/services.ts's
  // caseSlug is null today: never trust a stored slug alone to gate a
  // public link to case content.
  const linkedCase = aiNativeCallout.caseSlug ? getLiveCaseBySlug(aiNativeCallout.caseSlug) : undefined;

  return (
    <>
      <ThemeSection theme="ink" className="px-6 pt-32 pb-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="display-type text-[clamp(3rem,7vw,7rem)]">WHAT WE DO</h1>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-16">
              <ServiceSwap services={serviceItems} />
            </div>
          </Reveal>
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
          {linkedCase && (
            <Reveal delay={0.15}>
              <Link href={`/work/${linkedCase.slug}`} className="mono-label mt-8 inline-block hover:opacity-80">
                See the case →
              </Link>
            </Reveal>
          )}
        </div>
      </ThemeSection>
    </>
  );
}
