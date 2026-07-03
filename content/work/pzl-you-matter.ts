import type { CaseStudy } from "./types";

// TODO: verify with Daniel
export const pzlYouMatter: CaseStudy = {
  slug: "pzl-you-matter",
  client: "PZ Cussons",
  title: "You Matter",
  services: ["Communication Strategy", "Content & Social"],
  year: 2025,
  brief:
    "PZ Cussons wanted a wellbeing message that felt earned, not bolted on — proof of care that didn't read as a press release.",
  idea:
    "You Matter turned a corporate wellbeing commitment into a public conversation, inviting real stories from real people rather than casting a campaign around a single spokesperson. The brand's role was to hold the mic, not hog it.",
  results: [],
  media: [
    {
      kind: "hero",
      type: "video",
      src: "placeholder:wellbeing",
      poster: "placeholder:wellbeing",
      alt: "PZ Cussons hero film — real-person wellbeing story opening the You Matter campaign",
    },
    {
      kind: "wide",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter community wall, contributor stories laid out edge to edge",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter contributor portrait, story participant one",
    },
    {
      kind: "gallery-pair",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter contributor portrait, story participant two",
      reverse: true,
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter carousel slide, campaign key visual 1 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter carousel slide, campaign key visual 2 of 3",
    },
    {
      kind: "carousel",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter carousel slide, campaign key visual 3 of 3",
    },
    {
      kind: "ticker-chip",
      type: "image",
      src: "placeholder:wellbeing",
      alt: "PZ Cussons — You Matter ticker chip, campaign wordmark moment",
    },
  ],
  featured: true,
  status: "pending-approval",
};
