"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function NewCompositeStylePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/composite-styles`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, isActive: form.isActive }),
      });
      if (!res.ok) throw new Error("Failed to create");
      router.push("/admin/composite-styles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add Composite Door Style</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div>
          <label className="text-sm font-medium mb-2 block">Name <span className="text-red-500">*</span></label>
          <Input
            placeholder="e.g. Contemporary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
          />
          <span className="text-sm font-medium">Active</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Style"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/composite-styles")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
