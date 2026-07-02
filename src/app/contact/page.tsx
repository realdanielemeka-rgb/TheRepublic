import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — The Republic Studios",
  description:
    "Get in touch with The Republic Studios, a design and marketing agency based in Lagos, Nigeria.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
