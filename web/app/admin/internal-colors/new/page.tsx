"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AddInternalColorPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ isActive: true });
  const [saving, setSaving] = useState(false);

  async function saveInternalColor() {
    setSaving(true);
    try {
      await fetch(`/api/internal-colors`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      router.push("/admin/internal-colors");
    } catch (error) {
      console.error("Error saving internal color:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Internal Color</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            placeholder="e.g., White"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Image (Optional)
          </label>
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
        <Button onClick={saveInternalColor} disabled={saving}>
          {saving ? "Saving..." : "Save Internal Color"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/internal-colors")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
