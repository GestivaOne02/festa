"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Configurator from "@/components/Configurator";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="overflow-hidden pb-24 md:pb-0">
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
        <section className="py-10 md:py-20 bg-dark-bg relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="bg-gradient-to-r from-primary-gold to-primary-gold-dark text-white rounded-none p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.1 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mt-4">
                <Sparkles className="w-3.5 h-3.5 fill-primary-gold text-primary-gold" />
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
                  className="w-full sm:w-auto bg-transparent border border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-none transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <span>Empieza a Cotizar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-white border border-white text-primary-gold-dark hover:bg-white/90 font-bold px-8 py-4 rounded-none transition-colors text-sm flex items-center justify-center gap-1"
                >
                  Hablar con un asesor
                </a>
              </div>

              {/* FAQ Dropdown Animado */}
              <div className="pt-8 mx-auto max-w-2xl text-left">
                <div className="group border border-white/20 bg-white/5 cursor-pointer rounded-none">
                  <div className="flex justify-between items-center p-4">
                    <span className="text-white font-bold tracking-wide">Preguntas Frecuentes</span>
                    <ChevronDown className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-180" />
                  </div>
                  <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-[500px]">
                    <div className="p-4 pt-0 space-y-4">
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white font-semibold text-sm">¿Tienen un mínimo de horas requeridas?</p>
                        <p className="text-white/70 text-xs mt-1">Sí, el mínimo de contratación para nuestro personal y equipo es de 4 horas para asegurar la mejor calidad de servicio.</p>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white font-semibold text-sm">¿Qué incluye el servicio de meseros?</p>
                        <p className="text-white/70 text-xs mt-1">Nuestros meseros asisten en la atención a mesas, distribución de alimentos, montaje básico y limpieza de sus áreas de trabajo.</p>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white font-semibold text-sm">¿Puedo modificar mi reserva después de pagar?</p>
                        <p className="text-white/70 text-xs mt-1">Puedes hacer ajustes hasta 48 horas antes de tu evento contactando a tu asesor asignado por WhatsApp.</p>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white font-semibold text-sm">¿El transporte del mobiliario tiene costo extra?</p>
                        <p className="text-white/70 text-xs mt-1">El envío básico está incluido en el área metropolitana. Zonas alejadas pueden tener un recargo mínimo que se notificará en tu cotización final.</p>
                      </div>
                    </div>
                  </div>
                </div>
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
