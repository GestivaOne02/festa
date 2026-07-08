"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Gallery() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop",
      title: "Cenas Elegantes",
    },
    {
      url: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop",
      title: "Celebraciones Familiares",
    },
    {
      url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
      title: "Servicios de Bar y Coctelería",
    },
    {
      url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop",
      title: "Bodas y Recepciones",
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      title: "Cumpleaños y Aniversarios",
    },
    {
      url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
      title: "Eventos Empresariales",
    },
  ];

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
                alt={`${image.title} - Fiesta Eventos`}
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
                  <p className="text-[10px] sm:text-xs text-brand-cream/80 font-light">Servicio por Horas Fiesta</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
