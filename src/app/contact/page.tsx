import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { contact } from "../../../content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with The Republic.",
};

export default function ContactPage() {
  return (
    // Competition-pass decision: Contact is a neutral, utility "reading
    // surface" page (a form, not art-directed hero/manifesto copy), so it
    // now honours the global appearance toggle via theme="auto" instead of
    // a fixed theme="ink" — previously the toggle only recoloured the fixed
    // nav, and every page's *content* stayed hardcoded dark regardless of
    // the user's choice, an accidental gap rather than a deliberate one.
    // Work/Journal/Studio/Services keep their fixed ink/republic/paper
    // sections unchanged — those alternate deliberately as composed art
    // direction (the "turning pages" rhythm documented in v3 Phase A's
    // DECISIONS.md section), not as a light/dark state, so retheming them
    // would invert an intentional design decision rather than fix a gap.
    // See DECISIONS.md for the full reasoning.
    <ThemeSection theme="auto" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h1 className="display-type text-[clamp(2.5rem,7vw,6rem)]">START A PROJECT</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mono-label mt-8 flex flex-col gap-2 text-current/85">
            <a href={`mailto:${contact.email}`} className="hover:text-republic">
              {contact.email}
            </a>
            <a href={`tel:${contact.phoneHref}`} className="hover:text-republic">
              {contact.phone}
            </a>
            <span>{contact.address.full}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
