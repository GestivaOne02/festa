"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, ArrowRight, Sparkles } from "lucide-react";

// Secondary CTA inviting professionals to register as providers
export default function JoinBanner() {
  return (
    <motion.div
      className="bg-gradient-to-r from-brand-orange to-brand-yellow-dark text-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0.1 }}
    >
      {/* Decorative sparkles matching landing CTA */}
      <div className="absolute top-5 right-6 opacity-30 select-none">
        <Handshake className="w-8 h-8 text-white" />
      </div>
      <div className="absolute bottom-5 left-6 opacity-20 select-none">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full">
            <Handshake className="w-3.5 h-3.5" />
            Crece con Fiesta
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold leading-tight">
            ¿Prestas servicios para eventos?
          </h3>
          <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
            Únete como proveedor y llega a cientos de anfitriones que buscan
            meseros, cocineros, catering, mobiliario y lugares cada semana.
          </p>
        </div>

        <Link
          href="/proveedores/registro"
          className="shrink-0 w-full md:w-auto bg-brand-brown text-brand-yellow hover:bg-brand-brown-dark font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Únete como proveedor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
