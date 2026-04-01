import { ArrowRight, Sparkles } from "lucide-react";
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
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div className="group relative h-full rounded-3xl overflow-hidden cursor-pointer">
        {/* Full-bleed image background */}
        <div className="relative h-[420px] sm:h-[440px] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradient overlay - always visible, stronger on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Bottom content - always visible */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
            {/* Title & description */}
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                {product.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2 max-w-[90%]">
                {product.description}
              </p>
            </div>

            {/* CTA pill */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-500">
              <span>Get Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductSection() {
  // For server components, use the API URL directly or a relative URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  console.log("Fetching products from API:", API_URL);

  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      console.log("API:", process.env.NEXT_PUBLIC_API_URL);
      return null;
    }

    const text = await res.text();

    // 🛑 Protect against HTML response
    if (text.startsWith("<!DOCTYPE")) {
      console.error("API returned HTML instead of JSON");
      return null;
    }

    const rawProducts = JSON.parse(text);

    // Map snake_case to camelCase
    const products: Product[] = rawProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      isActive: p.is_active ?? p.isActive ?? true,
      order: p.order ?? 0,
      slug: p.slug,
    }));

    const activeProducts = products
      .filter((p) => p.isActive)
      .sort((a, b) => a.order - b.order);

    if (!activeProducts.length) return null;

    return (
      <section
        className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80"
        id="products"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4" />
              Discover Our Solutions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Our <span className="text-primary">Products</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Explore our range of premium glazing solutions designed to
              transform your space with style and efficiency.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {activeProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{
                  animationDelay: `${index * 120}ms`,
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
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}
