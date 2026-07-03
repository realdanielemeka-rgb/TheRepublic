import Link from "next/link";
import { CaseMedia } from "./ScenePlaceholder";
import Bracket from "./Bracket";
import { resultLine, type CaseStudy } from "../../content/work";

/** Card preview always uses the case's first media entry — every seed case
 * orders `media[]` hero-first (a video + poster, per the §7 schema), so
 * `media[0]` is consistently the "muted looping preview" slot once real
 * video lands; <CaseMedia> already renders its "Video pending" badge for
 * that entry in the meantime. */
export default function CaseCard({ item }: { item: CaseStudy }) {
  const preview = item.media[0];

  return (
    <Link
      href={`/work/${item.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-card)]"
    >
      {preview ? (
        <CaseMedia media={preview} seedPrefix={item.slug} aspect="aspect-[4/3]" />
      ) : (
        <div className="aspect-[4/3] rounded-[var(--radius-card)] bg-ink" />
      )}
      <div className="mt-4">
        <p className="mono-label text-smoke">{item.client}</p>
        <p className="display-type mt-1 text-2xl sm:text-3xl">{item.title}</p>
        <p className="mono-label mt-2 text-smoke">{item.services.join(" · ")}</p>
        <Bracket className="mono-label mt-3 text-republic-press">
          <span className="bracket-fill">{resultLine(item)}</span>
        </Bracket>
      </div>
    </Link>
  );
}
