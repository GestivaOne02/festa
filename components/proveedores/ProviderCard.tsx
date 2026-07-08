"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Provider, formatCOP } from "@/constants/providers";
import CategoryChip from "./CategoryChip";
import StarRating from "./StarRating";

interface ProviderCardProps {
  provider: Provider;
}

// Provider card: compact horizontal layout on mobile, vertical on sm+
export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        href={`/proveedores/${provider.id}`}
        className="flex sm:flex-col bg-brand-cream border border-brand-orange/10 hover:border-brand-orange rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
      >
        {/* Avatar / photo */}
        <div className="relative w-28 shrink-0 sm:w-full sm:h-36 overflow-hidden bg-brand-orange/10">
          <Image
            src={provider.avatarUrl}
            alt={`${provider.name} - ${provider.category} en ${provider.city}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Category chip over the photo (desktop) */}
          <div className="hidden sm:block absolute top-3 left-3">
            <CategoryChip category={provider.category} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-2 sm:gap-3 min-w-0">
          <div className="space-y-1.5 sm:space-y-2">
            {/* Category chip inline (mobile only) */}
            <div className="sm:hidden">
              <CategoryChip category={provider.category} />
            </div>

            <h3 className="font-heading text-base sm:text-lg font-bold text-brand-brown group-hover:text-brand-orange transition-colors leading-tight truncate">
              {provider.name}
            </h3>

            <StarRating rating={provider.rating} reviewsCount={provider.reviewsCount} />

            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-brand-brown/65">
              <MapPin className="w-3 h-3 text-brand-orange shrink-0" />
              <span className="truncate">{provider.city}</span>
            </div>
          </div>

          {/* Price + action */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-orange/10">
            <div className="leading-none min-w-0">
              <span className="text-[9px] sm:text-[10px] text-brand-brown/55 block">Desde</span>
              <span className="font-heading font-bold text-brand-orange text-sm sm:text-base whitespace-nowrap">
                {formatCOP(provider.priceFrom)}
                <span className="text-[10px] font-body text-brand-brown/55 font-normal">/hora</span>
              </span>
            </div>
            <span className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full bg-brand-orange/10 group-hover:bg-brand-orange text-brand-orange group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
