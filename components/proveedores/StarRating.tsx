"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md";
}

// Compact star rating used in cards, detail header and reviews
export default function StarRating({ rating, reviewsCount, size = "sm" }: StarRatingProps) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 text-brand-yellow">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.round(rating) ? "fill-current" : "fill-brand-orange/10 text-brand-orange/20"
            }`}
          />
        ))}
      </div>
      <span className={`font-bold text-brand-brown ${size === "sm" ? "text-xs" : "text-sm"}`}>
        {rating.toFixed(1)}
      </span>
      {reviewsCount !== undefined && (
        <span className={`text-brand-brown/50 ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
