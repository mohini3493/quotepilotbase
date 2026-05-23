"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setRole(data.role ?? "admin"))
      .catch(() => setRole("admin"));
  }, []);

  return (
    <div className="flex h-screen bg-primary/10 text-foreground overflow-hidden">
      {role !== null && <AdminSidebar role={role} />}
      <ScrollArea className="h-full w-full">
        <main className="bg-background relative flex w-full flex-1 flex-col rounded-xl shadow-sm m-2  overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </ScrollArea>
    </div>
  );
}
