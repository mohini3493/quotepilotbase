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

type HandleColor = {
  id: number;
  name: string;
  slug: string;
  colorCode: string;
  image: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  handleColor,
  onToggle,
  onDelete,
}: {
  handleColor: HandleColor;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: handleColor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        handleColor.isActive
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

      {handleColor.colorCode ? (
        <div
          className="w-12 h-12 rounded border border-border"
          style={{ backgroundColor: handleColor.colorCode }}
        />
      ) : handleColor.image ? (
        <img
          src={handleColor.image}
          alt={handleColor.name}
          className={`h-12 w-12 rounded object-cover border transition-all ${
            handleColor.isActive ? "border-border" : "border-muted grayscale"
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
              handleColor.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {handleColor.name}
          </p>
          {handleColor.colorCode && (
            <span className="text-xs text-muted-foreground font-mono">
              {handleColor.colorCode}
            </span>
          )}
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              handleColor.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {handleColor.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{handleColor.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={handleColor.isActive}
            onCheckedChange={() => onToggle(handleColor.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/handle-colors/${handleColor.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(handleColor.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function HandleColorsPage() {
  const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadHandleColors() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/handle-colors/admin/all`, {
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
      let handleColors = [];
      if (Array.isArray(data)) {
        handleColors = data;
      } else if (data && Array.isArray(data.handleColors)) {
        handleColors = data.handleColors;
      } else if (data && Array.isArray(data.data)) {
        handleColors = data.data;
      } else {
        handleColors = [];
      }

      const mappedHandleColors = handleColors.map((item: any) => ({
        ...item,
        isActive: item.is_active ?? item.isActive ?? true,
      }));
      setHandleColors(
        mappedHandleColors.sort(
          (a: HandleColor, b: HandleColor) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading handle colors:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load handle colors",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleHandleColor(id: number) {
    const handleColor = handleColors.find((hc) => hc.id === id);
    if (!handleColor) return;

    try {
      await fetch(`/api/handle-colors/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !handleColor.isActive }),
      });

      setHandleColors((prev) =>
        prev.map((hc) =>
          hc.id === id ? { ...hc, isActive: !hc.isActive } : hc,
        ),
      );
    } catch (error) {
      console.error("Error toggling handle color:", error);
    }
  }

  async function deleteHandleColor(id: number) {
    if (!confirm("Are you sure you want to delete this handle color?")) return;

    try {
      await fetch(`/api/handle-colors/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setHandleColors((prev) => prev.filter((hc) => hc.id !== id));
    } catch (error) {
      console.error("Error deleting handle color:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = handleColors.findIndex((hc) => hc.id === active.id);
    const newIndex = handleColors.findIndex((hc) => hc.id === over.id);
    const newOrder = arrayMove(handleColors, oldIndex, newIndex);

    setHandleColors(newOrder);

    try {
      await fetch(`/api/handle-colors/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((hc, index) => ({ id: hc.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering handle colors:", error);
      loadHandleColors();
    }
  }

  useEffect(() => {
    loadHandleColors();
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
            Error loading handle colors
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHandleColors}
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
          <h1 className="text-2xl font-semibold">Handle Colors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage handle color options for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/handle-colors/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Handle Color
          </Link>
        </Button>
      </div>

      {handleColors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No handle colors found</p>
            <Button asChild>
              <Link href="/admin/handle-colors/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Handle Color
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
            items={handleColors.map((hc) => hc.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {handleColors.map((handleColor) => (
                <SortableRow
                  key={handleColor.id}
                  handleColor={handleColor}
                  onToggle={toggleHandleColor}
                  onDelete={deleteHandleColor}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
