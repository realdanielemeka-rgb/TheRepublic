import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Studio from "@/components/Studio";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio — The Republic Studios",
  description:
    "The Republic is a global agency based in Lagos, Nigeria, working in brand building, campaign execution, and driving growth for clients across diverse industries.",
};

export default function StudioPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        <Studio />
        <Process />

        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
          <div className="border-t border-line pt-10 text-sm text-foreground/60">
            <p>{business.name}</p>
            <p className="mt-2">{business.address}</p>
            <p className="mt-2">
              <a href={`mailto:${business.email}`} className="hover:text-accent">
                {business.email}
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
