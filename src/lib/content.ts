export const business = {
  name: "The Republic Studios",
  shortName: "The Republic",
  tagline: "A global agency based in Lagos, building brand visibility and growth for ambitious clients.",
  category: "Design / Marketing Agency",
  email: "office@therepublic.agency",
  address: "10 Onisiwo Road, Lagos, Nigeria",
  city: "Lagos",
  country: "Nigeria",
};

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export const legalNav = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Conditions", href: "/legal/terms-conditions" },
  { label: "Refund Policy", href: "/legal/refund-policy" },
  { label: "Accessibility Statement", href: "/legal/accessibility-statement" },
];

export const services = [
  {
    index: "01",
    title: "Influencer Marketing",
    description:
      "Creator partnerships that put your brand in front of real audiences, built around campaigns people actually want to share.",
    tags: ["Creator Partnerships", "Campaign Strategy"],
  },
  {
    index: "02",
    title: "User-Generated Content",
    description:
      "Content strategies that turn customers and communities into your most credible storytellers.",
    tags: ["UGC", "Community"],
  },
  {
    index: "03",
    title: "Multi-Platform Content Distribution",
    description:
      "Content built once and distributed with intent — tuned for every platform your audience actually spends time on.",
    tags: ["Social", "Content Ops"],
  },
  {
    index: "04",
    title: "Performance Marketing",
    description:
      "Paid and organic efforts measured against real outcomes, not vanity metrics — built to move the numbers that matter.",
    tags: ["Paid Media", "Optimization"],
  },
  {
    index: "05",
    title: "Brand Building & Campaign Execution",
    description:
      "End-to-end campaign execution — from strategy and positioning through to delivery — for brands that need a partner who owns the outcome.",
    tags: ["Brand Strategy", "Campaign Execution"],
  },
];

export const work = [
  {
    slug: "chivita",
    client: "Chivita",
    campaignType: "Influencer-led campaign",
    strategies: [
      "Influencer Marketing",
      "User-Generated Content",
      "Multi-Platform Content Distribution",
    ],
    summary:
      "An influencer-led campaign for Chivita, using creator partnerships and user-generated content distributed across multiple platforms to build reach and engagement.",
    color: "#ff4d2e",
  },
  {
    slug: "i-invest",
    client: "I-invest",
    campaignType: "Brand visibility campaign",
    strategies: [
      "Brand Building & Campaign Execution",
      "Performance Marketing",
      "Multi-Platform Content Distribution",
    ],
    summary:
      "A brand visibility campaign for I-invest, combining campaign execution and performance marketing to grow awareness across platforms.",
    color: "#2ee6a6",
  },
  {
    slug: "heirs-insurance",
    client: "Heirs Insurance",
    campaignType: "Brand visibility campaign",
    strategies: [
      "Brand Building & Campaign Execution",
      "Multi-Platform Content Distribution",
      "Performance Marketing",
    ],
    summary:
      "A brand visibility campaign for Heirs Insurance, executed across multiple platforms to build recognition and trust with a wider audience.",
    color: "#7c8cff",
  },
  {
    slug: "prudential-zenith-life-insurance",
    client: "Prudential Zenith Life Insurance",
    campaignType: "Content management",
    strategies: ["Multi-Platform Content Distribution", "Brand Building & Campaign Execution"],
    summary:
      "Ongoing content management for Prudential Zenith Life Insurance, keeping the brand's presence active and consistent across platforms.",
    color: "#ffd23f",
  },
];

export const studio = {
  eyebrow: "The Studio",
  headline: "A global agency based in Lagos.",
  description:
    "The Republic is a global agency based in Lagos that showcases its work in brand building, campaign execution, and driving growth for clients across diverse industries. We work as a creative and strategic partner capable of delivering impactful results — not just a vendor.",
};

export const focusAreas = [
  { label: "Location", value: `${business.city}, ${business.country}` },
  { label: "Category", value: business.category },
  { label: "Approach", value: "Brand building & campaign execution" },
  { label: "Reach", value: "Clients across diverse industries" },
];

export const process = [
  {
    step: "Discover",
    detail:
      "We start with your market, your audience and your ambition — not a template. Research before a single asset is made.",
  },
  {
    step: "Define",
    detail:
      "Strategy becomes a clear brief: positioning, tone, and the outcomes both sides are rallying behind.",
  },
  {
    step: "Execute",
    detail:
      "Campaigns, content and creator partnerships developed and shipped in tight, fast loops with you.",
  },
  {
    step: "Distribute",
    detail:
      "Content and campaigns distributed across the platforms your audience actually spends time on, measured against real outcomes.",
  },
];
