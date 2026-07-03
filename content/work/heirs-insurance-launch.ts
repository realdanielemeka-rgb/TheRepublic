import type { CaseStudy } from "./types";

// TODO: verify with Daniel
export const heirsInsuranceLaunch: CaseStudy = {
  slug: "heirs-insurance-launch",
  client: "Heirs Insurance",
  title: "Launch",
  services: ["Brand & Creative", "Integrated Marketing", "Experiences"],
  sector: "Insurance",
  market: "Nigeria",
  year: 2023,
  brief:
    "Heirs Insurance was entering a crowded, low-trust category and needed a market entrance that earned attention on day one.",
  idea:
    "The launch campaign introduced Heirs Insurance as a challenger built for a new generation of policyholders — an integrated push across brand, digital and live experience designed to make the category's newest name its most talked-about.",
  results: [],
  media: [
    {
      kind: "hero",
      type: "video",
      src: "placeholder:launch",
      poster: "placeholder:launch",
      alt: "Heirs Insurance hero film — market-entrance launch film, brand reveal moment",
    },
    {
      kind: "wide",
      type: "video",
      src: "placeholder:launch",
      poster: "placeholder:launch",
      alt: "Heirs Insurance — Launch activation still, wide shot of the live launch experience (grid loop)",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch digital still, challenger-brand creative execution",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch experiential still, live activation moment",
      reverse: true,
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch carousel slide, campaign key visual 1 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch carousel slide, campaign key visual 2 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch carousel slide, campaign key visual 3 of 3",
    },
    {
      kind: "ticker-chip",
      type: "image",
      src: "placeholder:launch",
      alt: "Heirs Insurance — Launch ticker chip, brand mark reveal",
    },
  ],
  featured: false,
  status: "pending-approval",
};
