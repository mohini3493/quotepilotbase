"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Question = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

export default function QuestionBuilder() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");

  function addQuestion() {
    const newQuestion: Question = {
      id: label.replace(/\s+/g, "_").toLowerCase(),
      label,
      type,
      required,
      options:
        type === "select" || type === "checkbox"
          ? options.split(",").map((o) => o.trim())
          : [],
    };

    setQuestions([...questions, newQuestion]);
    setLabel("");
    setOptions("");
    setRequired(false);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Builder */}
      <div className="space-y-4 border p-6 rounded-lg">
        <h2 className="font-semibold">Create Question</h2>

        <Input
          placeholder="Question label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
          </SelectContent>
        </Select>

        {(type === "select" || type === "checkbox") && (
          <Input
            placeholder="Options (comma separated)"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
          />
        )}

        <div className="flex items-center gap-2">
          <Checkbox
            checked={required}
            onCheckedChange={(v) => setRequired(!!v)}
          />
          <span>Required</span>
        </div>

        <Button onClick={addQuestion}>Add Question</Button>
      </div>

      {/* RIGHT: Preview */}
      <div className="border p-6 rounded-lg">
        <h2 className="font-semibold mb-4">Preview</h2>

        {questions.length === 0 && (
          <p className="text-gray-500">No questions yet</p>
        )}

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block font-medium">
                {q.label}
                {q.required && " *"}
              </label>

              {q.type === "text" && <Input />}
              {q.type === "number" && <Input type="number" />}

              {q.type === "select" && (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {q.type === "checkbox" && (
                <div className="space-y-2">
                  {q.options?.map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <Checkbox />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
