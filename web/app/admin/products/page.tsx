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

type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  isActive: boolean;
  order: number;
};

function SortableRow({
  product,
  onToggle,
  onDelete,
}: {
  product: Product;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
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
      className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
        product.isActive
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
        src={product.image}
        alt={product.title}
        className={`h-12 w-12 rounded object-cover border transition-all ${
          product.isActive ? "border-border" : "border-muted grayscale"
        }`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              product.isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {product.title}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          /products/{product.slug}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <Switch
            checked={product.isActive}
            onCheckedChange={() => onToggle(product.id)}
          />
        </div>

        {/* View */}
        <Button variant="outline" size="sm" asChild>
          <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </Button>

        {/* Edit */}
        <Button variant="secondary" size="sm" asChild>
          <a href={`/admin/products/${product.id}/edit`}>Edit</a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/admin/all`,
        {
          credentials: "include",
        }
      );

      console.log("Response status:", res.status);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response:", errorText);
        throw new Error(
          `API Error: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Raw API response:", data);
      console.log(
        "Product count (ACTIVE ONLY):",
        data?.length || "Not an array"
      );
      console.log("First product (if exists):", data?.[0]);

      // Handle different response formats
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.products)) {
        products = data.products;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
      } else {
        console.warn("Unexpected response format:", data);
        products = [];
      }

      console.log("Processed products (ACTIVE ONLY):", products);
      // Add a note that all products shown are active since the API filters them
      setProducts(
        products.sort(
          (a: Product, b: Product) => (a.order || 0) - (b.order || 0)
        )
      );
    } catch (error) {
      console.error("Error loading products:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleProduct(id: number) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      loadProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  }

  async function deleteProduct(id: number) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  async function onDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(products, oldIndex, newIndex);
    setProducts(reordered);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/reorder`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map((p, index) => ({
          id: p.id,
          order: index + 1,
        })),
      }),
    });
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your products</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadProducts} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {loading ? "..." : totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">
              {loading ? "..." : activeProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Active Products (Shown)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {loading ? "..." : inactiveProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              Inactive Products (Hidden)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading products...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-destructive">
              <h3 className="text-lg font-semibold mb-2">
                Error loading products
              </h3>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={loadProducts}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-sm mb-4">
                Get started by creating your first product
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add New Product</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Drag and drop to reorder • All products (active and inactive) are
            displayed
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={products.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {products.map((p) => (
                  <SortableRow
                    key={p.id}
                    product={p}
                    onToggle={toggleProduct}
                    onDelete={deleteProduct}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
