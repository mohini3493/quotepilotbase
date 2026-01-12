"use client";

import Link from "next/link";
import {
  Calculator,
  LayoutDashboard,
  HelpCircle,
  Settings,
  LogOut,
  ShoppingBag,
  Package,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Questions", href: "/admin/questions", icon: HelpCircle },
  { name: "Rules", href: "/admin/rules", icon: Settings },
];

const productLinks = [
  { name: "All Products", href: "/admin/products", icon: Package },
  { name: "Add Product", href: "/admin/products/new", icon: Plus },
];

export default function AdminSidebar() {
  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/admin-login";
  };

  return (
    <aside className="w-64 border-r border-sidebar-border h-full bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-2">
          <img src="/quote-logo1.png" alt="QuotePilot Logo" className="h-12" />
          <span className="text-sm font-semibold text-sidebar-foreground">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Main
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Products Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Products
          </p>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Products</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {productLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-destructive/10 hover:text-destructive w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
}
