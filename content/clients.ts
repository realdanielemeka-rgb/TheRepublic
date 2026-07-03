export type Client = {
  name: string;
  tier: "current" | "heritage";
};

// TODO: confirm display rights per logo before deploy. Roster mirrors the
// current brochure/site roster where known publicly.
export const clients: Client[] = [
  { name: "Chivita", tier: "current" },
  { name: "PZ Cussons", tier: "current" },
  { name: "Zenith Bank", tier: "current" },
  { name: "Twisco", tier: "current" },
  { name: "Cowbell", tier: "current" },
  { name: "I-Invest", tier: "current" },
  { name: "Sanlam Allianz", tier: "current" },
  { name: "Heirs Insurance", tier: "current" },
  { name: "Budweiser", tier: "heritage" },
  { name: "Guinness", tier: "heritage" },
  { name: "NamPost", tier: "heritage" },
];

export type HeritageCard = {
  client: string;
  project: string;
};

export const heritageWork: HeritageCard[] = [
  { client: "Budweiser", project: "Be a King" },
  { client: "Guinness", project: "Africa Special" },
  { client: "NamPost", project: "360 rebrand" },
];
