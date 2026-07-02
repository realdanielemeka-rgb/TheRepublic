export type Service = {
  index: string;
  title: string;
  oneLiner: string;
  tags: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Communication Strategy",
    oneLiner: "Positioning, planning and the argument that wins the room.",
    tags: ["Positioning", "Brand Strategy", "Planning"],
  },
  {
    index: "02",
    title: "Brand & Creative",
    oneLiner: "Identity, campaigns and craft that carries a flag.",
    tags: ["Identity", "Campaigns", "Art Direction"],
  },
  {
    index: "03",
    title: "Content & Social",
    oneLiner: "Always-on systems engineered for reaction, not reach alone.",
    tags: ["Social", "Content Systems", "Community"],
  },
  {
    index: "04",
    title: "Integrated Marketing",
    oneLiner: "One idea, every channel, zero seams.",
    tags: ["Campaign Integration", "Channel Planning"],
  },
  {
    index: "05",
    title: "Digital & Performance",
    oneLiner: "Full-funnel media that pays its own way.",
    tags: ["Paid Media", "Performance", "Analytics"],
  },
  {
    index: "06",
    title: "Experiences",
    oneLiner: "Live moments people attend, then repeat.",
    tags: ["Events", "Activations", "Production"],
  },
];

export const aiNativeCallout = {
  eyebrow: "[ AI-NATIVE PRODUCTION ]",
  title: "Branded Entertainment at Series Scale",
  body: "We ship AI-native formats — episodic branded drama, generative content systems — for blue-chip brands, at broadcast pace.",
  // Case link stays hidden until client approval flips a case to status: 'live'.
  caseSlug: null as string | null,
};
