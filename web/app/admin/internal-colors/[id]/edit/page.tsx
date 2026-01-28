"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type InternalColor = {
  name: string;
  colorCode: string;
  description: string;
  image: string;
  isActive: boolean;
};

export default function EditInternalColorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<InternalColor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/internal-colors/admin/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load internal color");
        return res.json();
      })
      .then((data) => {
        setForm({
          ...data,
          isActive: data.is_active ?? data.isActive ?? true,
        });
      })
      .catch(() => setError("Failed to load internal color"));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!form) return <p>Loading...</p>;

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/internal-colors/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/admin/internal-colors");
    } catch (error) {
      console.error("Error saving internal color:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Internal Color</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Color Code</label>
          <div className="flex gap-3">
            <Input
              type="color"
              value={form.colorCode || "#FFFFFF"}
              onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              value={form.colorCode}
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
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Image URL (Optional)
          </label>
          <Input
            value={form.image}
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
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
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
