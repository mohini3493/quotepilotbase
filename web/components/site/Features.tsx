"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Zap,
  Palette,
  Shield,
  BarChart3,
  Cog,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Admin Controlled",
    desc: "Fully manage questions and pricing rules from a powerful admin dashboard. No coding required.",
    icon: Settings,
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/20",
    accent: "bg-emerald-500",
  },
  {
    title: "Scalable Logic",
    desc: "Rule-based engine built to handle complex pricing scenarios and business logic with ease.",
    icon: Cog,
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/20",
    accent: "bg-blue-500",
  },
  {
    title: "Lightning Fast",
    desc: "Optimized for speed and performance. Generate quotes instantly, even with complex calculations.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
    accent: "bg-amber-500",
  },
  {
    title: "Flexible UI",
    desc: "Adapt quote flows to any business model with customizable forms and responsive design.",
    icon: Palette,
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/20",
    accent: "bg-violet-500",
  },
  {
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with encrypted data storage and reliable cloud infrastructure.",
    icon: Shield,
    gradient: "from-rose-500 to-pink-600",
    shadowColor: "shadow-rose-500/20",
    accent: "bg-rose-500",
  },
  {
    title: "Analytics Dashboard",
    desc: "Track quote performance, conversion rates, and customer insights with built-in analytics.",
    icon: BarChart3,
    gradient: "from-cyan-500 to-sky-600",
    shadowColor: "shadow-cyan-500/20",
    accent: "bg-cyan-500",
  },
];

export default function Features() {
  return (
    <section
      className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80"
      id="features"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-5">
            Powerful{" "}
            <span className="text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text">
              Features
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to create, manage, and optimize your quote
            generation process
          </p>
        </motion.div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isLarge = index === 0 || index === 3;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`group relative ${isLarge ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div
                  className={`relative h-full bg-white border border-slate-100 rounded-2xl p-7 overflow-hidden hover:border-slate-200 transition-all duration-500 hover:shadow-2xl ${feature.shadowColor}`}
                >
                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}
                  />

                  {/* Top row: icon + number */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <motion.div
                      whileHover={{ rotate: -8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.shadowColor}`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    <span className="text-[80px] font-black leading-none text-slate-100 select-none group-hover:text-slate-200 transition-colors duration-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-[15px] group-hover:text-slate-600 transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-6 relative z-10">
                    <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "40%" }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.3 + index * 0.1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 p-10 md:p-14">
            {/* CTA background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Ready to streamline your quote process?
                </h3>
                <p className="text-emerald-100 text-lg max-w-lg">
                  Join thousands of businesses already using Infinity Glazing to
                  generate quotes faster and more accurately.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300 shadow-lg shadow-black/10">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-7 py-3.5 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-300">
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
