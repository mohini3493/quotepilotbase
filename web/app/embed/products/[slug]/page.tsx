import { notFound } from "next/navigation";
import ProductConfigurator from "@/components/quote/ProductConfigurator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export default async function EmbedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      {/* Background grid */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-200/20 blur-3xl pointer-events-none" />

      <section className="relative z-10 py-4">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back to products link */}
          <div className="mb-4">
            <Link
              href="/embed/products"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border p-6 md:p-8">
            <ProductConfigurator
              productId={product.id}
              productTitle={product.title}
            />
          </div>
        </div>
      </section>

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
    </div>
  );
}
