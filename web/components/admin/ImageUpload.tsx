"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Upload failed:", res.status, errorData);
        alert("Upload failed. Please try again.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        onUploaded(data.url);
      } else {
        console.error("No URL in response:", data);
        alert("Upload failed. No URL returned.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6" />
            <span>Click to upload image</span>
          </>
        )}
      </Button>
    </div>
  );
}
