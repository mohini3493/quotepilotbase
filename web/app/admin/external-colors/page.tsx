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

type ExternalColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  externalColor,
  onToggle,
  onDelete,
}: {
  externalColor: ExternalColor;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: externalColor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        externalColor.isActive
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

      {externalColor.colorCode ? (
        <div
          className="w-12 h-12 rounded border border-border"
          style={{ backgroundColor: externalColor.colorCode }}
        />
      ) : externalColor.image ? (
        <img
          src={externalColor.image}
          alt={externalColor.name}
          className={`h-12 w-12 rounded object-cover border transition-all ${
            externalColor.isActive ? "border-border" : "border-muted grayscale"
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
              externalColor.isActive
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {externalColor.name}
          </p>
          {externalColor.colorCode && (
            <span className="text-xs text-muted-foreground font-mono">
              {externalColor.colorCode}
            </span>
          )}
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              externalColor.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {externalColor.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{externalColor.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={externalColor.isActive}
            onCheckedChange={() => onToggle(externalColor.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/external-colors/${externalColor.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(externalColor.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function ExternalColorsPage() {
  const [externalColors, setExternalColors] = useState<ExternalColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadExternalColors() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/external-colors/admin/all`, {
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
      let externalColors = [];
      if (Array.isArray(data)) {
        externalColors = data;
      } else if (data && Array.isArray(data.externalColors)) {
        externalColors = data.externalColors;
      } else if (data && Array.isArray(data.data)) {
        externalColors = data.data;
      } else {
        externalColors = [];
      }

      const mappedExternalColors = externalColors.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setExternalColors(
        mappedExternalColors.sort(
          (a: ExternalColor, b: ExternalColor) =>
            (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading external colors:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load external colors",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleExternalColor(id: number) {
    const externalColor = externalColors.find((ec) => ec.id === id);
    if (!externalColor) return;

    try {
      await fetch(`/api/external-colors/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !externalColor.isActive }),
      });

      setExternalColors((prev) =>
        prev.map((ec) =>
          ec.id === id ? { ...ec, isActive: !ec.isActive } : ec,
        ),
      );
    } catch (error) {
      console.error("Error toggling external color:", error);
    }
  }

  async function deleteExternalColor(id: number) {
    if (!confirm("Are you sure you want to delete this external color?"))
      return;

    try {
      await fetch(`/api/external-colors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setExternalColors((prev) => prev.filter((ec) => ec.id !== id));
    } catch (error) {
      console.error("Error deleting external color:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = externalColors.findIndex((ec) => ec.id === active.id);
    const newIndex = externalColors.findIndex((ec) => ec.id === over.id);
    const newOrder = arrayMove(externalColors, oldIndex, newIndex);

    setExternalColors(newOrder);

    try {
      await fetch(`/api/external-colors/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((ec, index) => ({ id: ec.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering external colors:", error);
      loadExternalColors();
    }
  }

  useEffect(() => {
    loadExternalColors();
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
            Error loading external colors
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadExternalColors}
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
          <h1 className="text-2xl font-semibold">External Colors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage external color options for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/external-colors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add External Color
          </Link>
        </Button>
      </div>

      {externalColors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No external colors found
            </p>
            <Button asChild>
              <Link href="/admin/external-colors/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First External Color
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
            items={externalColors.map((ec) => ec.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {externalColors.map((externalColor) => (
                <SortableRow
                  key={externalColor.id}
                  externalColor={externalColor}
                  onToggle={toggleExternalColor}
                  onDelete={deleteExternalColor}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
