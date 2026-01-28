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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        internalColor.isActive
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

      {internalColor.colorCode ? (
        <div
          className="w-12 h-12 rounded border border-border"
          style={{ backgroundColor: internalColor.colorCode }}
        />
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
          <p
            className={`font-medium ${
              internalColor.isActive
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {internalColor.name}
          </p>
          {internalColor.colorCode && (
            <span className="text-xs text-muted-foreground font-mono">
              {internalColor.colorCode}
            </span>
          )}
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              internalColor.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {internalColor.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{internalColor.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={internalColor.isActive}
            onCheckedChange={() => onToggle(internalColor.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/internal-colors/${internalColor.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(internalColor.id)}
        >
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

  async function loadInternalColors() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/internal-colors/admin/all`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `API Error: ${res.status} ${res.statusText} - ${errorText}`,
        );
      }

      const data = await res.json();

      // Handle different response formats
      let internalColors = [];
      if (Array.isArray(data)) {
        internalColors = data;
      } else if (data && Array.isArray(data.internalColors)) {
        internalColors = data.internalColors;
      } else if (data && Array.isArray(data.data)) {
        internalColors = data.data;
      } else {
        internalColors = [];
      }

      const mappedInternalColors = internalColors.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setInternalColors(
        mappedInternalColors.sort(
          (a: InternalColor, b: InternalColor) =>
            (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading internal colors:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load internal colors",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleInternalColor(id: number) {
    const internalColor = internalColors.find((ic) => ic.id === id);
    if (!internalColor) return;

    try {
      await fetch(`/api/internal-colors/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !internalColor.isActive }),
      });

      setInternalColors((prev) =>
        prev.map((ic) =>
          ic.id === id ? { ...ic, isActive: !ic.isActive } : ic,
        ),
      );
    } catch (error) {
      console.error("Error toggling internal color:", error);
    }
  }

  async function deleteInternalColor(id: number) {
    if (!confirm("Are you sure you want to delete this internal color?"))
      return;

    try {
      await fetch(`/api/internal-colors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setInternalColors((prev) => prev.filter((ic) => ic.id !== id));
    } catch (error) {
      console.error("Error deleting internal color:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = internalColors.findIndex((ic) => ic.id === active.id);
    const newIndex = internalColors.findIndex((ic) => ic.id === over.id);
    const newOrder = arrayMove(internalColors, oldIndex, newIndex);

    setInternalColors(newOrder);

    try {
      await fetch(`/api/internal-colors/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((ic, index) => ({ id: ic.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering internal colors:", error);
      loadInternalColors();
    }
  }

  useEffect(() => {
    loadInternalColors();
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
            Error loading internal colors
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadInternalColors}
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
          <h1 className="text-2xl font-semibold">Internal Colors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage internal color options for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/internal-colors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Internal Color
          </Link>
        </Button>
      </div>

      {internalColors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No internal colors found
            </p>
            <Button asChild>
              <Link href="/admin/internal-colors/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Internal Color
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
            items={internalColors.map((ic) => ic.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {internalColors.map((internalColor) => (
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
