import Link from "next/link";
import ThemeSection from "@/components/ThemeSection";
import Bracket from "@/components/Bracket";

export default function NotFound() {
  return (
    <ThemeSection theme="ink" className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="display-type text-[clamp(1.75rem,5vw,3.5rem)]">
        <Bracket>THIS PAGE DOESN&rsquo;T EXIST</Bracket>
      </p>
      <p className="measure mt-6 text-lg text-paper/80">
        But the work does.
      </p>
      <Link href="/work" className="mono-label mt-8 rounded-full bg-republic px-6 py-3 text-paper hover:bg-republic-press">
        See the work →
      </Link>
    </ThemeSection>
  );
}
