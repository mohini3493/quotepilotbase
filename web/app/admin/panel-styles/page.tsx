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

type PanelStyle = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        panelStyle.isActive
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

      <img
        src={panelStyle.image}
        alt={panelStyle.name}
        className={`h-12 w-12 rounded object-cover border transition-all ${
          panelStyle.isActive ? "border-border" : "border-muted grayscale"
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              panelStyle.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {panelStyle.name}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              panelStyle.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {panelStyle.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{panelStyle.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={panelStyle.isActive}
            onCheckedChange={() => onToggle(panelStyle.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/panel-styles/${panelStyle.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(panelStyle.id)}
        >
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

  async function loadPanelStyles() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles/admin/all`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `API Error: ${res.status} ${res.statusText} - ${errorText}`,
        );
      }

      const data = await res.json();

      // Handle different response formats
      let panelStyles = [];
      if (Array.isArray(data)) {
        panelStyles = data;
      } else if (data && Array.isArray(data.panelStyles)) {
        panelStyles = data.panelStyles;
      } else if (data && Array.isArray(data.data)) {
        panelStyles = data.data;
      } else {
        panelStyles = [];
      }

      setPanelStyles(
        panelStyles.sort(
          (a: PanelStyle, b: PanelStyle) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading panel styles:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load panel styles",
      );
    } finally {
      setLoading(false);
    }
  }

  async function togglePanelStyle(id: number) {
    const panelStyle = panelStyles.find((ps) => ps.id === id);
    if (!panelStyle) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !panelStyle.isActive }),
      });

      setPanelStyles((prev) =>
        prev.map((ps) =>
          ps.id === id ? { ...ps, isActive: !ps.isActive } : ps,
        ),
      );
    } catch (error) {
      console.error("Error toggling panel style:", error);
    }
  }

  async function deletePanelStyle(id: number) {
    if (!confirm("Are you sure you want to delete this panel style?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setPanelStyles((prev) => prev.filter((ps) => ps.id !== id));
    } catch (error) {
      console.error("Error deleting panel style:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = panelStyles.findIndex((ps) => ps.id === active.id);
    const newIndex = panelStyles.findIndex((ps) => ps.id === over.id);
    const newOrder = arrayMove(panelStyles, oldIndex, newIndex);

    setPanelStyles(newOrder);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/panel-styles/reorder`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: newOrder.map((ps, index) => ({ id: ps.id, order: index })),
          }),
        },
      );
    } catch (error) {
      console.error("Error reordering panel styles:", error);
      loadPanelStyles();
    }
  }

  useEffect(() => {
    loadPanelStyles();
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
            Error loading panel styles
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPanelStyles}
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
          <h1 className="text-2xl font-semibold">Panel Styles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage panel styles for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/panel-styles/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Panel Style
          </Link>
        </Button>
      </div>

      {panelStyles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No panel styles found</p>
            <Button asChild>
              <Link href="/admin/panel-styles/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Panel Style
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
            items={panelStyles.map((ps) => ps.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {panelStyles.map((panelStyle) => (
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
