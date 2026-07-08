"use client";

import { motion } from "framer-motion";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <motion.div
        className="relative w-12 h-12 flex items-center justify-center bg-brand-orange rounded-full shadow-md border-2 border-brand-yellow cursor-pointer"
        whileHover="hover"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-9 h-9 fill-none stroke-brand-cream"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Waiter Body / Suit details */}
          <path d="M25 80 C 25 55, 75 55, 75 80" />
          {/* Bow tie */}
          <path d="M43 65 L57 65 M43 65 L50 70 L57 65 M43 65 L50 60 L57 65" fill="#FACC15" stroke="#FACC15" strokeWidth="2" />
          
          {/* Head */}
          <circle cx="50" cy="40" r="15" fill="#FFFDF9" stroke="#EA580C" strokeWidth="4" />
          
          {/* Waiter's Chef Hat / Hair */}
          <path d="M38 28 C 30 20, 50 10, 50 20 C 50 10, 70 20, 62 28 Z" fill="#FFFDF9" stroke="#EA580C" strokeWidth="3" />
          
          {/* Arm holding tray */}
          <path d="M25 70 C 15 65, 15 50, 30 45" />
          
          {/* Waiter Tray (that sways on hover) */}
          <motion.g
            variants={{
              hover: {
                rotate: [-5, 5, -5, 5, 0],
                y: [-2, 2, -2, 2, 0],
                transition: {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              },
            }}
          >
            {/* Hand under tray */}
            <circle cx="30" cy="45" r="4" fill="#EA580C" />
            {/* The Tray itself */}
            <path d="M12 42 L48 42 M18 42 L22 35 M42 42 L38 35" stroke="#FACC15" strokeWidth="5" />
            {/* Drink/Dome on tray */}
            <path d="M25 35 Q 30 25 35 35 Z" fill="#FACC15" />
            {/* Sparkle lines */}
            <motion.path
              d="M15 28 L17 31 M45 28 L43 31"
              stroke="#FFF"
              strokeWidth="3"
              variants={{
                hover: {
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                  transition: { duration: 0.6, repeat: Infinity },
                },
              }}
            />
          </motion.g>
        </svg>
      </motion.div>
      <span className="font-heading text-2xl font-bold tracking-wider text-brand-brown">
        Fiesta<span className="text-brand-orange">.</span>
      </span>
    </div>
  );
}
