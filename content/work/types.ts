export type MediaKind = "hero" | "wide" | "gallery-pair" | "carousel" | "ticker-chip";

export type Media = {
  kind: MediaKind;
  type: "image" | "video";
  // Real asset path once delivered. Until then this is a placeholder
  // identifier in the form "placeholder:<category>" that <ScenePlaceholder>
  // / <CaseMedia> (src/components/ScenePlaceholder.tsx) knows how to turn
  // into a procedural scene — see categoryFromSrc in src/lib/scene/generator.ts.
  // Swapping in a real file later is a content-only change: no component
  // code needs to move.
  src: string;
  poster?: string; // required if type === "video" — enforced by assertValidMedia() in ./index.ts
  alt: string;
  reverse?: boolean; // for gallery-pair alternation
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  services: string[];
  // v3 §6.2 — industry sector and market/geography, used by the /work
  // index's service × sector × market filter. These are structural
  // classification metadata (inferred from the real client), never a
  // claim about results — safe to populate ahead of case sign-off, unlike
  // brief/idea/results copy. See DECISIONS.md's v3 Phase C section for the
  // taxonomy.
  sector: string;
  market: string;
  year: number;
  brief: string;
  idea: string;
  results: { value: string; label: string }[]; // empty allowed
  quote?: { text: string; name: string; role: string }; // never fabricated — omit if unconfirmed
  media: Media[];
  featured: boolean;
  status: "live" | "pending-approval"; // pending never renders publicly
};
