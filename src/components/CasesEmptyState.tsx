import clsx from "clsx";
import Bracket from "./Bracket";

/**
 * Shared bracket-framed "no live cases yet" state — every seed case ships
 * `status: 'pending-approval'` (see DECISIONS.md), so both Home's work-strip
 * section and /work's grid render this today. Extracted into one component
 * (rather than copy-pasted at each call site) so the copy can't drift
 * between the two places it's needed — same reasoning Phase B gave for
 * extracting `resultLine()` into content/work/index.ts.
 *
 * On-brand, no fabricated content: doesn't claim a number of cases, doesn't
 * imply a timeline beyond "soon".
 */
export default function CasesEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-card)] border border-paper/20 px-8 py-16 text-center",
        className
      )}
    >
      <p className="display-type text-2xl">
        <Bracket>CASES IN REVIEW</Bracket>
      </p>
      <p className="measure mx-auto mt-4 text-paper/70">
        Every case on this site clears client approval before it goes public.
        Nothing invented, nothing early — check back soon.
      </p>
    </div>
  );
}
