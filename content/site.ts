// Central site configuration. Edit this file to update global facts —
// no component should ever need touching for a content change.

export const site = {
  name: "The Republic",
  legalName: "The Republic",
  tagline: "Most marketing makes viewers. The Republic makes citizens.",
  description:
    "The Republic is a creative and digital agency headquartered in Ikoyi, Lagos, delivering deep African cultural insight at global standard — strategy, creative, content and platforms for brands that want citizens, not spectators.",
  url: "https://therepublic.agency",
} as const;

export const contact = {
  email: "office@therepublic.agency",
  phone: "+234 700 700 5252",
  phoneHref: "+2347007005252",
  address: {
    line1: "10 Onisiwo Road",
    area: "Ikoyi",
    city: "Lagos",
    country: "Nigeria",
    full: "10 Onisiwo Road, Ikoyi, Lagos, Nigeria",
  },
} as const;

// Social URLs. NO placeholder links may ship — any entry left empty is
// hidden in the UI rather than rendered as a dead or fake link.
// TODO: confirm real handles before deploy.
export const socials: { label: string; href: string }[] = [
  // { label: "Instagram", href: "https://instagram.com/therepublicagency" },
  // { label: "LinkedIn", href: "https://linkedin.com/company/therepublicagency" },
  // { label: "X", href: "https://x.com/therepublicHQ" },
];

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

export const flags = {
  // TODO: flip only when the Kigali office is publicly confirmable.
  showKigali: false,
} as const;

// v3 §4.7.3 — documents the appearance toggle's LOCKED default so the
// choice lives in content, not buried in src/lib/appearance.ts alone.
// src/lib/appearance.ts's own APPEARANCE_BOOT_SCRIPT is the actual
// mechanism (it can't import this module — it runs as a pre-hydration
// blocking <script> string, same constraint as the grid engine's boot
// script, see DECISIONS.md's v3 Phase A section) and must be kept in sync
// with this value by hand if it's ever changed.
export const defaultAppearance: "dark" | "light" = "dark";

export const footprint = {
  hq: {
    label: "LAGOS — HQ",
    address: contact.address.full,
  },
  markets: ["Nigeria", "South Africa", "Namibia", "Canada"],
  // TODO: publicly confirm before flipping flags.showKigali
  kigali: {
    label: "KIGALI",
    note: "Rwanda footprint — announcement pending.",
  },
} as const;

export const leadership = {
  chairman: {
    name: "Ola Olowu",
    title: "Chairman & Co-Founder",
  },
  md: {
    name: "Daniel Emeka",
    title: "Managing Director & Co-Founder",
  },
} as const;
