"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  MapPin,
  Award,
  Check,
  CalendarCheck,
  Phone,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { Provider } from "@/constants/providers";
import CategoryChip from "./CategoryChip";
import StarRating from "./StarRating";

interface ProviderInfoPanelProps {
  provider: Provider;
}

// Left column of the provider detail: compact profile card that fits the
// viewport height on desktop (internal scroll only as a safety net).
export default function ProviderInfoPanel({ provider }: ProviderInfoPanelProps) {
  // 4-5 short highlights: capacity first, then what their services include
  const highlights = [
    provider.capacity,
    ...provider.services.flatMap((s) => s.includes),
  ].slice(0, 5);

  const profileUrl = `https://fiesta.com.co/proveedores/${provider.id}`;

  return (
    <motion.aside
      className="flex flex-col bg-brand-cream lg:h-full lg:min-h-0 lg:overflow-hidden lg:border-r border-brand-orange/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
    >
      {/* 1. Thin banner */}
      <div className="relative h-20 sm:h-24 shrink-0 overflow-hidden bg-brand-orange/10">
        <Image
          src={provider.coverUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/70 to-brand-yellow-dark/50" />

        {/* Back to list */}
        <Link
          href="/proveedores"
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-white font-bold text-[11px] bg-brand-brown/40 hover:bg-brand-brown/70 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Proveedores</span>
        </Link>
      </div>

      {/* 2. Overlapping avatar */}
      <div className="flex justify-center -mt-10 sm:-mt-12 shrink-0 relative z-10">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-brand-cream shadow-xl bg-brand-orange/10">
          <Image
            src={provider.avatarUrl}
            alt={provider.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>

      {/* Scrollable middle (safety net; content is sized to fit) */}
      <div className="flex-1 lg:min-h-0 lg:overflow-y-auto px-5 sm:px-7 pt-2.5 pb-4 space-y-3.5">
        {/* 3. Rating */}
        <div className="flex justify-center">
          <StarRating rating={provider.rating} reviewsCount={provider.reviewsCount} size="md" />
        </div>

        {/* 4. Name + short description */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-heading text-brand-brown font-bold leading-none">
              {provider.name}
            </h1>
            <CategoryChip category={provider.category} />
          </div>
          <div className="flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-brand-brown/65">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-orange" />
              {provider.city}
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-brand-orange" />
              {provider.yearsExperience} años de experiencia
            </span>
          </div>
          <p className="text-xs text-brand-brown/75 font-light leading-relaxed line-clamp-2 max-w-sm mx-auto">
            {provider.bio}
          </p>
        </div>

        {/* 5. Highlights checklist */}
        <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-3.5 sm:p-4">
          <h2 className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-2">
            Incluye
          </h2>
          <ul className="space-y-1.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11px] sm:text-xs text-brand-brown/80">
                <Check className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-px" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6. QR + contact side by side */}
        <div className="grid grid-cols-[auto,1fr] gap-3 items-stretch">
          <div className="bg-white border border-brand-orange/15 rounded-2xl p-2.5 flex items-center justify-center shadow-sm">
            <QRCode
              value={profileUrl}
              size={76}
              fgColor="#431407"
              bgColor="transparent"
            />
          </div>
          <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-3 flex flex-col justify-center gap-1.5 min-w-0">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-wider">
              <ScanLine className="w-3 h-3" />
              Comparte este perfil
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-brand-brown/75">
              <Phone className="w-3 h-3 text-brand-orange shrink-0" />
              +57 300 123 4567
            </span>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-brand-brown/75 hover:text-brand-orange transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-brand-orange shrink-0" />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </div>

      {/* 7. Primary action pinned at the bottom */}
      <div className="shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 border-t border-brand-orange/10 bg-brand-cream">
        <a
          href="/#cotizador"
          className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm group"
        >
          <CalendarCheck className="w-5 h-5 text-brand-yellow group-hover:rotate-6 transition-transform" />
          <span>Reservar</span>
        </a>
      </div>
    </motion.aside>
  );
}
