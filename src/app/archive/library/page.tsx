import type { Metadata } from "next";
import Link from "next/link";
import ThemeSection from "@/components/ThemeSection";
import libraryImages from "../../../../content/wix-export/library-images.json";

export const metadata: Metadata = {
  title: "Additional Wix image library · The Republic",
  description: "Additional Wix media files preserved for The Republic migration.",
  robots: { index: false, follow: false },
};

export default function LibraryArchive() {
  return (
    <ThemeSection theme="paper" className="min-h-dvh px-6 pb-24 pt-32 sm:px-10">
      <main className="mx-auto max-w-[1200px]">
        <Link href="/archive" className="mono-label text-republic hover:underline">← WIX ARCHIVE</Link>
        <p className="mono-label mt-12 text-republic">PRESERVED MEDIA LIBRARY</p>
        <h1 className="display-type mt-4 text-[clamp(2.5rem,6vw,5rem)]">ADDITIONAL IMAGES</h1>
        <p className="measure mt-5 max-w-3xl text-lg">
          These {libraryImages.length} source images were in the Wix media library but
          were not used on the 22 published pages. The original files are in the
          downloadable backup, and these viewing copies are stored in The Republic’s
          Supabase project.
        </p>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {libraryImages.map((image) => (
            <li key={image.filename} className="min-w-0 border border-current/20 p-2">
              <a href={image.publicUrl} className="block hover:opacity-80">
                {/* Public archive assets are already optimized and served by Supabase. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.publicUrl}
                  alt={image.filename}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-current/5 object-contain"
                />
                <span className="block break-all px-2 py-3 text-xs">{image.filename}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </ThemeSection>
  );
}
