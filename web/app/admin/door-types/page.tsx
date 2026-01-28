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

type DoorType = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        doorType.isActive
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
        src={doorType.image}
        alt={doorType.name}
        className={`h-12 w-12 rounded object-cover border transition-all ${
          doorType.isActive ? "border-border" : "border-muted grayscale"
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              doorType.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {doorType.name}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              doorType.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {doorType.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">/{doorType.slug}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={doorType.isActive}
            onCheckedChange={() => onToggle(doorType.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/door-types/${doorType.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(doorType.id)}
        >
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

  async function loadDoorTypes() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/door-types/admin/all`,
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
      let doorTypes = [];
      if (Array.isArray(data)) {
        doorTypes = data;
      } else if (data && Array.isArray(data.doorTypes)) {
        doorTypes = data.doorTypes;
      } else if (data && Array.isArray(data.data)) {
        doorTypes = data.data;
      } else {
        doorTypes = [];
      }

      setDoorTypes(
        doorTypes.sort(
          (a: DoorType, b: DoorType) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading door types:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load door types",
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleDoorType(id: number) {
    const doorType = doorTypes.find((dt) => dt.id === id);
    if (!doorType) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/door-types/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !doorType.isActive }),
      });

      setDoorTypes((prev) =>
        prev.map((dt) =>
          dt.id === id ? { ...dt, isActive: !dt.isActive } : dt,
        ),
      );
    } catch (error) {
      console.error("Error toggling door type:", error);
    }
  }

  async function deleteDoorType(id: number) {
    if (!confirm("Are you sure you want to delete this door type?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/door-types/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setDoorTypes((prev) => prev.filter((dt) => dt.id !== id));
    } catch (error) {
      console.error("Error deleting door type:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = doorTypes.findIndex((dt) => dt.id === active.id);
    const newIndex = doorTypes.findIndex((dt) => dt.id === over.id);
    const newOrder = arrayMove(doorTypes, oldIndex, newIndex);

    setDoorTypes(newOrder);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/door-types/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((dt, index) => ({ id: dt.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering door types:", error);
      loadDoorTypes();
    }
  }

  useEffect(() => {
    loadDoorTypes();
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
            Error loading door types
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDoorTypes}
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
          <h1 className="text-2xl font-semibold">Door Types</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage door types for your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/door-types/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Door Type
          </Link>
        </Button>
      </div>

      {doorTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No door types found</p>
            <Button asChild>
              <Link href="/admin/door-types/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Door Type
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
            items={doorTypes.map((dt) => dt.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {doorTypes.map((doorType) => (
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
