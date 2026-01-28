"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Postcode = {
  code: string;
  area: string;
  description: string;
  isActive: boolean;
};

export default function EditPostcodePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Postcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/admin/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load postcode");
        return res.json();
      })
      .then(setForm)
      .catch(() => setError("Failed to load postcode"));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!form) return <p>Loading...</p>;

  async function save() {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/${id}`, {
        method: "PUT",
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
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Postcode</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Postcode</label>
          <Input
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Area Name</label>
          <Input
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />
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
          onClick={() => router.push("/admin/postcodes")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
