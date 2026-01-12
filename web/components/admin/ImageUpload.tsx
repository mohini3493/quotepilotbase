"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ImageUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:4000/api/upload/image", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    onUploaded(data.url);
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p className="text-sm">Uploading...</p>}
    </div>
  );
}
