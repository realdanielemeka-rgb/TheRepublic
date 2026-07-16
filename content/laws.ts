export type Law = {
  index: string;
  title: string;
  body: string;
  status: "live" | "pending";
};

// The Reaction Standard — The Republic's proprietary operating system for
// brand growth. Two laws are seeded and confirmed; four are slotted pending
// the canonical six from the master doc. TODO: pull canonical six.
export const laws: Law[] = [
  {
    index: "01",
    title: "Provoke, don't observe.",
    body: "Brand social must start the argument, not summarise it.",
    status: "live",
  },
  {
    index: "02",
    title: "Participation is the format.",
    body: "Engineered into the work itself — never appended as a CTA.",
    status: "live",
  },
  { index: "03", title: "Law pending.", body: "", status: "pending" },
  { index: "04", title: "Law pending.", body: "", status: "pending" },
  { index: "05", title: "Law pending.", body: "", status: "pending" },
  { index: "06", title: "Law pending.", body: "", status: "pending" },
];
