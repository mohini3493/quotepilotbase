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

type CompositeStyle = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  order: number;
};

function SortableRow({
  style,
  onToggle,
  onDelete,
}: {
  style: CompositeStyle;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: style.id });
  const s = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={s}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        style.is_active ? "bg-card border-border" : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${style.is_active ? "text-foreground" : "text-muted-foreground"}`}>
            {style.name}
          </p>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            style.is_active ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
          }`}>
            {style.is_active ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{style.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch checked={style.is_active} onCheckedChange={() => onToggle(style.id)} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/composite-styles/${style.id}/edit`}>Edit</a>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(style.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function CompositeStylesPage() {
  const [styles, setStyles] = useState<CompositeStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/composite-styles/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setStyles(Array.isArray(data) ? data.sort((a: CompositeStyle, b: CompositeStyle) => (a.order || 0) - (b.order || 0)) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function toggle(id: number) {
    const item = styles.find((s) => s.id === id);
    if (!item) return;
    await fetch(`/api/composite-styles/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name, slug: item.slug, isActive: !item.is_active, order: item.order }),
    });
    setStyles((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)));
  }

  async function remove(id: number) {
    if (!confirm("Are you sure you want to delete this composite door style?")) return;
    await fetch(`/api/composite-styles/${id}`, { method: "DELETE", credentials: "include" });
    setStyles((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((s) => s.id === active.id);
    const newIndex = filtered.findIndex((s) => s.id === over.id);
    const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

    const filteredIds = new Set(filtered.map((s) => s.id));
    let idx = 0;
    const newFull = styles.map((s) => (filteredIds.has(s.id) ? reorderedFiltered[idx++] : s));
    setStyles(newFull);

    try {
      await fetch(`/api/composite-styles/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newFull.map((s, i) => ({ id: s.id, order: i })) }),
      });
    } catch {
      load();
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = styles.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? s.is_active : !s.is_active);
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
          <p className="text-destructive font-medium">Error loading composite door styles</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={load} className="mt-3">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Composite Door Styles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sub-styles for composite doors (Contemporary, Designers, Traditional)</p>
        </div>
        <Button asChild>
          <Link href="/admin/composite-styles/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Style
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
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
          ))}
        </div>
        {hasFilter && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatusFilter("all"); }} className="gap-1 text-muted-foreground">
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length} of {styles.length}</span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasFilter ? "No styles match your filter" : "No composite door styles found"}
            </p>
            {!hasFilter && (
              <Button asChild>
                <Link href="/admin/composite-styles/new">
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Style
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((style) => (
                <SortableRow key={style.id} style={style} onToggle={toggle} onDelete={remove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
