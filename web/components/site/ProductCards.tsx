import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  slug: string;
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  // Different gradient styles for variety
  const gradients = [
    "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
    "bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent",
    "bg-gradient-to-br from-accent/10 via-accent/5 to-transparent",
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <Card
      className={`group relative overflow-hidden border-0 ${gradient} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer pt-0`}
    >
      <CardContent className="p-0">
        {/* Image with overlay effect */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button
              asChild
              className="w-full group/btn relative overflow-hidden bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Link
                href={`/products/${product.slug}`}
                className="flex items-center justify-center gap-2"
              >
                Quote Now
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ProductSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is missing");
    return null;
  }

  console.log("Fetching products from API:", API_URL);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch products:", res.status);
    return null;
  }

  const text = await res.text();

  // 🛑 Protect against HTML response
  if (text.startsWith("<!DOCTYPE")) {
    console.error("API returned HTML instead of JSON");
    return null;
  }

  const products: Product[] = JSON.parse(text);

  const activeProducts = products
    .filter((p) => p.isActive)
    .sort((a, b) => a.order - b.order);

  if (!activeProducts.length) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Discover Our Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Our <span className="text-primary">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our range of innovative solutions designed to streamline
            your business operations and boost productivity.
          </p>
        </div>

        {/* Grid with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
