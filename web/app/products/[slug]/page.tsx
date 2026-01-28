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

      {/* Trust Badges */}
      <section className="py-8 bg-white border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Shield,
                title: "10 Year Warranty",
                desc: "Full coverage",
                color: "text-violet-600 bg-violet-100",
              },
              {
                icon: Truck,
                title: "Free Installation",
                desc: "Expert fitting",
                color: "text-blue-600 bg-blue-100",
              },
              {
                icon: Award,
                title: "Quality Certified",
                desc: "ISO 9001",
                color: "text-amber-600 bg-amber-100",
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                desc: "2-3 weeks",
                color: "text-emerald-600 bg-emerald-100",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
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

      {/* Help Section */}
      <section className="py-12 bg-slate-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our experts are ready to assist you.
              </p>
              <a
                href="tel:+441234567890"
                className="text-primary font-semibold text-sm hover:underline"
              >
                Call: 01onal 234 5678
              </a>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Free Home Survey
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Book a free measurement with our specialists.
              </p>
              <Link
                href="/quote"
                className="text-primary font-semibold text-sm hover:underline"
              >
                Book Now →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                0% Finance Available
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Spread the cost with flexible payments.
              </p>
              <span className="text-primary font-semibold text-sm">
                Learn More →
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
