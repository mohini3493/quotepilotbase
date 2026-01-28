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
      console.log("Starting upload to /api/upload/image...");

      const res = await fetch(`/api/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log("Upload response status:", res.status);

      const text = await res.text();
      console.log("Upload response body:", text);

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(text);
        } catch {}
        console.error("Upload failed:", res.status, errorData);
        alert(
          `Upload failed: ${(errorData as any).message || (errorData as any).error || res.status}`,
        );
        return;
      }

      const data = JSON.parse(text);
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
