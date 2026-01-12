"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function QuoteForm() {
  const [companySize, setCompanySize] = useState("");
  const [extraService, setExtraService] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: {
          companySize: Number(companySize),
          extraService,
        },
      }),
    });

    const data = await res.json();
    setResult(data.quote);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Company size"
        value={companySize}
        onChange={(e) => setCompanySize(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <Checkbox
          checked={extraService}
          onCheckedChange={(v) => setExtraService(!!v)}
        />
        <span>Add extra service</span>
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Calculating..." : "Get Quote"}
      </Button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-semibold">Quote Summary</h3>
          <p>Total: £{result.totalPrice}</p>
        </div>
      )}
    </div>
  );
}
