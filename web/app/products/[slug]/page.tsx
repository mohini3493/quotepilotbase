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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-blue-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border hover:shadow-md hover:border-primary/20 transition-all text-sm font-medium text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left - Product Info */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Available Now
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10+</div>
                  <div className="text-xs text-gray-500">Year Warranty</div>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">A+</div>
                  <div className="text-xs text-gray-500">Energy Rating</div>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-xs text-gray-500">Installation</div>
                </div>
              </div>

              <a
                href="#configurator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                Start Configuring
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
            </div>

            {/* Right - Product Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-3xl blur-2xl opacity-60"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                    <span className="text-xs font-bold text-primary">
                      Premium Quality
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Configurator Section */}
      <section
        id="configurator"
        className="py-16 bg-gradient-to-b from-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
              <span className="text-sm font-semibold text-primary">
                Step-by-Step Configurator
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Configure Your {product.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Customize every detail to create your perfect door. Select from
              our premium range of styles, colors, and finishes.
            </p>
          </div>

          {/* Configurator */}
          <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
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
