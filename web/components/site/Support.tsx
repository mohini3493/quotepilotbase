"use client";

import { motion } from "framer-motion";
import { Gift, Percent, Truck, Clock } from "lucide-react";

const supportFeatures = [
  {
    icon: Gift,
    title: "Free Consultation",
    description: "Professional advice and estimates at no cost to you",
  },
  {
    icon: Percent,
    title: "Competitive Pricing",
    description: "Best rates in the market with transparent pricing",
  },
  {
    icon: Truck,
    title: "Fast Installation",
    description: "Quick and efficient service delivery guaranteed",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service and assistance",
  },
];

export default function Support() {
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden font-sans">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {supportFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="flex items-center space-x-4 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 w-12 h-12 bg-background rounded-lg border shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <IconComponent className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
