"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ease out
      },
    },
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[90dvh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/FESTA_background.png"
          alt="Banquete de evento de lujo al aire libre"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/70 to-transparent" />
        <div className="absolute inset-0 bg-dark-bg/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Text Content aligned to the left */}
          <motion.div
            className="text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Promo Tag */}
            <motion.div
              variants={itemVariants}
              className="font-body text-xs md:text-sm uppercase tracking-[0.2em] text-primary-gold font-semibold"
            >
              Creamos momentos inolvidables
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-heading text-secondary-white leading-tight"
            >
              EVENTOS <br />
              EXTRAORDINARIOS
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-secondary-gray max-w-md leading-relaxed font-light"
            >
              Diseñamos experiencias únicas con atención al detalle,
              elegancia y un servicio impecable.
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <a
                href="#cotizador"
                className="inline-flex items-center justify-center gap-2 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-dark-bg transition-colors duration-300 font-body text-xs md:text-sm uppercase tracking-wider px-8 py-4"
              >
                Descubre nuestros eventos
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
