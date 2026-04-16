"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/ImageUpload";

type PanelStyle = {
  name: string;
  image: string;
  isActive: boolean;
  doorTypeIds: number[];
};

type DoorType = { id: number; name: string };

export default function EditPanelStylePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<PanelStyle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [doorTypes, setDoorTypes] = useState<DoorType[]>([]);

  useEffect(() => {
    fetch(`/api/door-types/admin/all`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setDoorTypes(arr.filter((d: any) => d.is_active ?? d.isActive));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/panel-styles/admin/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load panel style");
        return res.json();
      })
      .then((data) => {
        setForm({
          ...data,
          isActive: data.is_active ?? data.isActive ?? true,
          doorTypeIds:
            Array.isArray(data.door_type_ids) && data.door_type_ids.length > 0
              ? data.door_type_ids
              : data.door_type_id
                ? [data.door_type_id]
                : [],
        });
      })
      .catch(() => setError("Failed to load panel style"));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!form) return <p>Loading...</p>;

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/panel-styles/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/admin/panel-styles");
    } catch (error) {
      console.error("Error saving panel style:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Panel Style</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Product Types
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
            {doorTypes.map((d) => (
              <label
                key={d.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.doorTypeIds.includes(d.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            doorTypeIds: checked
                              ? [...prev.doorTypeIds, d.id]
                              : prev.doorTypeIds.filter(
                                  (id: number) => id !== d.id,
                                ),
                          }
                        : prev,
                    );
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{d.name}</span>
              </label>
            ))}
            {doorTypes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No product types available
              </p>
            )}
          </div>
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
          onClick={() => router.push("/admin/panel-styles")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
