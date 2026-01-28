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

type Dimension = {
  id: number;
  width: number;
  height: number;
  isActive: boolean;
  order: number;
};

function SortableRow({
  dimension,
  index,
  onToggle,
  onDelete,
}: {
  dimension: Dimension;
  index: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: dimension.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        dimension.isActive
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

      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-lg">
        {index + 1}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              dimension.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {dimension.width} x {dimension.height} mm
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              dimension.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {dimension.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Width: {dimension.width}mm | Height: {dimension.height}mm
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={dimension.isActive}
            onCheckedChange={() => onToggle(dimension.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/dimensions/${dimension.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(dimension.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function DimensionsPage() {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDimensions() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/dimensions/admin/all`, {
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
      let dimensions = [];
      if (Array.isArray(data)) {
        dimensions = data;
      } else if (data && Array.isArray(data.dimensions)) {
        dimensions = data.dimensions;
      } else if (data && Array.isArray(data.data)) {
        dimensions = data.data;
      } else {
        dimensions = [];
      }

      const mappedDimensions = dimensions.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setDimensions(
        mappedDimensions.sort(
          (a: Dimension, b: Dimension) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading dimensions:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load dimensions",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleDimension(id: number) {
    const dimension = dimensions.find((d) => d.id === id);
    if (!dimension) return;

    try {
      await fetch(`/api/dimensions/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !dimension.isActive }),
      });

      setDimensions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d)),
      );
    } catch (error) {
      console.error("Error toggling dimension:", error);
    }
  }

  async function deleteDimension(id: number) {
    if (!confirm("Are you sure you want to delete this dimension?")) return;

    try {
      await fetch(`/api/dimensions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setDimensions((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Error deleting dimension:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dimensions.findIndex((d) => d.id === active.id);
    const newIndex = dimensions.findIndex((d) => d.id === over.id);
    const newOrder = arrayMove(dimensions, oldIndex, newIndex);

    setDimensions(newOrder);

    try {
      await fetch(`/api/dimensions/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((d, index) => ({ id: d.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering dimensions:", error);
      loadDimensions();
    }
  }

  useEffect(() => {
    loadDimensions();
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
            Error loading dimensions
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDimensions}
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
          <h1 className="text-2xl font-semibold">Dimensions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage dimensions for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dimensions/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Dimension
          </Link>
        </Button>
      </div>

      {dimensions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No dimensions found</p>
            <Button asChild>
              <Link href="/admin/dimensions/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Dimension
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
            items={dimensions.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {dimensions.map((dimension, index) => (
                <SortableRow
                  key={dimension.id}
                  dimension={dimension}
                  index={index}
                  onToggle={toggleDimension}
                  onDelete={deleteDimension}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
