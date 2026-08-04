"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type GlazingOption = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  glazingOption,
  onToggle,
  onDelete,
}: {
  glazingOption: GlazingOption;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: glazingOption.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        glazingOption.isActive ? "bg-card border-border" : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      {glazingOption.image ? (
        <img
          src={glazingOption.image}
          alt={glazingOption.name}
          className={`h-12 w-12 rounded object-cover border transition-all ${
            glazingOption.isActive ? "border-border" : "border-muted grayscale"
          }`}
        />
      ) : (
        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">N/A</span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${glazingOption.isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {glazingOption.name}
          </p>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            glazingOption.isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
          }`}>
            {glazingOption.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{glazingOption.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch checked={glazingOption.isActive} onCheckedChange={() => onToggle(glazingOption.id)} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/glazing-options/${glazingOption.id}/edit`}>Edit</a>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(glazingOption.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function GlazingOptionsPage() {
  const [glazingOptions, setGlazingOptions] = useState<GlazingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  async function loadGlazingOptions() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/glazing-options/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      let items: any[] = Array.isArray(data) ? data : data.glazingOptions || data.data || [];
      const mapped = items.map((item: any) => ({ ...item, isActive: item.is_active ?? item.isActive ?? true }));
      setGlazingOptions(mapped.sort((a: GlazingOption, b: GlazingOption) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load glazing options");
    } finally {
      setLoading(false);
    }
  }

  async function toggleGlazingOption(id: number) {
    const g = glazingOptions.find((o) => o.id === id);
    if (!g) return;
    await fetch(`/api/glazing-options/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !g.isActive }),
    });
    setGlazingOptions((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
  }

  async function deleteGlazingOption(id: number) {
    if (!confirm("Are you sure you want to delete this glazing option?")) return;
    await fetch(`/api/glazing-options/${id}`, { method: "DELETE", credentials: "include" });
    setGlazingOptions((prev) => prev.filter((o) => o.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((o) => o.id === active.id);
    const newIndex = filtered.findIndex((o) => o.id === over.id);
    const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

    const filteredIds = new Set(filtered.map((o) => o.id));
    let idx = 0;
    const newFull = glazingOptions.map((o) => (filteredIds.has(o.id) ? reorderedFiltered[idx++] : o));
    setGlazingOptions(newFull);

    try {
      await fetch(`/api/glazing-options/reorder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newFull.map((o, i) => ({ id: o.id, order: i })) }),
      });
    } catch {
      loadGlazingOptions();
    }
  }

  useEffect(() => { loadGlazingOptions(); }, []);

  const filtered = glazingOptions.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? o.isActive : !o.isActive);
    return matchSearch && matchStatus;
  });

  const hasFilter = search !== "" || statusFilter !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error loading glazing options</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={loadGlazingOptions} className="mt-3">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Glazing Options</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage glazing options for your products</p>
        </div>
        <Button asChild>
          <Link href="/admin/glazing-options/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Glazing Option
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-56"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "active", "inactive"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {glazingOptions.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasFilter ? "No glazing options match your filter" : "No glazing options found"}
            </p>
            {!hasFilter && (
              <Button asChild>
                <Link href="/admin/glazing-options/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Glazing Option
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((o) => o.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((glazingOption) => (
                <SortableRow
                  key={glazingOption.id}
                  glazingOption={glazingOption}
                  onToggle={toggleGlazingOption}
                  onDelete={deleteGlazingOption}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
