import type { CaseStudy } from "./types";

// TODO: verify with Daniel
export const cowbellMumtales: CaseStudy = {
  slug: "cowbell-mumtales",
  client: "Cowbell",
  title: "Mumtales",
  services: ["Content & Social", "Communication Strategy"],
  sector: "FMCG & Beverage",
  market: "Nigeria",
  year: 2024,
  brief:
    "Cowbell wanted to speak to the mothers who buy the brand daily, not just the children who drink it — without losing its playful, family-first tone.",
  idea:
    "Mumtales handed the platform to mothers themselves — a recurring content series built from real parenting stories, positioning Cowbell as part of the household conversation rather than an interruption to it.",
  results: [],
  media: [
    {
      kind: "hero",
      type: "video",
      src: "placeholder:family",
      poster: "placeholder:family",
      alt: "Cowbell hero film — a mother telling her Mumtales story to open the campaign",
    },
    {
      kind: "wide",
      type: "video",
      src: "placeholder:family",
      poster: "placeholder:family",
      alt: "Cowbell — Mumtales content wall, contributor stories from the recurring series (grid loop)",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales contributor portrait, series storyteller one",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales contributor portrait, series storyteller two",
      reverse: true,
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales carousel slide, campaign key visual 1 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales carousel slide, campaign key visual 2 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales carousel slide, campaign key visual 3 of 3",
    },
    {
      kind: "ticker-chip",
      type: "image",
      src: "placeholder:family",
      alt: "Cowbell — Mumtales ticker chip, series episode marker",
    },
  ],
  featured: false,
  status: "pending-approval",
};
