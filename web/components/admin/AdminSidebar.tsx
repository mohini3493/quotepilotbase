"use client";

import Link from "next/link";
import {
  Calculator,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Package,
  Plus,
  DoorOpen,
  PanelTop,
  Ruler,
  MapPin,
  Palette,
  PaintBucket,
  Grip,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Customers", href: "/admin/customers", icon: Users },
];

const productLinks = [
  { name: "All Products", href: "/admin/products", icon: Package },
  { name: "Add Product", href: "/admin/products/new", icon: Plus },
];

const doorTypeLinks = [
  { name: "All Door Types", href: "/admin/door-types", icon: Package },
  { name: "Add Door Type", href: "/admin/door-types/new", icon: Plus },
];

const panelStyleLinks = [
  { name: "All Panel Styles", href: "/admin/panel-styles", icon: Package },
  { name: "Add Panel Style", href: "/admin/panel-styles/new", icon: Plus },
];

const dimensionLinks = [
  { name: "All Dimensions", href: "/admin/dimensions", icon: Package },
  { name: "Add Dimension", href: "/admin/dimensions/new", icon: Plus },
];

const postcodeLinks = [
  { name: "All Postcodes", href: "/admin/postcodes", icon: Package },
  { name: "Add Postcode", href: "/admin/postcodes/new", icon: Plus },
];

const externalColorLinks = [
  {
    name: "All External Colors",
    href: "/admin/external-colors",
    icon: Package,
  },
  {
    name: "Add External Color",
    href: "/admin/external-colors/new",
    icon: Plus,
  },
];

const internalColorLinks = [
  {
    name: "All Internal Colors",
    href: "/admin/internal-colors",
    icon: Package,
  },
  {
    name: "Add Internal Color",
    href: "/admin/internal-colors/new",
    icon: Plus,
  },
];

const handleColorLinks = [
  {
    name: "All Handle Colors",
    href: "/admin/handle-colors",
    icon: Package,
  },
  {
    name: "Add Handle Color",
    href: "/admin/handle-colors/new",
    icon: Plus,
  },
];

export default function AdminSidebar() {
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
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
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
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

        {/* Door Types Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Door Types
          </p>
          <Link
            href="/admin/door-types"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <DoorOpen className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Door Types</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {doorTypeLinks.map((link) => {
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

        {/* Panel Styles Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Panel Styles
          </p>
          <Link
            href="/admin/panel-styles"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <PanelTop className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Panel Styles</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {panelStyleLinks.map((link) => {
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

        {/* Dimensions Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Dimensions
          </p>
          <Link
            href="/admin/dimensions"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <Ruler className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Dimensions</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {dimensionLinks.map((link) => {
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

        {/* Postcodes Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Postcodes
          </p>
          <Link
            href="/admin/postcodes"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Postcodes</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {postcodeLinks.map((link) => {
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

        {/* External Colors Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            External Colors
          </p>
          <Link
            href="/admin/external-colors"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <Palette className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">External Colors</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {externalColorLinks.map((link) => {
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

        {/* Internal Colors Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Internal Colors
          </p>
          <Link
            href="/admin/internal-colors"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <PaintBucket className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Internal Colors</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {internalColorLinks.map((link) => {
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

        {/* Handle Colors Section */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Handle Colors
          </p>
          <Link
            href="/admin/handle-colors"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <Grip className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Handle Colors</span>
          </Link>
          <div className="ml-3 space-y-1 border-l border-sidebar-border/50 pl-3">
            {handleColorLinks.map((link) => {
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
