import type { JournalEntry } from "./types";

export type { JournalEntry } from "./types";

// Intentionally empty at launch (v3 §6.5's "zero entries" empty state is a
// real, honest state — not a placeholder waiting to be filled with
// invented copy). The Republic has no press mentions, award wins, or
// published perspectives to date; inventing any of the three `type`
// values here would violate the site's zero-fabricated-proof rule (no
// invented metrics/quotes/client claims — the same rule that keeps
// content/work's `quote` field empty on every case). Add real entries here
// the moment they exist; nothing else about this module's shape needs to
// change when that happens. See DECISIONS.md's v3 Phase B section.
export const journalEntries: JournalEntry[] = [];

/** Live entries, optionally filtered by `type`, newest first. Phase C's
 * /journal pages should read through this accessor rather than importing
 * `journalEntries` directly, so a future non-empty array or an added
 * publish-gate (mirroring content/work's `status` field) doesn't require
 * every call site to change. */
export function getJournalEntries(type?: JournalEntry["type"]): JournalEntry[] {
  const entries = type ? journalEntries.filter((e) => e.type === type) : journalEntries;
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
}
