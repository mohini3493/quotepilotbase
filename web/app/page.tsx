import Header from "@/components/site/Header";
import ProductCards from "@/components/site/ProductCards";
import Process from "@/components/site/Process";
import Features from "@/components/site/Features";
import Testimonials from "@/components/site/Testimonials";
import FAQ from "@/components/site/FAQ";
import Support from "@/components/site/Support";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Hero from "@/components/site/Hero";
import RunningText from "@/components/site/RunningText";
import Welcome from "@/components/site/Welcome";

export const metadata = {
  title: "QuotePilot – Smart Quoting Engine",
  description:
    "Create dynamic quote forms, pricing rules, and instant results with QuotePilot.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ScrollReveal>
          <Hero />
        </ScrollReveal>
        <RunningText />
        <ScrollReveal>
          <Welcome />
        </ScrollReveal>
        <ScrollReveal>
          <ProductCards />
        </ScrollReveal>
        <ScrollReveal>
          <Process />
        </ScrollReveal>
        <ScrollReveal>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
        <Support />
        <Footer />
      </main>
    </>
  );
}
