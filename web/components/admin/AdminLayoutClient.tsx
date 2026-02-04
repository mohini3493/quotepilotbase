"use client";

import AdminSidebar from "./AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-primary/10 text-foreground overflow-hidden">
      <AdminSidebar />
      <ScrollArea className="h-full w-full">
        <main className="bg-background relative flex w-full flex-1 flex-col rounded-xl shadow-sm m-2  overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </ScrollArea>
    </div>
  );
}
