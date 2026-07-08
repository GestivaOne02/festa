"use client";

import { motion } from "framer-motion";
import { PROVIDER_CATEGORIES, ProviderCategory } from "@/constants/providers";

export type FilterValue = ProviderCategory | "Todos";

interface CategoryFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

// Horizontal chip filter (scrollable on mobile) with animated active pill
export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const options: FilterValue[] = ["Todos", ...PROVIDER_CATEGORIES];

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-2 px-4 -mx-4 sm:px-0 sm:mx-0 sm:flex-wrap sm:justify-center">
      {options.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors border ${
              isActive
                ? "text-white border-transparent"
                : "text-brand-brown/75 border-brand-orange/15 hover:border-brand-orange/40 hover:text-brand-orange bg-brand-cream"
            }`}
          >
            {/* Animated pill background behind the active chip */}
            {isActive && (
              <motion.span
                layoutId="active-category-pill"
                className="absolute inset-0 bg-brand-orange rounded-full shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
