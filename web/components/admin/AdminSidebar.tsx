"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  Calculator,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Plus,
  DoorOpen,
  PanelTop,
  Palette,
  PaintBucket,
  Grip,
  Users,
  Layers,
} from "lucide-react";

const productLinks = [
  { name: "Add Product", href: "/admin/products/new", icon: Plus },
];
const doorTypeLinks = [
  { name: "Add Product Type", href: "/admin/door-types/new", icon: Plus },
];
const panelStyleLinks = [
  { name: "Add Panel Style", href: "/admin/panel-styles/new", icon: Plus },
];
const externalColorLinks = [
  { name: "Add External Color", href: "/admin/external-colors/new", icon: Plus },
];
const internalColorLinks = [
  { name: "Add Internal Color", href: "/admin/internal-colors/new", icon: Plus },
];
const handleColorLinks = [
  { name: "Add Handle Color", href: "/admin/handle-colors/new", icon: Plus },
];
const glazingOptionLinks = [
  { name: "Add Glazing Option", href: "/admin/glazing-options/new", icon: Plus },
];

function SubLinks({ links }: { links: { name: string; href: string; icon: any }[] }) {
  return (
    <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
      {links.map((link) => {
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
  );
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ role }: { role: string }) {
  const isSuperAdmin = role === "superadmin";
  const hasProductAccess = role === "superadmin" || role === "admin" || role === "product_manager";
  const hasLeadAccess = role === "superadmin" || role === "admin" || role === "lead_manager";

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/admin-login";
  };

  return (
    <ScrollArea className="h-full w-64">
      <aside className="bg-sidebar flex flex-col">
        {/* Header */}
        <div className="p-4 border-sidebar-border">
          <div className="flex flex-col items-center gap-2">
            <img src="/quote-logo1.png" alt="Infinity Glazing Logo" className="h-12" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
              Main
            </p>
            <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
            {isSuperAdmin && (
              <NavLink href="/admin/users" icon={Users} label="Users" />
            )}
            {hasLeadAccess && (
              <NavLink href="/admin/customers" icon={Calculator} label="Lead Details" />
            )}
          </div>

          {/* Products Section */}
          {hasProductAccess && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
                Products Details
              </p>

              <NavLink href="/admin/products" icon={ShoppingBag} label="Products" />
              <SubLinks links={productLinks} />

              <NavLink href="/admin/door-types" icon={DoorOpen} label="Product Types" />
              <SubLinks links={doorTypeLinks} />

              <NavLink href="/admin/panel-styles" icon={PanelTop} label="Panel Styles" />
              <SubLinks links={panelStyleLinks} />

              <NavLink href="/admin/external-colors" icon={Palette} label="External Colors" />
              <SubLinks links={externalColorLinks} />

              <NavLink href="/admin/internal-colors" icon={PaintBucket} label="Internal Colors" />
              <SubLinks links={internalColorLinks} />

              <NavLink href="/admin/handle-colors" icon={Grip} label="Handle Colors" />
              <SubLinks links={handleColorLinks} />

              <NavLink href="/admin/glazing-options" icon={Layers} label="Glazing Options" />
              <SubLinks links={glazingOptionLinks} />
            </div>
          )}
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
    </ScrollArea>
  );
}
