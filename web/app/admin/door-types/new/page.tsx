"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

type Product = { id: number; title: string };

export default function AddDoorTypePage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    name: "",
    image: "",
    isActive: true,
    productId: "",
  });
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products/admin/all`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setProducts(arr.filter((p: any) => p.is_active ?? p.isActive));
      })
      .catch(() => {});
  }, []);

  async function saveDoorType() {
    setSaving(true);
    try {
      await fetch(`/api/door-types`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      router.push("/admin/door-types");
    } catch (error) {
      console.error("Error saving door type:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product Type</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Product
          </label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={form.productId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                productId: e.target.value ? Number(e.target.value) : "",
              })
            }
          >
            <option value="">-- Select a Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            placeholder="Product Type Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Image</label>
          <ImageUpload onUploaded={(url) => setForm({ ...form, image: url })} />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
          />
          <span>Active</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={saveDoorType} disabled={saving}>
          {saving ? "Saving..." : "Save Product Type"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/door-types")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
