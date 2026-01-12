"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableProductRow({ product }: { product: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded-lg p-4 bg-card"
    >
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <img src={product.image} className="w-14 rounded" />
        <div>
          <p className="font-medium">{product.title}</p>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
