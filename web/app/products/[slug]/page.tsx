import { notFound } from "next/navigation";

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
    }
  );

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <img
          src={product.image}
          alt={product.title}
          className="rounded-xl w-full max-h-[420px] object-cover"
        />

        <h1 className="text-4xl font-bold">{product.title}</h1>

        <p className="text-muted-foreground text-lg">{product.description}</p>
      </div>
    </section>
  );
}
