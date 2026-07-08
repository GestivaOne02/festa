"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="inicio"
      className="relative lg:min-h-[90dvh] pt-24 lg:pt-32 pb-10 lg:pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-orange/5 via-brand-yellow/5 to-transparent"
    >
      {/* Absolute Decorative Floating Elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-brand-yellow/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Hero Left - Text Contents */}
          <motion.div
            className="lg:col-span-7 text-center lg:text-left space-y-4 lg:space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Promo Tag */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              ¡Eventos sin estrés, cotizados por horas!
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-heading text-brand-brown leading-tight"
            >
              Tu fiesta, lista. <br />
              <span className="text-brand-orange relative inline-block">
                Tú solo disfruta
                <svg
                  className="absolute left-0 bottom-[-10px] w-full h-3 text-brand-yellow fill-current"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 25 0, 50 5 T 100 5 L 100 10 L 0 10 Z" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-lg md:text-xl text-brand-brown/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light px-2 sm:px-0"
            >
              Alquila meseros profesionales, cocineros expertos, vajilla reluciente,
              mobiliario y catering exquisito por horas. Diseña tu celebración ideal y
              paga solo por el tiempo que lo necesites.
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <a
                href="#cotizador"
                className="w-fit bg-brand-orange text-white font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-full hover:bg-brand-orange-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Cotizar ahora
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#servicios"
                className="w-fit border-2 border-brand-brown/20 hover:border-brand-orange text-brand-brown font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-full hover:bg-brand-orange/5 transition-all text-sm sm:text-base"
              >
                Ver servicios
              </a>
            </motion.div>

            {/* Highlights */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-brand-brown/70 font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-4.5 h-4.5 text-brand-yellow fill-brand-yellow" />
                <span>Personal verificado</span>
              </div>
              <div className="w-1.5 h-1.5 bg-brand-orange/40 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Star className="w-4.5 h-4.5 text-brand-yellow fill-brand-yellow" />
                <span>Atención premium 24/7</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right - Animated Composition */}
          <motion.div
            className="hidden lg:flex lg:col-span-5 relative items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          >
            {/* Background Decorative Blobs */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-brand-yellow rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse" />

            {/* Main Visual Composition */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-[2rem] overflow-hidden border-4 border-brand-orange/20 shadow-2xl bg-brand-cream">
              <Image
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop"
                alt="Celebración y fiesta alegre organizada con servicios Fiesta"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/60 via-transparent to-transparent" />

              {/* Waiter Floating Badge */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-brand-cream/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-brand-orange/15 flex items-center gap-3"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange text-lg">
                  🍹
                </div>
                <div>
                  <h4 className="font-heading text-sm text-brand-brown font-bold leading-tight">Servicio Impecable</h4>
                  <p className="text-xs text-brand-brown/70 mt-0.5">Disfruta tu fiesta, nosotros nos encargamos</p>
                </div>
              </motion.div>
            </div>

            {/* Confetti Micro-Animations */}
            <motion.div
              className="absolute -top-6 -right-6 w-16 h-16 bg-brand-yellow text-brand-brown font-bold flex items-center justify-center rounded-full shadow-lg text-2xl rotate-12 cursor-pointer"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              🎉
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6 w-14 h-14 bg-brand-orange text-white font-bold flex items-center justify-center rounded-full shadow-lg text-xl -rotate-12 cursor-pointer"
              whileHover={{ rotate: -360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              🎂
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
