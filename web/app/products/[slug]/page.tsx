import { notFound } from "next/navigation";
import ProductConfigurator from "@/components/quote/ProductConfigurator";

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
    <section className="py-12 md:py-24">
      {/* Product Details */}
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl w-full max-h-[420px] object-cover"
        />

        <h1 className="text-4xl font-bold">{product.title}</h1>

        <p className="text-muted-foreground text-lg">{product.description}</p>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6 my-12">
        <div className="border-t border-border" />
      </div>

      {/* Product Configurator */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Configure Your {product.title}
          </h2>
          <p className="text-muted-foreground mt-2">
            Customize your perfect door by selecting from our range of options
          </p>
        </div>
        <ProductConfigurator
          productId={product.id}
          productTitle={product.title}
        />
      </div>
    </section>
  );
}
