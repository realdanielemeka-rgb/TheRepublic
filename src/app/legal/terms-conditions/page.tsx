import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions — The Republic Studios",
  description: "Terms and conditions for The Republic Studios.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="July 2026">
      <p>
        These Terms &amp; Conditions govern your use of the {business.name} website and any
        services provided by {business.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
        By using our website or engaging our services, you agree to these terms.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Use of our website</h2>
      <p>
        You agree to use our website only for lawful purposes and in a way that does not infringe
        the rights of, or restrict or inhibit the use and enjoyment of, this website by anyone
        else.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Services</h2>
      <p>
        Any services we provide, including but not limited to brand strategy, campaign execution,
        content and influencer marketing, are subject to a separate agreement or statement of work
        agreed with the client before work begins. These general terms apply in addition to any
        such agreement.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Intellectual property</h2>
      <p>
        Unless otherwise agreed in writing, all content on this website, including text, graphics,
        logos, and images, is the property of {business.name} or its licensors and may not be
        reproduced without permission.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {business.name} shall not be liable for any
        indirect, incidental, or consequential damages arising from your use of this website or
        our services.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Governing law</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria, without regard to
        its conflict of law provisions.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Changes to these terms</h2>
      <p>
        We may revise these terms at any time. Continued use of our website after changes are
        posted constitutes acceptance of the revised terms.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Contact us</h2>
      <p>
        Questions about these Terms &amp; Conditions can be sent to {business.email} or{" "}
        {business.address}.
      </p>
    </LegalPage>
  );
}
