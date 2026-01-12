"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const processSteps = [
  {
    id: 1,
    number: "1",
    title: "Free Estimation",
    description: "Get detailed project assessment",
  },
  {
    id: 2,
    number: "2",
    title: "Choose Design",
    description: "Select your preferred style",
  },
  {
    id: 3,
    number: "3",
    title: "Price Confirmation",
    description: "Transparent pricing",
  },
  {
    id: 4,
    number: "4",
    title: "Installation 24Hrs",
    description: "Professional setup service",
  },
  {
    id: 5,
    number: "5",
    title: "Maintenance",
    description: "Ongoing support & care",
  },
];

export default function Process() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden font-sans">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Settings className="w-4 h-4" />
            How We Work
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our <span className="text-primary">Process</span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience our streamlined workflow designed to deliver exceptional
            results with transparency and efficiency at every step.
          </motion.p>
        </motion.div>

        {/* Process Flow - Desktop & Mobile */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4">
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col md:flex-row items-center"
              >
                {/* Process Step */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`w-16 h-16 ${
                      step.id === 3 ? "bg-secondary" : "bg-primary"
                    } rounded-full flex items-center justify-center shadow-lg mx-auto mb-3`}
                  >
                    <span className="text-xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <div className="max-w-28">
                    <h3 className="font-bold text-sm text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Connecting Line */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="hidden md:block mx-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  >
                    <div className="w-16 h-0 border-t-2 border-dashed border-primary/50"></div>
                  </motion.div>
                )}

                {/* Mobile Connecting Line */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    className="md:hidden my-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  >
                    <div className="w-0 h-8 border-l-2 border-dashed border-primary/50"></div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
