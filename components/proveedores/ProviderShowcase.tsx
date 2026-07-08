"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Check,
  Info,
  Quote,
  Star,
  MapPin,
  CalendarDays,
  Clock,
} from "lucide-react";
import { Provider, formatCOP } from "@/constants/providers";

type TabKey = "oferta" | "resenas" | "ubicacion";

const TABS: { key: TabKey; label: string }[] = [
  { key: "oferta", label: "Oferta" },
  { key: "resenas", label: "Reseñas" },
  { key: "ubicacion", label: "Ubicación" },
];

interface ProviderShowcaseProps {
  provider: Provider;
}

// Right column of the provider detail: visual showcase with tabbed content
// (offer / reviews / location) so the page never needs to scroll on desktop.
export default function ProviderShowcase({ provider }: ProviderShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("oferta");

  // Hero image: auto-rotates every 4s and is selectable from the thumbnails row
  const images = [provider.coverUrl, ...provider.gallery.filter((g) => g !== provider.coverUrl)];
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImage = images[heroIndex];

  // Advance to the next image every 4 seconds; clicking a thumbnail changes
  // heroIndex, which recreates the interval and resets the 4s countdown.
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroIndex, images.length]);

  return (
    <motion.section
      className="flex flex-col bg-brand-orange/5 lg:h-full lg:min-h-0 lg:overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0.1, duration: 0.5, delay: 0.1 }}
    >
      {/* Tab bar */}
      <div className="shrink-0 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="inline-flex bg-brand-cream border border-brand-orange/10 rounded-full p-1 shadow-sm">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                  isActive ? "text-white" : "text-brand-brown/70 hover:text-brand-orange"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="showcase-tab-pill"
                    className="absolute inset-0 bg-brand-orange rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content (scrolls internally on desktop if needed) */}
      <div className="flex-1 lg:min-h-0 lg:overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {/* ============ TAB: Oferta ============ */}
          {activeTab === "oferta" && (
            <motion.div
              key="oferta"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Hero image with rate badge (crossfades between images every 4s) */}
              <div className="relative h-48 sm:h-60 xl:h-72 rounded-[2rem] overflow-hidden shadow-lg bg-brand-orange/10">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={heroImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <Image
                      src={heroImage}
                      alt={`Trabajo de ${provider.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 via-transparent to-transparent" />

                {/* Rate highlighted */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6">
                  <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest block mb-0.5">
                    Tarifa desde
                  </span>
                  <span className="font-heading font-bold text-white text-2xl sm:text-3xl leading-none drop-shadow">
                    {formatCOP(provider.priceFrom)}
                    <span className="text-sm font-body font-normal text-white/85"> /hora</span>
                  </span>
                </div>

                {/* Capacity chip */}
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-brand-cream/90 backdrop-blur-sm text-brand-brown font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow">
                  <Users className="w-3.5 h-3.5 text-brand-orange" />
                  {provider.capacity}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto scrollbar-none">
                  {images.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => setHeroIndex(index)}
                      className={`relative h-14 w-20 sm:h-16 sm:w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        heroIndex === index
                          ? "border-brand-orange shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {provider.services.map((service) => (
                  <div
                    key={service.name}
                    className="bg-brand-cream border border-brand-orange/10 rounded-2xl p-4 space-y-2.5 shadow-sm hover:border-brand-orange/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-sm font-bold text-brand-brown leading-snug">
                        {service.name}
                      </h3>
                      <span className="font-heading font-bold text-brand-orange text-sm whitespace-nowrap shrink-0">
                        {formatCOP(service.priceHour)}
                        <span className="text-[9px] font-body text-brand-brown/55 font-normal">/h</span>
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {service.includes.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-[11px] text-brand-brown/70">
                          <Check className="w-3 h-3 text-brand-orange shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Booking notice, integrated cleanly */}
              <div className="flex items-start gap-2.5 bg-brand-yellow/15 border border-brand-yellow-dark/20 rounded-2xl px-4 py-3">
                <Info className="w-4 h-4 text-brand-yellow-dark shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-brand-brown/80 font-light leading-relaxed">
                  <span className="font-bold">Reserva con Fiesta:</span> aparta la fecha con un
                  depósito del 20% (se descuenta del total). Cancelación gratuita hasta 72 horas
                  antes del evento. Pago protegido y sin cargos ocultos.
                </p>
              </div>
            </motion.div>
          )}

          {/* ============ TAB: Reseñas ============ */}
          {activeTab === "resenas" && (
            <motion.div
              key="resenas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              {provider.reviews.map((review) => (
                <div
                  key={review.name}
                  className="bg-brand-cream border border-brand-orange/10 p-5 rounded-2xl shadow-sm relative flex flex-col justify-between"
                >
                  <Quote className="w-7 h-7 text-brand-orange/10 absolute top-4 right-4" />
                  <div className="space-y-2.5">
                    <div className="flex gap-1 text-brand-yellow">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-brand-brown/85 font-light leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-orange/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand-orange/15 text-brand-orange font-heading font-bold rounded-full flex items-center justify-center text-xs">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-heading text-xs text-brand-brown font-bold leading-none">
                        {review.name}
                      </h4>
                      <span className="text-[9px] text-brand-brown/65 mt-0.5 block">
                        {review.event}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ============ TAB: Ubicación ============ */}
          {activeTab === "ubicacion" && (
            <motion.div
              key="ubicacion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Small secondary map */}
              <div className="relative h-44 sm:h-56 rounded-[2rem] overflow-hidden shadow-md border border-brand-orange/10 bg-brand-orange/5">
                <iframe
                  title={`Ubicación de ${provider.name} en ${provider.city}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${provider.city}, Colombia`
                  )}&z=11&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              {/* Coverage */}
              <div className="bg-brand-cream border border-brand-orange/10 rounded-2xl p-4 space-y-2.5 shadow-sm">
                <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5" />
                  Zona de cobertura
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.coverage.map((zone) => (
                    <span
                      key={zone}
                      className="bg-brand-orange/10 text-brand-orange font-bold text-[11px] px-3 py-1 rounded-full"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-cream border border-brand-orange/10 rounded-2xl p-4 space-y-1.5 shadow-sm">
                  <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Días
                  </h3>
                  <p className="text-xs text-brand-brown/75 font-light">
                    {provider.availability.days}
                  </p>
                </div>
                <div className="bg-brand-cream border border-brand-orange/10 rounded-2xl p-4 space-y-1.5 shadow-sm">
                  <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    Horarios
                  </h3>
                  <p className="text-xs text-brand-brown/75 font-light">
                    {provider.availability.hours}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
