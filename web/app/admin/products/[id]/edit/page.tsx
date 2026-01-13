"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Product = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/admin/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load product");
        return res.json();
      })
      .then(setForm)
      .catch(() => setError("Failed to load product"));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!form) return <p>Loading...</p>;

  async function save() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>

      <Input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <Input
        value={form.buttonText}
        onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
      />
      <Input
        value={form.buttonLink}
        onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
      />

      <div className="flex items-center gap-3">
        <Switch
          checked={form.isActive}
          onCheckedChange={(v) => setForm({ ...form, isActive: v })}
        />
        <span>Active</span>
      </div>

      <Button onClick={save}>Save Changes</Button>
    </div>
  );
}
