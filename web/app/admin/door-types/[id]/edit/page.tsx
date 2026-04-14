"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/ImageUpload";

type DoorType = {
  name: string;
  image: string;
  isActive: boolean;
  productId: number | string;
};

type Product = { id: number; title: string };

export default function EditDoorTypePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<DoorType | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!id) return;

    fetch(`/api/door-types/admin/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load door type");
        return res.json();
      })
      .then((data) => {
        setForm({
          ...data,
          isActive: data.is_active ?? data.isActive ?? true,
          productId: data.product_id ?? data.productId ?? "",
        });
      })
      .catch(() => setError("Failed to load door type"));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!form) return <p>Loading...</p>;

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/door-types/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/admin/door-types");
    } catch (error) {
      console.error("Error saving door type:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product Type</h1>

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
            value={form.name}
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
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
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
