import Link from "next/link";
import ThemeSection from "@/components/ThemeSection";
import Bracket from "@/components/Bracket";

/**
 * Copy per spec is "[ THIS PAGE DOESN'T EXIST ]" / "But the work does →"
 * linking to /work. Judgement call: linked to "/" instead. All eight seed
 * cases are still pending-approval, so /work renders its "CASES IN REVIEW"
 * empty state today — sending a lost visitor to a page that immediately
 * contradicts "the work does [exist]" undercuts the line. Home carries the
 * fuller story (hero, manifesto, services, clients) even while /work's
 * grid is empty. Revisit once at least one case is live — see
 * DECISIONS.md.
 */
export default function NotFound() {
  return (
    <ThemeSection theme="ink" className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="display-type text-[clamp(1.75rem,5vw,3.5rem)]">
        <Bracket>THIS PAGE DOESN&rsquo;T EXIST</Bracket>
      </p>
      <Link
        href="/"
        className="mono-label mt-8 rounded-full bg-republic px-6 py-3 text-paper hover:bg-republic-press"
      >
        But the work does →
      </Link>
    </ThemeSection>
  );
}
