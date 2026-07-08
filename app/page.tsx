"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Configurator from "@/components/Configurator";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="overflow-hidden">
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2. Services Grid */}
        <Services />

        {/* 3. Budget Calculator estimator (Estimator signature widget) */}
        <Configurator />

        {/* 4. Steps - How it works */}
        <HowItWorks />

        {/* 5. Gallery Grid */}
        <Gallery />

        {/* 6. Client Testimonials */}
        <Testimonials />

        {/* 7. Final Call to Action Banner */}
        <section className="py-10 md:py-20 bg-brand-cream relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-gradient-to-r from-brand-orange to-brand-yellow-dark text-white rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.1 }}
            >
              {/* Decorative sparkle */}
              <div className="absolute top-6 left-6 text-2xl opacity-30 select-none">🎉</div>
              <div className="absolute bottom-6 right-6 text-2xl opacity-30 select-none">✨</div>

              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" />
                Tu próximo evento sin preocupaciones
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold max-w-2xl mx-auto leading-tight">
                ¿Listo para armar la fiesta perfecta?
              </h2>

              <p className="text-sm sm:text-md text-white/90 max-w-xl mx-auto font-light leading-relaxed">
                Cotiza tus meseros, vajilla, mobiliario y comida en minutos. 
                Paga solo por el tiempo exacto que necesites, sin cargos ocultos.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#cotizador"
                  className="w-full sm:w-auto bg-brand-brown text-brand-yellow hover:bg-brand-brown-dark font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Empieza a Cotizar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-4 rounded-full transition-all text-sm flex items-center justify-center gap-1"
                >
                  Hablar con un asesor
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
