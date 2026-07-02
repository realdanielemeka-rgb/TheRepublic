import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProjectStrip from "@/components/ProjectStrip";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Studio from "@/components/Studio";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProjectStrip />
        <Marquee />
        <Services />
        <Work />
        <Studio />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
