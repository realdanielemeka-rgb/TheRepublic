import ServiceSwap, { type ServiceSwapItem } from "@/components/ServiceSwap";
import { services } from "../../../../content/services";
import { SERVICE_IMAGE_CATEGORY } from "@/lib/serviceCategories";

export const metadata = { title: "Dev — ServiceSwap QA" };

/**
 * Visual/interaction QA harness for <ServiceSwap> (§4.6.4). Uses the real,
 * public content/services.ts data (services aren't client-case content, so
 * no sanctioning/live-status concern applies here, unlike case media) and
 * the same real category mapping + tags now live on Home/Services (see
 * src/lib/serviceCategories.ts) — this route is no longer the only place
 * ServiceSwap renders real content, but stays as an isolated, page-
 * layout-independent regression check. Toggle prefers-reduced-motion to
 * compare the sticky/cross-fade layout against the chosen stacked-inline
 * fallback.
 */
export default function DevServiceSwapPage() {
  const items: ServiceSwapItem[] = services.map((service) => ({
    index: service.index,
    title: service.title,
    oneLiner: service.oneLiner,
    tags: service.tags,
    image: {
      category: SERVICE_IMAGE_CATEGORY[service.index] ?? "generic",
      label: `${service.title} — representative placeholder`,
      seed: `service-swap-${service.index}`,
    },
  }));

  return (
    <div className="flex flex-col gap-8 pb-24">
      <header>
        <h1 className="display-type text-4xl">SERVICESWAP QA</h1>
        <p className="measure mt-4 text-smoke">
          Hover (desktop) or tap (mobile/keyboard focus) a service name — the sticky frame should cross-fade to
          its media over 150-200ms and the other five names should dim to ~40% opacity.
        </p>
      </header>

      <ServiceSwap services={items} />
    </div>
  );
}
