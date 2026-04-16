import { notFound } from "next/navigation";
import ProductConfigurator from "@/components/quote/ProductConfigurator";
import { ArrowLeft, Shield, Truck, Award, Clock } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export default async function ProductPage({
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
      {/* Animated background grid */}
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
      {/* Gradient orbs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <section className="relative z-10 py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border p-3 sm:p-6 md:p-8">
            <ProductConfigurator
              productId={product.id}
              productTitle={product.title}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
