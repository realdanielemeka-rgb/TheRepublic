import type { Metadata } from "next";
import ThemeSection from "@/components/ThemeSection";
import { contact } from "../../../../content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Republic handles your data.",
};

export default function PrivacyPage() {
  return (
    <ThemeSection theme="paper" className="min-h-dvh px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="display-type text-[clamp(2rem,5vw,3.5rem)]">PRIVACY POLICY</h1>
        <div className="measure mt-8 flex flex-col gap-4 text-smoke">
          <p>
            This is a stub privacy policy. The Republic will publish a full
            policy covering data collection, use and retention ahead of
            public launch.
          </p>
          <p>
            In the meantime, any information submitted via our contact form
            is used solely to respond to your enquiry and is not shared
            with third parties. For questions, contact us at{" "}
            <a href={`mailto:${contact.email}`} className="text-ink hover:text-republic">
              {contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </ThemeSection>
  );
}
