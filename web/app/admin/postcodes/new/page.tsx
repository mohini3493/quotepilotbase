"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function AddPostcodePage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ isActive: true });
  const [saving, setSaving] = useState(false);

  async function savePostcode() {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/admin/postcodes");
    } catch (error) {
      console.error("Error saving postcode:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Postcode</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Postcode</label>
          <Input
            placeholder="e.g., SW1A"
            value={form.code || ""}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Area Name</label>
          <Input
            placeholder="e.g., Westminster, London"
            value={form.area || ""}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Description (Optional)
          </label>
          <Textarea
            placeholder="Additional notes about this postcode area"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        <Button onClick={savePostcode} disabled={saving}>
          {saving ? "Saving..." : "Save Postcode"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/postcodes")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
