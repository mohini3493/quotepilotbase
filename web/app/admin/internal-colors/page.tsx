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

type InternalColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  internalColor,
  onToggle,
  onDelete,
}: {
  internalColor: InternalColor;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: internalColor.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        internalColor.isActive ? "bg-card border-border" : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      {internalColor.colorCode ? (
        <div className="w-12 h-12 rounded border border-border" style={{ backgroundColor: internalColor.colorCode }} />
      ) : internalColor.image ? (
        <img
          src={internalColor.image}
          alt={internalColor.name}
          className={`h-12 w-12 rounded object-cover border transition-all ${
            internalColor.isActive ? "border-border" : "border-muted grayscale"
          }`}
        />
      ) : (
        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">N/A</span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${internalColor.isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {internalColor.name}
          </p>
          {internalColor.colorCode && (
            <span className="text-xs text-muted-foreground font-mono">{internalColor.colorCode}</span>
          )}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            internalColor.isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
          }`}>
            {internalColor.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{internalColor.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch checked={internalColor.isActive} onCheckedChange={() => onToggle(internalColor.id)} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/internal-colors/${internalColor.id}/edit`}>Edit</a>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(internalColor.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function InternalColorsPage() {
  const [internalColors, setInternalColors] = useState<InternalColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  async function loadInternalColors() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/internal-colors/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      let items: any[] = Array.isArray(data) ? data : data.internalColors || data.data || [];
      const mapped = items.map((item: any) => ({ ...item, isActive: item.is_active ?? item.isActive ?? true }));
      setInternalColors(mapped.sort((a: InternalColor, b: InternalColor) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load internal colors");
    } finally {
      setLoading(false);
    }
  }

  async function toggleInternalColor(id: number) {
    const ic = internalColors.find((c) => c.id === id);
    if (!ic) return;
    await fetch(`/api/internal-colors/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ic.isActive }),
    });
    setInternalColors((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  }

  async function deleteInternalColor(id: number) {
    if (!confirm("Are you sure you want to delete this internal color?")) return;
    await fetch(`/api/internal-colors/${id}`, { method: "DELETE", credentials: "include" });
    setInternalColors((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((c) => c.id === active.id);
    const newIndex = filtered.findIndex((c) => c.id === over.id);
    const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

    const filteredIds = new Set(filtered.map((c) => c.id));
    let idx = 0;
    const newFull = internalColors.map((c) => (filteredIds.has(c.id) ? reorderedFiltered[idx++] : c));
    setInternalColors(newFull);

    try {
      await fetch(`/api/internal-colors/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newFull.map((c, i) => ({ id: c.id, order: i })) }),
      });
    } catch {
      loadInternalColors();
    }
  }

  useEffect(() => { loadInternalColors(); }, []);

  const filtered = internalColors.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? c.isActive : !c.isActive);
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
          <p className="text-destructive font-medium">Error loading internal colors</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={loadInternalColors} className="mt-3">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Internal Colors</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage internal color options for your products</p>
        </div>
        <Button asChild>
          <Link href="/admin/internal-colors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Internal Color
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
          {filtered.length} of {internalColors.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasFilter ? "No internal colors match your filter" : "No internal colors found"}
            </p>
            {!hasFilter && (
              <Button asChild>
                <Link href="/admin/internal-colors/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Internal Color
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((internalColor) => (
                <SortableRow
                  key={internalColor.id}
                  internalColor={internalColor}
                  onToggle={toggleInternalColor}
                  onDelete={deleteInternalColor}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
