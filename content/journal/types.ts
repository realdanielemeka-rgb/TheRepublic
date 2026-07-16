// v3 §7 — Journal content type. Phase B (this phase) owns the content
// layer only; Phase C builds the actual /journal index + entry pages and
// decides the exact markdown-rendering approach. See DECISIONS.md's v3
// Phase B section for why `body` is stored as plain markdown text rather
// than pre-rendered HTML or an MDX file.
export type JournalEntry = {
  slug: string;
  title: string;
  date: string; // ISO, e.g. "2026-07-03"
  type: "perspective" | "press" | "recognition";
  body: string; // markdown — see DECISIONS.md for the storage-format choice
  linkedCase?: string; // content/work case slug, optional
};
