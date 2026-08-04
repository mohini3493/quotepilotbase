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

type DoorType = { id: number; name: string };
type CompositeStyle = { id: number; name: string };
type PanelStyle = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
  door_types?: DoorType[];
  composite_style_name?: string;
  composite_style_id?: number | null;
};

function SortableRow({
  panelStyle,
  onToggle,
  onDelete,
}: {
  panelStyle: PanelStyle;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: panelStyle.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        panelStyle.isActive ? "bg-card border-border" : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
      </button>

      <img
        src={panelStyle.image}
        alt={panelStyle.name}
        className={`h-12 w-12 rounded object-cover border transition-all ${
          panelStyle.isActive ? "border-border" : "border-muted grayscale"
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-medium ${panelStyle.isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {panelStyle.name}
          </p>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            panelStyle.isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
          }`}>
            {panelStyle.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{panelStyle.slug}</p>
        {(panelStyle.door_types && panelStyle.door_types.length > 0 || panelStyle.composite_style_name) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {panelStyle.door_types?.map((dt) => (
              <span key={dt.id} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">
                {dt.name}
              </span>
            ))}
            {panelStyle.composite_style_name && (
              <span className="bg-violet-50 text-violet-700 text-xs px-2 py-0.5 rounded-full border border-violet-100">
                {panelStyle.composite_style_name}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch checked={panelStyle.isActive} onCheckedChange={() => onToggle(panelStyle.id)} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/panel-styles/${panelStyle.id}/edit`}>Edit</a>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(panelStyle.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function PanelStylesPage() {
  const [panelStyles, setPanelStyles] = useState<PanelStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [doorTypeFilter, setDoorTypeFilter] = useState<number | "all">("all");
  const [compositeStyleFilter, setCompositeStyleFilter] = useState<number | "all" | "none">("all");
  const [compositeStyles, setCompositeStyles] = useState<CompositeStyle[]>([]);

  async function loadPanelStyles() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/panel-styles/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      let items: any[] = Array.isArray(data) ? data : data.panelStyles || data.data || [];
      const mapped = items.map((item: any) => ({ ...item, isActive: item.is_active ?? item.isActive ?? true }));
      setPanelStyles(mapped.sort((a: PanelStyle, b: PanelStyle) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load panel styles");
    } finally {
      setLoading(false);
    }
  }

  async function togglePanelStyle(id: number) {
    const ps = panelStyles.find((p) => p.id === id);
    if (!ps) return;
    await fetch(`/api/panel-styles/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ps.isActive }),
    });
    setPanelStyles((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  }

  async function deletePanelStyle(id: number) {
    if (!confirm("Are you sure you want to delete this panel style?")) return;
    await fetch(`/api/panel-styles/${id}`, { method: "DELETE", credentials: "include" });
    setPanelStyles((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((p) => p.id === active.id);
    const newIndex = filtered.findIndex((p) => p.id === over.id);
    const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

    const filteredIds = new Set(filtered.map((p) => p.id));
    let idx = 0;
    const newFull = panelStyles.map((p) => (filteredIds.has(p.id) ? reorderedFiltered[idx++] : p));
    setPanelStyles(newFull);

    try {
      await fetch(`/api/panel-styles/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newFull.map((p, i) => ({ id: p.id, order: i })) }),
      });
    } catch {
      loadPanelStyles();
    }
  }

  useEffect(() => {
    loadPanelStyles();
    fetch(`/api/composite-styles`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCompositeStyles(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const uniqueDoorTypes = Array.from(
    new Map(
      panelStyles.flatMap((ps) => ps.door_types || []).map((dt) => [dt.id, dt])
    ).values()
  );

  const filtered = panelStyles.filter((ps) => {
    const matchSearch = ps.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? ps.isActive : !ps.isActive);
    const matchDt = doorTypeFilter === "all" || (ps.door_types || []).some((dt) => dt.id === doorTypeFilter);
    const matchComposite =
      compositeStyleFilter === "all" ||
      (compositeStyleFilter === "none"
        ? !ps.composite_style_id
        : ps.composite_style_id === compositeStyleFilter);
    return matchSearch && matchStatus && matchDt && matchComposite;
  });

  const hasFilter = search !== "" || statusFilter !== "all" || doorTypeFilter !== "all" || compositeStyleFilter !== "all";

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
          <p className="text-destructive font-medium">Error loading panel styles</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={loadPanelStyles} className="mt-3">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Panel Styles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage panel styles for your products</p>
        </div>
        <Button asChild>
          <Link href="/admin/panel-styles/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Panel Style
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

        {uniqueDoorTypes.length > 0 && (
          <select
            value={doorTypeFilter}
            onChange={(e) => setDoorTypeFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Door Types</option>
            {uniqueDoorTypes.map((dt) => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        )}

        {compositeStyles.length > 0 && (
          <select
            value={compositeStyleFilter}
            onChange={(e) => setCompositeStyleFilter(e.target.value === "all" ? "all" : e.target.value === "none" ? "none" : Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Composite Styles</option>
            <option value="none">No Style Assigned</option>
            {compositeStyles.map((cs) => (
              <option key={cs.id} value={cs.id}>{cs.name}</option>
            ))}
          </select>
        )}

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(""); setStatusFilter("all"); setDoorTypeFilter("all"); setCompositeStyleFilter("all"); }}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3 h-3" /> Clear
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {panelStyles.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasFilter ? "No panel styles match your filter" : "No panel styles found"}
            </p>
            {!hasFilter && (
              <Button asChild>
                <Link href="/admin/panel-styles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Panel Style
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((ps) => ps.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filtered.map((panelStyle) => (
                <SortableRow
                  key={panelStyle.id}
                  panelStyle={panelStyle}
                  onToggle={togglePanelStyle}
                  onDelete={deletePanelStyle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
