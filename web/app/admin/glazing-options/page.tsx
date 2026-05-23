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
import { GripVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        glazingOption.isActive
          ? "bg-card border-border"
          : "bg-muted/30 border-muted opacity-75"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
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
          <p
            className={`font-medium ${
              glazingOption.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {glazingOption.name}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              glazingOption.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {glazingOption.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{glazingOption.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={glazingOption.isActive}
            onCheckedChange={() => onToggle(glazingOption.id)}
          />
        </div>

        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/glazing-options/${glazingOption.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(glazingOption.id)}
        >
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

  async function loadGlazingOptions() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/glazing-options/admin/all`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `API Error: ${res.status} ${res.statusText} - ${errorText}`,
        );
      }

      const data = await res.json();

      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.glazingOptions)) {
        items = data.glazingOptions;
      } else if (data && Array.isArray(data.data)) {
        items = data.data;
      }

      const mapped = items.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setGlazingOptions(
        mapped.sort(
          (a: GlazingOption, b: GlazingOption) =>
            (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (err) {
      console.error("Error loading glazing options:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load glazing options",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleGlazingOption(id: number) {
    const option = glazingOptions.find((g) => g.id === id);
    if (!option) return;

    try {
      await fetch(`/api/glazing-options/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !option.isActive }),
      });

      setGlazingOptions((prev) =>
        prev.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g)),
      );
    } catch (err) {
      console.error("Error toggling glazing option:", err);
    }
  }

  async function deleteGlazingOption(id: number) {
    if (!confirm("Are you sure you want to delete this glazing option?")) return;

    try {
      await fetch(`/api/glazing-options/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setGlazingOptions((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error deleting glazing option:", err);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = glazingOptions.findIndex((g) => g.id === active.id);
    const newIndex = glazingOptions.findIndex((g) => g.id === over.id);
    const newOrder = arrayMove(glazingOptions, oldIndex, newIndex);

    setGlazingOptions(newOrder);

    try {
      await fetch(`/api/glazing-options/reorder`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: newOrder.map((g, index) => ({ id: g.id, order: index })),
        }),
      });
    } catch (err) {
      console.error("Error reordering glazing options:", err);
      loadGlazingOptions();
    }
  }

  useEffect(() => {
    loadGlazingOptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">
            Error loading glazing options
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadGlazingOptions}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Glazing Options</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage glazing options for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/glazing-options/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Glazing Option
          </Link>
        </Button>
      </div>

      {glazingOptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No glazing options found</p>
            <Button asChild>
              <Link href="/admin/glazing-options/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Glazing Option
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={glazingOptions.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {glazingOptions.map((glazingOption) => (
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
