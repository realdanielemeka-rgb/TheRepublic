import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeSection from "@/components/ThemeSection";
import { archivePath, archivedImageUrl, archivedPage, archivedPages } from "@/lib/wixArchive";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return archivedPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = archivedPage((await params).slug);
  return {
    title: page ? `${page.title} · Wix archive` : "Wix archive",
    description: page?.meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function ArchivedPage({ params }: Props) {
  const page = archivedPage((await params).slug);
  if (!page) notFound();

  const related = Array.from(new Map(page.links
    .map((link) => ({ ...link, target: archivedPages.find((other) => other.sourceUrl === link.href) }))
    .filter((link) => link.target && link.target.slug !== page.slug)
    .map((link) => [link.href, link])).values());

  return (
    <ThemeSection theme="paper" className="min-h-dvh px-6 pb-24 pt-32 sm:px-10">
      <main className="mx-auto max-w-[1200px]">
        <Link href="/archive" className="mono-label text-republic hover:underline">← ALL ARCHIVED PAGES</Link>
        <p className="mono-label mt-12 text-republic">PRESERVED FROM {page.path}</p>
        <h1 className="display-type mt-4 max-w-5xl text-[clamp(2.5rem,6vw,5rem)]">{page.title}</h1>
        {page.meta.description && <p className="measure mt-6 max-w-3xl text-lg">{page.meta.description}</p>}

        <section className="mt-16 border-t border-current/20 pt-8" aria-labelledby="original-copy">
          <h2 id="original-copy" className="mono-label text-republic">ORIGINAL PAGE COPY</h2>
          <div className="measure mt-6 max-w-3xl whitespace-pre-line text-lg leading-relaxed">
            {page.bodyText}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="original-images">
          <h2 id="original-images" className="mono-label text-republic">ORIGINAL PAGE IMAGES · {page.images.length}</h2>
          <div className="mt-6 grid items-start gap-5 sm:grid-cols-2">
            {page.images.map((image) => {
              const url = archivedImageUrl(image.file);
              return url ? (
                <figure key={image.file} className="border border-current/20 p-2">
                  {/* Public archive assets are already optimized and served by Supabase. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={image.alt || "Archived Republic image"} loading="lazy" className="h-auto w-full" />
                  <figcaption className="px-2 py-3 text-sm text-current/70">{image.alt || image.file}</figcaption>
                </figure>
              ) : null;
            })}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16 border-t border-current/20 pt-8" aria-labelledby="linked-pages">
            <h2 id="linked-pages" className="mono-label text-republic">LINKED PAGES IN THE ARCHIVE</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {related.map((link) => (
                <li key={link.href}>
                  <Link href={archivePath(link.target!.path)} className="inline-block border border-current/25 px-4 py-2 hover:border-republic">
                    {link.text || link.target!.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </ThemeSection>
  );
}
