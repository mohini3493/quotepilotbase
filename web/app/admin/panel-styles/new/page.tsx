"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

type DoorType = { id: number; name: string };

export default function AddPanelStylePage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    name: "",
    image: "",
    isActive: true,
    doorTypeIds: [] as number[],
  });
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

  async function savePanelStyle() {
    setSaving(true);
    try {
      await fetch(`/api/panel-styles`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      router.push("/admin/panel-styles");
    } catch (error) {
      console.error("Error saving panel style:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Panel Style</h1>

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
                    setForm((prev: any) => ({
                      ...prev,
                      doorTypeIds: checked
                        ? [...prev.doorTypeIds, d.id]
                        : prev.doorTypeIds.filter((id: number) => id !== d.id),
                    }));
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
            placeholder="Panel Style Name"
            value={form.name || ""}
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
        <Button onClick={savePanelStyle} disabled={saving}>
          {saving ? "Saving..." : "Save Panel Style"}
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
