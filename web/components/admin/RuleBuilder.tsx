'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

export default function RuleBuilder() {
  const [name, setName] = useState("");
  const [field, setField] = useState("companySize");
  const [operator, setOperator] = useState(">");
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState("");

  function handleSave() {
    const rule = {
      name,
      conditions: [{ field, operator, value: Number(value) }],
      actions: [{ type: "ADD", amount: Number(amount) }],
    };

    console.log("Rule created:", rule);
    alert("Rule created (check console)");
  }

  return (
    <div className="space-y-6 border p-6 rounded-lg">
      <Input
        placeholder="Rule name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <h3 className="font-semibold mb-2">IF</h3>
        <div className="flex gap-4">
          <Select value={field} onValueChange={setField}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="companySize">Company Size</SelectItem>
              <SelectItem value="extraService">Extra Service</SelectItem>
            </SelectContent>
          </Select>

          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=">">Greater than</SelectItem>
              <SelectItem value="==">Equals</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">THEN</h3>
        <div className="flex gap-4">
          <Input
            placeholder="Add amount (£)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleSave}>Save Rule</Button>
    </div>
  );
}
