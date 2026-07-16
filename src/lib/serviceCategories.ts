import type { SceneCategory } from "./scene/generator";

/**
 * Representative placeholder-media category per service line, keyed by
 * content/services.ts's `index` field ("01".."06"). content/services.ts
 * itself stays content-only (no src/lib import — matching every other
 * content/*.ts file's "data stays data-only" convention documented in
 * DECISIONS.md for content/work/*.ts), so this mapping lives here instead
 * and is shared by every <ServiceSwap> call site (Home, /services, and the
 * /dev/service-swap QA harness) so the pairing can't drift between them.
 * Purely a motif choice, not a claim about the service's content — any of
 * the ten SceneCategory motifs would render validly for any service.
 */
export const SERVICE_IMAGE_CATEGORY: Record<string, SceneCategory> = {
  "01": "civic-journey", // Communication Strategy — planning a path
  "02": "launch", // Brand & Creative — creative energy/reveal
  "03": "culture", // Content & Social — crowd/community
  "04": "finance-growth", // Integrated Marketing — ascending, joined-up momentum
  "05": "insurance", // Digital & Performance — radiating, full-funnel fan
  "06": "beverage", // Experiences — physical, market-stall tactility
};
