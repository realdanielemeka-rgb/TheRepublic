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
    <ThemeSection theme="ink" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h1 className="display-type text-[clamp(2.5rem,7vw,6rem)]">START A PROJECT</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mono-label mt-8 flex flex-col gap-2 text-paper/85">
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
