"use client";

import { ProviderCategory, CATEGORY_STYLES } from "@/constants/providers";

interface CategoryChipProps {
  category: ProviderCategory;
  size?: "sm" | "md";
}

// Colored chip identifying the provider's service category
export default function CategoryChip({ category, size = "sm" }: CategoryChipProps) {
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full ${CATEGORY_STYLES[category]} ${
        size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-xs px-3 py-1"
      }`}
    >
      {category}
    </span>
  );
}
