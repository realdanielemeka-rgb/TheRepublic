// v3 (§2 LOCKED): current agency roster only — no heritage tier, anywhere.
// The v2 `tier`/`heritageWork`/`HeritageCard` concepts are removed
// outright, not just unused — see DECISIONS.md's v3 Phase B section.
export type Client = {
  name: string;
};

// TODO: confirm display rights per logo before deploy. Roster mirrors the
// current brochure/site roster where known publicly.
export const clients: Client[] = [
  { name: "Chivita" },
  { name: "PZ Cussons" },
  { name: "Zenith Bank" },
  { name: "Twisco" },
  { name: "Cowbell" },
  { name: "I-Invest" },
  { name: "Sanlam Allianz" },
  { name: "Heirs Insurance" },
];
