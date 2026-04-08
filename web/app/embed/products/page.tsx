import { ArrowRight, Sparkles } from "lucide-react";

type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  slug: string;
};

function ProductCard({
  product,
  baseUrl,
}: {
  product: Product;
  baseUrl: string;
}) {
  const productUrl = `${baseUrl}/products/${product.slug}`;

  return (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className="group relative h-full rounded-3xl overflow-hidden cursor-pointer">
        <div className="relative h-[420px] sm:h-[440px] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />

          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                {product.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2 max-w-[90%]">
                {product.description}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-500">
              <span>Get Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default async function EmbedProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || API_URL.replace("/api", "").replace(":4000", ":3000");

  // Allow overriding columns via query param (default: 3)
  const cols = Number(params.cols) || 3;
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) return <p>Failed to load products.</p>;

    const text = await res.text();
    if (text.startsWith("<!DOCTYPE")) return <p>API error.</p>;

    const rawProducts = JSON.parse(text);

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

    if (!activeProducts.length) return <p>No products available.</p>;

    return (
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium border border-emerald-500/20 mb-4">
              <Sparkles className="w-4 h-4" />
              Discover Our Solutions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Our <span className="text-emerald-500">Products</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Explore our range of premium glazing solutions designed to
              transform your space with style and efficiency.
            </p>
          </div>

          {/* Grid */}
          <div className={`grid ${colsClass} gap-5 lg:gap-6`}>
            {activeProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{
                  animationDelay: `${index * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                <ProductCard product={product} baseUrl={SITE_URL} />
              </div>
            ))}
          </div>
        </div>

        {/* Resize observer script to communicate height to parent */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function sendHeight() {
                  var height = document.documentElement.scrollHeight;
                  window.parent.postMessage({ type: 'quotepilot-embed-resize', height: height }, '*');
                }
                sendHeight();
                new ResizeObserver(sendHeight).observe(document.body);
                window.addEventListener('load', sendHeight);
              })();
            `,
          }}
        />
      </section>
    );
  } catch (error) {
    return <p>Error loading products.</p>;
  }
}
