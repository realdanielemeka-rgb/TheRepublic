import Link from "next/link";
import Placeholder from "./Placeholder";
import Bracket from "./Bracket";
import type { CaseStudy } from "../../content/work";

export default function CaseCard({ item }: { item: CaseStudy }) {
  const resultLine =
    item.results[0]?.value && item.results[0]?.label
      ? `${item.results[0].value} ${item.results[0].label}`
      : "Results under NDA — ask us";

  return (
    <Link
      href={`/work/${item.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-card)]"
    >
      <Placeholder label={`${item.client} — image pending`} tone="ink" ratio="aspect-[4/3]" />
      <div className="mt-4">
        <p className="mono-label text-smoke">{item.client}</p>
        <p className="display-type mt-1 text-2xl sm:text-3xl">{item.title}</p>
        <p className="mono-label mt-2 text-smoke">{item.services.join(" · ")}</p>
        <Bracket className="mono-label mt-3 text-republic-press">
          <span className="bracket-fill">{resultLine}</span>
        </Bracket>
      </div>
    </Link>
  );
}
