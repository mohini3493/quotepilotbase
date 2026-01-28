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

type Postcode = {
  id: number;
  code: string;
  area: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  postcode,
  onToggle,
  onDelete,
}: {
  postcode: Postcode;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: postcode.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        postcode.isActive
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

      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-semibold text-sm">
          {postcode.code.substring(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              postcode.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {postcode.code}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              postcode.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {postcode.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{postcode.area}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={postcode.isActive}
            onCheckedChange={() => onToggle(postcode.id)}
          />
        </div>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/postcodes/${postcode.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(postcode.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function PostcodesPage() {
  const [postcodes, setPostcodes] = useState<Postcode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPostcodes() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/admin/all`,
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
      let postcodes = [];
      if (Array.isArray(data)) {
        postcodes = data;
      } else if (data && Array.isArray(data.postcodes)) {
        postcodes = data.postcodes;
      } else if (data && Array.isArray(data.data)) {
        postcodes = data.data;
      } else {
        postcodes = [];
      }

      setPostcodes(
        postcodes.sort(
          (a: Postcode, b: Postcode) => (a.order || 0) - (b.order || 0),
        ),
      );
    } catch (error) {
      console.error("Error loading postcodes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load postcodes",
      );
    } finally {
      setLoading(false);
    }
  }

  async function togglePostcode(id: number) {
    const postcode = postcodes.find((p) => p.id === id);
    if (!postcode) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !postcode.isActive }),
      });

      setPostcodes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
      );
    } catch (error) {
      console.error("Error toggling postcode:", error);
    }
  }

  async function deletePostcode(id: number) {
    if (!confirm("Are you sure you want to delete this postcode?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setPostcodes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting postcode:", error);
    }
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = postcodes.findIndex((p) => p.id === active.id);
    const newIndex = postcodes.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(postcodes, oldIndex, newIndex);

    setPostcodes(newOrder);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcodes/reorder`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder.map((p, index) => ({ id: p.id, order: index })),
        }),
      });
    } catch (error) {
      console.error("Error reordering postcodes:", error);
      loadPostcodes();
    }
  }

  useEffect(() => {
    loadPostcodes();
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
            Error loading postcodes
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPostcodes}
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
          <h1 className="text-2xl font-semibold">Postcodes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage service area postcodes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/postcodes/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Postcode
          </Link>
        </Button>
      </div>

      {postcodes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No postcodes found</p>
            <Button asChild>
              <Link href="/admin/postcodes/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Postcode
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
            items={postcodes.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {postcodes.map((postcode) => (
                <SortableRow
                  key={postcode.id}
                  postcode={postcode}
                  onToggle={togglePostcode}
                  onDelete={deletePostcode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
