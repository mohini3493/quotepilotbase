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

type DoorType = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
  product?: { id: number; title: string } | null;
};

function SortableRow({
  doorType,
  onToggle,
  onDelete,
}: {
  doorType: DoorType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: doorType.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        doorType.isActive ? "bg-card border-border" : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      <img
        src={doorType.image}
        alt={doorType.name}
        className={`h-12 w-12 rounded object-cover border transition-all ${
          doorType.isActive ? "border-border" : "border-muted grayscale"
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${doorType.isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {doorType.name}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              doorType.isActive
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {doorType.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{doorType.slug}</p>
        {doorType.product && (
          <div className="mt-1">
            <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-100">
              {doorType.product.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch checked={doorType.isActive} onCheckedChange={() => onToggle(doorType.id)} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/door-types/${doorType.id}/edit`}>Edit</a>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(doorType.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function DoorTypesPage() {
  const [doorTypes, setDoorTypes] = useState<DoorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [productFilter, setProductFilter] = useState<number | "all">("all");

  async function loadDoorTypes() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/door-types/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      let items: any[] = Array.isArray(data) ? data : data.doorTypes || data.data || [];
      const mapped = items.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setDoorTypes(mapped.sort((a: DoorType, b: DoorType) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load door types");
    } finally {
      setLoading(false);
    }
  }

  async function toggleDoorType(id: number) {
    const dt = doorTypes.find((d) => d.id === id);
    if (!dt) return;
    await fetch(`/api/door-types/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !dt.isActive }),
    });
    setDoorTypes((prev) => prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)));
  }

  async function deleteDoorType(id: number) {
    if (!confirm("Are you sure you want to delete this door type?")) return;
    await fetch(`/api/door-types/${id}`, { method: "DELETE", credentials: "include" });
    setDoorTypes((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((d) => d.id === active.id);
    const newIndex = filtered.findIndex((d) => d.id === over.id);
    const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

    const filteredIds = new Set(filtered.map((d) => d.id));
    let idx = 0;
    const newFull = doorTypes.map((d) => (filteredIds.has(d.id) ? reorderedFiltered[idx++] : d));
    setDoorTypes(newFull);

    try {
      await fetch(`/api/door-types/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newFull.map((d, i) => ({ id: d.id, order: i })) }),
      });
    } catch {
      loadDoorTypes();
    }
  }

  useEffect(() => { loadDoorTypes(); }, []);

  const uniqueProducts = Array.from(
    new Map(
      doorTypes.filter((d) => d.product).map((d) => [d.product!.id, d.product!])
    ).values()
  );

  const filtered = doorTypes.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? d.isActive : !d.isActive);
    const matchProduct = productFilter === "all" || d.product?.id === productFilter;
    return matchSearch && matchStatus && matchProduct;
  });

  const hasFilter = search !== "" || statusFilter !== "all" || productFilter !== "all";

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
          <p className="text-destructive font-medium">Error loading product types</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={loadDoorTypes} className="mt-3">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Product Types</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage product types for your products</p>
        </div>
        <Button asChild>
          <Link href="/admin/door-types/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product Type
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

        {uniqueProducts.length > 0 && (
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Products</option>
            {uniqueProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        )}

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(""); setStatusFilter("all"); setProductFilter("all"); }}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {doorTypes.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasFilter ? "No product types match your filter" : "No product types found"}
            </p>
            {!hasFilter && (
              <Button asChild>
                <Link href="/admin/door-types/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product Type
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((d) => d.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((doorType) => (
                <SortableRow
                  key={doorType.id}
                  doorType={doorType}
                  onToggle={toggleDoorType}
                  onDelete={deleteDoorType}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
