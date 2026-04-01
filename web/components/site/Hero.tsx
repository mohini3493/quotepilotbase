"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-emerald-200/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-200/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-28 lg:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Smart Quoting Platform
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6"
            >
              Generate Accurate
              <br />
              Quotes{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Instantly</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-primary/15 rounded-sm -z-0 origin-left"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed"
            >
              QuotePilot is a powerful platform for Construction, Renovation,
              Manufacturing & Service Industries to generate accurate quotes
              with a smart rule engine.
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {[
                { icon: Zap, label: "Smart Rule Engine" },
                { icon: BarChart3, label: "Real-time Calculations" },
                { icon: Check, label: "Fully Customizable" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-full text-sm text-slate-700"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  {feature.label}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/quote">
                <button className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                  Get Your Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="#features">
                <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  See How It Works
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex gap-8 mt-12 pt-8 border-t border-slate-200/80"
            >
              {[
                { value: "500+", label: "Quotes Generated" },
                { value: "98%", label: "Accuracy Rate" },
                { value: "24/7", label: "Availability" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Glow behind image */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-200/20 to-teal-100/10 rounded-3xl blur-2xl scale-95"
            />

            {/* Floating decorative elements */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-4 lg:-left-8 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 px-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Smart Engine
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Auto-calculated
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute -bottom-4 -right-2 lg:-right-6 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 px-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Analytics
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    +12% this week
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main dashboard image */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[580px]"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60">
                {/* Browser-style top bar */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 text-center border border-slate-200">
                      infinityglazing.com/admin/dashboard
                    </div>
                  </div>
                </div>
                <Image
                  src="/dashboard-preview.webp"
                  alt="Infinity Glazing Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>

              {/* Reflection effect */}
              <div className="absolute -bottom-8 left-4 right-4 h-16 bg-gradient-to-b from-slate-200/30 to-transparent rounded-b-2xl blur-sm scale-y-[-1] opacity-30" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}
