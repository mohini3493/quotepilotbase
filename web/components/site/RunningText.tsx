"use client";

import { motion } from "framer-motion";
import { Home, DoorOpen } from "lucide-react";

const services = [
  "Landscape",
  "Renovation",
  "Floor Planning",
  "Schematic",
  "Windows",
  "Exterior Planning",
  "Functional Spaces",
  "Interior Design",
  "Construction",
  "Architecture",
];

export default function RunningText() {
  return (
    <section className="bg-primary/90 py-4 overflow-hidden relative">
      <div className="flex whitespace-nowrap">
        {/* First set of text */}
        <motion.div
          className="flex items-center gap-8 text-white font-sans font-medium text-lg md:text-xl"
          animate={{
            x: [0, -100 + "%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {services.map((service, index) => (
            <div key={`first-${index}`} className="flex items-center gap-8">
              {index % 2 === 0 ? (
                <Home className="w-5 h-5 text-orange-400" />
              ) : (
                <DoorOpen className="w-5 h-5 text-orange-400" />
              )}
              <span className="min-w-max">{service}</span>
            </div>
          ))}
        </motion.div>

        {/* Second set of text (duplicate for seamless loop) */}
        <motion.div
          className="flex items-center gap-8 text-white font-sans font-medium text-lg md:text-xl ml-8"
          animate={{
            x: [0, -100 + "%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {services.map((service, index) => (
            <div key={`second-${index}`} className="flex items-center gap-8">
              {index % 2 === 0 ? (
                <Home className="w-5 h-5 text-orange-400" />
              ) : (
                <DoorOpen className="w-5 h-5 text-orange-400" />
              )}
              <span className="min-w-max">{service}</span>
            </div>
          ))}
        </motion.div>

        {/* Third set of text (for extra seamlessness) */}
        <motion.div
          className="flex items-center gap-8 text-white font-sans font-medium text-lg md:text-xl ml-8"
          animate={{
            x: [0, -100 + "%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {services.map((service, index) => (
            <div key={`third-${index}`} className="flex items-center gap-8">
              {index % 2 === 0 ? (
                <Home className="w-5 h-5 text-orange-400" />
              ) : (
                <DoorOpen className="w-5 h-5 text-orange-400" />
              )}
              <span className="min-w-max">{service}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-primary/90 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-primary/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}
