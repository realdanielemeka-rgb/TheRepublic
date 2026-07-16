/**
 * §6.5 — Journal entry body renderer. `JournalEntry.body` is stored as
 * plain markdown text (see content/journal/types.ts). Judgement call,
 * documented in DECISIONS.md's v3 Phase C section: a small hand-rolled
 * paragraph/heading/list splitter rather than pulling in `react-markdown`
 * — the body copy this site will ever store is plain prose (paragraphs,
 * the occasional `## ` subheading, the occasional `- ` list), not
 * arbitrary user-authored markdown needing tables/code-fences/embedded
 * HTML, so a full markdown parser is more dependency than the actual
 * content shape justifies. Zero new deps, server-component safe (no
 * client JS at all for a page that's pure text).
 */
export default function JournalBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <div className="measure mt-10 flex flex-col gap-6 text-lg text-paper/85">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={i} className="display-type mt-4 text-2xl text-paper">
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={i} className="display-type mt-4 text-3xl text-paper">
              {trimmed.slice(2)}
            </h2>
          );
        }
        const lines = trimmed.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="ml-5 flex list-disc flex-col gap-2">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}
