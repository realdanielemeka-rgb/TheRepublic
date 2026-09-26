import type { Metadata } from "next";
import Link from "next/link";
import ThemeSection from "@/components/ThemeSection";
import { archivedPages, archivedVideos, archivePath } from "@/lib/wixArchive";

export const metadata: Metadata = {
  title: "Wix content archive",
  description: "Review of The Republic's preserved public Wix pages and media.",
  robots: { index: false, follow: false },
};

export default function ArchiveIndex() {
  const caseStudies = archivedPages.filter(
    (page) => !["home", "portfolio", "studio", "contact"].includes(page.slug),
  );
  const corePages = archivedPages.filter((page) => !caseStudies.includes(page));

  return (
    <ThemeSection theme="paper" className="min-h-dvh px-6 pb-24 pt-32 sm:px-10">
      <main className="mx-auto max-w-[1200px]">
        <p className="mono-label text-republic">PRESERVATION REVIEW · 26 SEPTEMBER 2026</p>
        <h1 className="display-type mt-5 text-[clamp(2.5rem,7vw,6rem)]">THE WIX ARCHIVE</h1>
        <p className="measure mt-5 max-w-3xl text-lg">
          All 22 published pages have been copied into editable content and a separate
          Republic database. This review area keeps the original words, page links,
          and images visible while the new site is being developed.
        </p>

        <div className="mt-12 grid gap-4 border-y border-current/20 py-6 sm:grid-cols-3">
          <p><strong className="text-3xl">22</strong><br />public pages</p>
          <p><strong className="text-3xl">118</strong><br />published images</p>
          <p><strong className="text-3xl">32</strong><br />video files archived</p>
        </div>

        <section className="mt-16" aria-labelledby="core-pages">
          <h2 id="core-pages" className="display-type text-3xl">CORE PAGES</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {corePages.map((page) => (
              <li key={page.slug}>
                <Link href={archivePath(page.path)} className="block border border-current/20 p-5 hover:border-republic">
                  <span className="mono-label text-republic">{page.path}</span>
                  <span className="mt-2 block text-xl">{page.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="portfolio-pages">
          <h2 id="portfolio-pages" className="display-type text-3xl">PORTFOLIO PAGES</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {caseStudies.map((page) => (
              <li key={page.slug}>
                <Link href={archivePath(page.path)} className="block border border-current/20 p-5 hover:border-republic">
                  <span className="mono-label text-republic">{page.path}</span>
                  <span className="mt-2 block text-xl">{page.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="video-files">
          <h2 id="video-files" className="display-type text-3xl">VIDEO LIBRARY</h2>
          <ul className="mt-6 columns-1 gap-8 text-sm sm:columns-2">
            {archivedVideos.map((video) => {
              const url = (video as typeof video & { publicUrl?: string }).publicUrl;
              return (
                <li key={video.id} className="break-inside-avoid border-b border-current/20 py-3">
                  {url ? (
                    <a href={url} className="underline decoration-republic underline-offset-4">{video.name}</a>
                  ) : video.name}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </ThemeSection>
  );
}
