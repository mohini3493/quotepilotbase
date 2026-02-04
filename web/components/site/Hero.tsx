"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2058&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
        >
          Smart Quote Generation
          <br />
          <span className="text-primary">Made Simple</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto font-light leading-relaxed"
        >
          QuotePilot is a powerful and intuitive platform for Construction,
          Renovation, Manufacturing & Service Industries to generate accurate
          quotes instantly.
        </motion.p>

        {/* Feature Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-16"
        >
          {[
            "Smart Rule Engine",
            "Real-time Calculations",
            "Fully Customizable",
          ].map((feature, index) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <Link href="/quote">
            <button className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              GET YOUR QUOTE
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-white/70" />
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-primary/30 rounded-full blur-md"
        />
      </div>
    </section>
  );
}
