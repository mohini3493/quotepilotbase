"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function AddDimensionPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ isActive: true });
  const [saving, setSaving] = useState(false);

  async function saveDimension() {
    setSaving(true);
    try {
      await fetch(`/api/dimensions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      router.push("/admin/dimensions");
    } catch (error) {
      console.error("Error saving dimension:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Dimension</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            placeholder="Dimension Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Image URL</label>
          <Input
            placeholder="Image URL"
            value={form.image || ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
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
        <Button onClick={saveDimension} disabled={saving}>
          {saving ? "Saving..." : "Save Dimension"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dimensions")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
