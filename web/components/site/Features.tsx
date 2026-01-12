"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Zap,
  ArrowUpRight,
  Palette,
  Shield,
  BarChart3,
  Users,
  Cog,
} from "lucide-react";

const features = [
  {
    title: "Admin Controlled",
    desc: "Fully manage questions and pricing rules from a powerful admin dashboard. No coding required.",
    icon: Settings,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Scalable Logic",
    desc: "Rule-based engine built to handle complex pricing scenarios and business logic with ease.",
    icon: Cog,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Lightning Fast",
    desc: "Optimized for speed and performance. Generate quotes instantly, even with complex calculations.",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Flexible UI",
    desc: "Adapt quote flows to any business model with customizable forms and responsive design.",
    icon: Palette,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with encrypted data storage and reliable cloud infrastructure.",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Analytics Dashboard",
    desc: "Track quote performance, conversion rates, and customer insights with built-in analytics.",
    icon: BarChart3,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Features() {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to create, manage, and optimize your quote
            generation process
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group relative bg-card border rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                variants={itemVariants}
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className={`w-7 h-7 ${feature.color}`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-secondary/30 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold mb-3">
              Ready to streamline your quote process?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Join thousands of businesses already using QuotePilot to generate
              quotes faster and more accurately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                Start Free Trial
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border bg-background hover:bg-accent transition-colors rounded-lg font-medium">
                View Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
