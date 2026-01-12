"use client";

import { useAdmin } from "@/lib/useAdmin";
import { redirect } from "next/navigation";
import QuestionBuilder from "@/components/admin/QuestionBuilder";

export default function QuestionsPage() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Question Builder</h1>
      <QuestionBuilder />
    </>
  );
}
