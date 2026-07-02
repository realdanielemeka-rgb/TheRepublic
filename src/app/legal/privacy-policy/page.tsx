import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — The Republic Studios",
  description: "Privacy policy for The Republic Studios.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>
        This Privacy Policy describes how {business.name} (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) collects, uses, and protects information when you visit our website or
        interact with us at {business.email}.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">
        Information we collect
      </h2>
      <p>
        We may collect information you provide directly to us, such as your name, email address,
        company name, and any details you share through our contact form or by email. We may also
        collect limited technical information, such as browser type and general usage data,
        through standard web analytics.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">
        How we use information
      </h2>
      <p>
        We use the information we collect to respond to inquiries, provide our services, improve
        our website, and communicate with you about projects or requests you have submitted. We do
        not sell your personal information to third parties.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Data sharing</h2>
      <p>
        We may share information with service providers who help us operate our website or
        deliver our services, and only to the extent necessary for them to perform those
        functions. We may also disclose information if required to do so by law.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Data retention</h2>
      <p>
        We retain information for as long as necessary to fulfil the purposes described in this
        policy, unless a longer retention period is required or permitted by law.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or request deletion of
        your personal information. To exercise these rights, contact us at {business.email}.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">
        Changes to this policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page with an updated revision date.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Contact us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at {business.email} or
        at {business.address}.
      </p>
    </LegalPage>
  );
}
