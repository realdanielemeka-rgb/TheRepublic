import ServiceSwap, { type ServiceSwapItem } from "@/components/ServiceSwap";
import { services } from "../../../../content/services";
import type { SceneCategory } from "@/lib/scene/generator";

export const metadata = { title: "Dev — ServiceSwap QA" };

// Illustrative category per service for this QA harness only — Phase C
// picks the real per-service representative media when this is wired onto
// Home/Services.
const CATEGORY_BY_INDEX: Record<string, SceneCategory> = {
  "01": "civic-journey",
  "02": "launch",
  "03": "culture",
  "04": "finance-growth",
  "05": "insurance",
  "06": "beverage",
};

/**
 * Visual/interaction QA harness for <ServiceSwap> (§4.6.4). Uses the real,
 * public content/services.ts data (services aren't client-case content, so
 * no sanctioning/live-status concern applies here, unlike case media).
 * Toggle prefers-reduced-motion to compare the sticky/cross-fade layout
 * against the chosen stacked-inline fallback.
 */
export default function DevServiceSwapPage() {
  const items: ServiceSwapItem[] = services.map((service) => ({
    index: service.index,
    title: service.title,
    oneLiner: service.oneLiner,
    image: {
      category: CATEGORY_BY_INDEX[service.index] ?? "generic",
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
