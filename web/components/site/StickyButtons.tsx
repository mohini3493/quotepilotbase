"use client";

import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";

export default function StickyButtons() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 space-y-1">
      {/* Book a Service Call Button */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <a
          href="/quote"
          className="block bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 rounded-l-lg w-16 h-40 relative"
        >
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
            <div className="transform -rotate-90 text-sm font-bold whitespace-nowrap">
              Book a Service Call ☎️
            </div>
          </div>
        </a>
      </motion.div>

      {/* Enquire Now Button */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <a
          href="/quote"
          className="block bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 rounded-l-lg w-16 h-28 relative"
        >
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="transform -rotate-90 text-sm font-bold whitespace-nowrap">
              Enquire Now 📩
            </div>
          </div>
        </a>
      </motion.div>
    </div>
  );
}
