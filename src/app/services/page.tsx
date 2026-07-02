import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services — The Republic Studios",
  description:
    "Influencer marketing, user-generated content, multi-platform content distribution, performance marketing, and brand building & campaign execution from The Republic Studios.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        <Services />
      </main>
      <Footer />
    </>
  );
}
