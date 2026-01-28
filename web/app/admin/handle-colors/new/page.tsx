"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function AddHandleColorPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ isActive: true });
  const [saving, setSaving] = useState(false);

  async function saveHandleColor() {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/handle-colors`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      router.push("/admin/handle-colors");
    } catch (error) {
      console.error("Error saving handle color:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Handle Color</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            placeholder="e.g., Chrome"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Color Code</label>
          <div className="flex gap-3">
            <Input
              type="color"
              value={form.colorCode || "#C0C0C0"}
              onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              placeholder="#C0C0C0"
              value={form.colorCode || ""}
              onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
              className="flex-1 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Description (Optional)
          </label>
          <Textarea
            placeholder="Description of this handle color"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Image URL (Optional)
          </label>
          <Input
            placeholder="Image URL for handle color swatch"
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
        <Button onClick={saveHandleColor} disabled={saving}>
          {saving ? "Saving..." : "Save Handle Color"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/handle-colors")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
