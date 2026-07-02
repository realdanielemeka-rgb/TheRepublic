export type TeamMember = {
  name: string;
  role: string;
  focus: string;
  bio?: string; // leadership only, ≤120 words
  image?: string;
};

// Photos: real photography only — B/W, grain, consistent crop. Until the
// shoot happens, the <Avatar> component renders an initial-monogram
// placeholder on Republic Blue. AI-generated portraits are forbidden.
export const leadershipTeam: TeamMember[] = [
  {
    name: "Ola Olowu",
    role: "Chairman & Co-Founder",
    focus: "Brand strategy and cultural insight, three decades in.",
    bio: "Ola has spent a career building brands that outlast campaigns — from Guinness Africa Special to the launch of Budweiser in Nigeria. He co-founded The Republic to formalise a belief he'd tested for years: African markets don't need diluted global playbooks, they need work built at global standard from a local starting point. He chairs the agency's strategic direction and sits close to every account where the brief is bigger than the brand.",
  },
  {
    name: "Daniel Emeka",
    role: "Managing Director & Co-Founder",
    focus: "Operations, delivery and the platforms the agency builds on.",
    bio: "Daniel runs the engine room — the systems, the delivery discipline, and the digital product thinking that lets The Republic ship React and Supabase platforms for clients the way most agencies ship decks. He co-founded The Republic to close the gap between what agencies promise and what they can actually build, and he still reviews the code before it ships.",
  },
];

// TODO: confirm final wider-team roster and headshots with Daniel before deploy.
export const team: TeamMember[] = [
  { name: "Ada Nwosu", role: "Creative Director", focus: "Campaign concepting and art direction." },
  { name: "Femi Balogun", role: "Head of Strategy", focus: "Positioning and brand architecture." },
  { name: "Chioma Eze", role: "Head of Content & Social", focus: "Always-on systems and community." },
  { name: "Tomiwa Adisa", role: "Head of Digital & Performance", focus: "Full-funnel media and analytics." },
  { name: "Ibrahim Suleiman", role: "Senior Producer", focus: "Live experiences and production." },
  { name: "Zainab Yusuf", role: "Account Director", focus: "Client partnership and delivery." },
];
