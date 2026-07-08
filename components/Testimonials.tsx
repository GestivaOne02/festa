"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

type Testimonial = {
  name: string;
  event: string;
  text: string;
  rating: number;
};

export default function Testimonials() {
  // Lista vacía para servir como plantilla (template). Añadir opiniones reales de clientes aquí.
  const testimonials: Array<Testimonial> = [];

  return (
    <section className="pt-14 pb-10 md:py-24 bg-brand-orange/5 relative overflow-hidden">
      {/* Decorative vector shape background */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3 md:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-heading text-brand-brown">
            Opiniones de Nuestros Anfitriones
          </h2>
          <p className="text-sm sm:text-lg text-brand-brown/80 font-light px-2 sm:px-0">
            Mira lo que opinan quienes ya han vivido la experiencia de organizar sus eventos.
          </p>
        </div>

        {/* Testimonials Grid / Mobile Carousel */}
        {testimonials.length === 0 ? (
          <div className="text-center p-8 sm:p-12 bg-brand-cream border border-brand-orange/10 rounded-[2.5rem] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="text-3xl">⭐</div>
            <h3 className="font-heading text-lg text-brand-brown font-bold">Opiniones de clientes</h3>
            <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light">
              Aún no hay opiniones registradas. Los testimonios reales de tus clientes se mostrarán aquí una vez configurados en el componente.
            </p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-6 px-4 -mx-4 md:px-0 md:mx-0">
            {testimonials.map((test, index) => (
              <motion.div
                key={index}
                className="bg-brand-cream border border-brand-orange/10 p-6 sm:p-8 rounded-[2rem] shadow-sm relative flex flex-col justify-between snap-center shrink-0 w-[80vw] max-w-[300px] md:w-auto md:max-w-none md:shrink"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -4 }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-brand-orange/10 absolute top-5 right-5" />

                <div className="space-y-3 sm:space-y-4">
                  {/* Stars */}
                  <div className="flex gap-1 text-brand-yellow">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-xs sm:text-sm text-brand-brown/85 font-light leading-relaxed italic line-clamp-4 sm:line-clamp-none">
                    "{test.text}"
                  </p>
                </div>

                {/* User Bio */}
                <div className="mt-5 sm:mt-6 pt-4 border-t border-brand-orange/10 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-orange/15 text-brand-orange font-heading font-bold rounded-full flex items-center justify-center text-sm">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-heading text-xs sm:text-sm text-brand-brown font-bold leading-none">
                      {test.name}
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-brand-brown/65 mt-1 block">
                      {test.event}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
