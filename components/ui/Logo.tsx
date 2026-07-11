"use client";

import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center select-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <span className="font-heading text-2xl md:text-3xl font-normal tracking-widest text-primary-gold leading-none">
        FESTA
      </span>
      <span className="font-body text-[0.6rem] md:text-xs tracking-[0.3em] text-secondary-white uppercase mt-1">
        Events
      </span>
    </motion.div>
  );
}
