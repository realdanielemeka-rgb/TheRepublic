import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getLiveCaseBySlug, getLiveCases } from "../../../../content/work";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Republic — case study";

export function generateStaticParams() {
  return getLiveCases().map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLiveCaseBySlug(slug);
  // Defensive fallback (should be unreachable in production — every real
  // path comes from generateStaticParams above, which only ever yields
  // live slugs) rather than throwing if a stale/unknown slug reaches here.
  if (!item) return renderOgImage("THE REPUBLIC", "THE PROOF");
  return renderOgImage(item.client.toUpperCase(), item.title);
}
