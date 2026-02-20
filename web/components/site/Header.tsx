"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  LogIn,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Products", href: "/products" },
  { label: "Quote", href: "/quote" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Load theme */
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  /* Toggle theme */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-primary text-primary-foreground py-2 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left Side - Address & Phone */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Business Ave, Suite 100, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Right Side - Email & Social */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@quotepilot.com</span>
              </div>
              <div className="flex items-center gap-2 border-l border-primary-foreground/30 pl-4">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Instagram className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header
        className={clsx(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b"
            : "bg-background border-b",
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-25 items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <LogoIcon />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-foreground font-medium hover:text-primary transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDark(!dark)}
                className="hover:bg-accent"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <Link href="/admin-login">
                <Button
                  variant="outline"
                  className="font-medium bg-primary text-white"
                >
                  Admin Login <LogIn className="w-5 h-5 flex-shrink-0" />
                </Button>
              </Link>

              {/* <Link href="/quote">
                <Button className="bg-primary hover:bg-primary/90 font-medium px-6">
                  Get Quote 💼
                </Button>
              </Link> */}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={clsx(
            "lg:hidden overflow-hidden transition-all duration-300 border-t bg-background",
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-foreground hover:text-primary font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDark(!dark)}
                >
                  {dark ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" /> Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" /> Dark
                    </>
                  )}
                </Button>
              </div>

              <Link href="/admin-login" className="w-full">
                <Button
                  variant="outline"
                  className="font-medium bg-primary text-white"
                >
                  Admin Login <LogIn className="w-5 h-5 flex-shrink-0" />
                </Button>
              </Link>

              {/* <Link href="/quote" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
                  Get Quote
                </Button>
              </Link> */}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-6 pt-6 border-t space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@quotepilot.com</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

/* LOGO ICON */
function LogoIcon() {
  return <img src="/quote-logo1.png" alt="Infinity Glazing Logo" className="w-25" />;
}
