import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accessibility Statement — The Republic Studios",
  description: "Accessibility statement for The Republic Studios.",
};

export default function AccessibilityStatementPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="July 2026">
      <p>
        {business.name} is committed to ensuring digital accessibility for people of all
        abilities. We are continually improving the user experience for everyone and applying the
        relevant accessibility standards.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Our approach</h2>
      <p>
        We aim to make our website usable and accessible across a range of devices, browsers, and
        assistive technologies, following widely recognised accessibility guidelines where
        practical.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Ongoing improvements</h2>
      <p>
        Accessibility is an ongoing effort. We regularly review our website and welcome feedback
        that helps us identify areas for improvement.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Feedback</h2>
      <p>
        If you experience any difficulty accessing content on this website, please let us know at{" "}
        {business.email} so we can address the issue.
      </p>
    </LegalPage>
  );
}
