"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Gallery() {
  interface GalleryImage {
    url: string;
    title: string;
  }

  // Lista vacía para servir como plantilla (template). Añadir imágenes reales aquí.
  const images: GalleryImage[] = [];

  return (
    <section id="galeria" className="pt-14 pb-10 md:py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-heading text-brand-brown">
            Momentos Inolvidables
          </h2>
          <p className="text-sm sm:text-lg text-brand-brown/80 font-light px-2 sm:px-0">
            Una pequeña muestra de los eventos y celebraciones que hemos ayudado a crear.
          </p>
        </div>

        {/* Gallery Grid / Mobile Carousel */}
        {images.length === 0 ? (
          <div className="text-center p-8 sm:p-12 bg-brand-cream border border-brand-orange/10 rounded-[2.5rem] max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="text-3xl">📸</div>
            <h3 className="font-heading text-lg text-brand-brown font-bold">Galería de fotos</h3>
            <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light">
              Aún no hay fotos registradas en la galería. Las imágenes del portafolio se mostrarán aquí una vez configuradas en el componente.
            </p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-6 px-4 -mx-4 md:px-0 md:mx-0">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="relative h-60 md:h-64 rounded-[2rem] overflow-hidden border-2 border-brand-orange/5 shadow-md group cursor-pointer snap-center shrink-0 w-[78vw] max-w-[280px] md:w-auto md:max-w-none md:shrink"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Image
                  src={image.url}
                  alt={`${image.title} - Eventos`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-w-768px) 80vw, 33vw"
                />
                
                {/* Overlay on hover / visible always on mobile for context */}
                <div className="absolute inset-0 bg-brand-brown/40 md:bg-brand-brown/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <div className="text-center space-y-1.5 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block text-brand-yellow text-xs sm:text-sm">✨</span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                      {image.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-brand-cream/80 font-light">Servicio por Horas</p>
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
