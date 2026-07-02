import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Refund Policy — The Republic Studios",
  description: "Refund policy for The Republic Studios.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updated="July 2026">
      <p>
        This Refund Policy outlines how {business.name} handles payments, cancellations, and
        refunds for services provided to clients.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Project deposits</h2>
      <p>
        Projects typically begin with an agreed deposit or initial payment as set out in the
        relevant proposal or statement of work. Deposits secure our availability and cover initial
        planning and strategy work, and are generally non-refundable once work has commenced.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Cancellations</h2>
      <p>
        If a client wishes to cancel a project, we will invoice for work completed up to the date
        of cancellation. Any amount paid in excess of the value of work completed will be refunded
        within a reasonable time.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Refund eligibility</h2>
      <p>
        Refund requests are assessed on a case-by-case basis in line with the terms agreed for
        each engagement. We aim to resolve any dispute over fees or deliverables directly with the
        client before a refund is considered.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">How to request a refund</h2>
      <p>
        To request a refund, please contact us at {business.email} with your project details and
        the reason for your request. We will respond within a reasonable timeframe.
      </p>

      <h2 className="font-display text-xl font-medium text-foreground">Changes to this policy</h2>
      <p>
        We may update this Refund Policy from time to time. The current version will always be
        available on this page.
      </p>
    </LegalPage>
  );
}
