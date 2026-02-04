import ProductCards from "@/components/site/ProductCards";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function QuotePage() {
  return (
    <main className="mx-auto">
      <ScrollReveal>
        <ProductCards />
      </ScrollReveal>
    </main>
  );
}
