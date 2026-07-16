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
  // No literal brackets here — every other eyebrow string in this codebase
  // is stored plain and gets its brackets from <Eyebrow>/<Bracket> at
  // render time; this one previously had brackets baked into the string
  // AND rendered through <Eyebrow>, producing a visible "[ [ ... ] ]"
  // double-bracket. Fixed as part of the Phase C audit — see DECISIONS.md.
  eyebrow: "AI-NATIVE PRODUCTION",
  title: "Branded Entertainment at Series Scale",
  body: "We ship AI-native formats — episodic branded drama, generative content systems — for blue-chip brands, at broadcast pace.",
  // Case link stays hidden until client approval flips a case to status: 'live'.
  caseSlug: null as string | null,
};
