"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function AddDimensionPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    width: "",
    height: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  async function saveDimension() {
    setSaving(true);
    try {
      console.log("Sending dimension data:", {
        width: parseInt(form.width) || 0,
        height: parseInt(form.height) || 0,
        isActive: form.isActive,
      });

      const response = await fetch(`/api/dimensions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          width: parseInt(form.width) || 0,
          height: parseInt(form.height) || 0,
          isActive: form.isActive,
        }),
      });

      console.log("Response status:", response.status);
      const text = await response.text();
      console.log("Response body:", text);

      if (!response.ok) {
        let error = {};
        try {
          error = JSON.parse(text);
        } catch {}
        console.error("Failed to save dimension:", response.status, error);

        if (response.status === 401) {
          alert("Not authenticated. Please log in again.");
          window.location.href = "/admin-login";
          return;
        }

        alert(
          "Failed to save dimension: " +
            ((error as any).message ||
              (error as any).error ||
              text ||
              `Status ${response.status}`),
        );
        return;
      }

      router.push("/admin/dimensions");
    } catch (error: any) {
      console.error("Error saving dimension:", error);
      alert("Error saving dimension: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add New Dimension</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Width (mm)</label>
          <Input
            type="number"
            placeholder="e.g., 900"
            value={form.width}
            onChange={(e) => setForm({ ...form, width: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Height (mm)</label>
          <Input
            type="number"
            placeholder="e.g., 2100"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
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
