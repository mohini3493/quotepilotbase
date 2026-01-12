"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-background via-muted/20 to-primary/5 border-t font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Logo & Company Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/quote-logo1.png"
                alt="QuotePilot Logo"
                className="w-25"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">
                  123 Business Street, City, State 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">hello@quotepilot.com</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-foreground">Follow Us</h4>
            <p className="text-muted-foreground text-sm">
              Stay connected with our latest updates and project showcases
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Facebook, name: "Facebook", href: "#" },
                { icon: Twitter, name: "Twitter", href: "#" },
                { icon: Instagram, name: "Instagram", href: "#" },
                { icon: Linkedin, name: "LinkedIn", href: "#" },
              ].map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="group w-12 h-12 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                Stay Updated
              </h4>
              <p className="text-muted-foreground text-sm">
                Get the latest industry insights, project tips, and product
                updates delivered to your inbox.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter your email address"
                  className="pr-24 h-12 rounded-lg border-muted-foreground/20 focus:border-primary"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-2 h-8 px-4 bg-primary hover:bg-primary/90"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our privacy policy and terms of
                service.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QuotePilot. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
