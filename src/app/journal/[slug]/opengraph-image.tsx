import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getJournalEntries } from "../../../../content/journal";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Republic — Journal entry";

export function generateStaticParams() {
  return getJournalEntries().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getJournalEntries().find((e) => e.slug === slug);
  if (!entry) return renderOgImage("THE REPUBLIC", "PERSPECTIVES");
  return renderOgImage("THE REPUBLIC", entry.title);
}
