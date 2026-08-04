"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function EditCompositeStylePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<{ name: string; isActive: boolean; order: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/composite-styles/admin/${id}`, { credentials: "include" })
      .then((res) => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then((data) => setForm({ name: data.name, isActive: data.is_active ?? true, order: data.order ?? 0 }))
      .catch(() => setError("Failed to load composite door style"));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/composite-styles/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, isActive: form.isActive, order: form.order }),
      });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/admin/composite-styles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!form && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error && !form) return <p className="text-destructive p-4">{error}</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Composite Door Style</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div>
          <label className="text-sm font-medium mb-2 block">Name <span className="text-red-500">*</span></label>
          <Input
            value={form!.name}
            onChange={(e) => setForm({ ...form!, name: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={form!.isActive}
            onCheckedChange={(v) => setForm({ ...form!, isActive: v })}
          />
          <span className="text-sm font-medium">Active</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/composite-styles")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
