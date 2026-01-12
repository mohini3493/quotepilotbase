"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ isActive: true });

  async function saveProduct() {
    await fetch("http://localhost:4000/api/products", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: form.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      }),
    });

    router.push("/admin/products");
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product</h1>

      <Input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        placeholder="Image URL"
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <Input
        placeholder="Button Text"
        onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
      />
      <Input
        placeholder="Button Link"
        onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
      />

      <div className="flex items-center gap-3">
        <Switch
          checked={form.isActive}
          onCheckedChange={(v) => setForm({ ...form, isActive: v })}
        />
        <span>Active</span>
      </div>

      <Button onClick={saveProduct}>Save Product</Button>
    </div>
  );
}
