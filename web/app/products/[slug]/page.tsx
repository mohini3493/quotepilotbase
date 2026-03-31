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
      <section className="py-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
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
