import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { SERVICES, Service } from "@/constants/services";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    // Calculate index based on card widths
    const cardWidth = container.scrollWidth / SERVICES.length;
    const index = Math.round(scrollPosition / cardWidth);
    if (index >= 0 && index < SERVICES.length) {
      setActiveIndex(index);
    }
  };

  return (
    <section id="servicios" className="pt-14 pb-10 md:py-24 bg-brand-cream relative">
      {/* Decorative vector shape background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3 md:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-heading text-brand-brown">
            Nuestros Servicios por Horas
          </h2>
          <p className="text-sm sm:text-lg text-brand-brown/80 font-light px-2 sm:px-0">
            Arma tu fiesta eligiendo solo lo que necesitas. Todo nuestro personal cuenta con certificación y gran calidez en atención.
          </p>
        </div>

        {/* Services Card Grid / Carousel wrapper */}
        <motion.div
          id="services-carousel"
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-6 px-4 -mx-4 md:px-0 md:mx-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {SERVICES.map((service: Service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="bg-brand-cream border border-brand-orange/10 hover:border-brand-orange rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group snap-center shrink-0 w-[80vw] max-w-[300px] md:w-auto md:max-w-none md:shrink"
              whileHover={{ y: -6 }}
            >
              <div>
                {/* Image Wrap */}
                <div className="relative h-40 sm:h-56 w-full overflow-hidden bg-brand-orange/10 aspect-[16/10] sm:aspect-auto">
                  <Image
                    src={service.imageUrl}
                    alt={`${service.title} - Servicio profesional de Fiesta en Colombia`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-w-768px) 80vw, 33vw"
                  />
                  {/* Price Tag overlay */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-brand-brown text-brand-yellow font-heading font-bold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md">
                    <span className="font-mono">{formatCOP(service.priceHour)}</span>
                    <span className="text-[9px] sm:text-[10px] font-body text-brand-cream/80 ml-1">/ {service.unit.split(" / ")[0]}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8 space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-heading text-brand-brown group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-brown/80 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                    {service.description}
                  </p>
                  
                  {/* Bullet features */}
                  <ul className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
                    {service.features.slice(0, 3).map((feat, index) => (
                      <li key={index} className="flex items-start gap-2 text-[10px] sm:text-xs text-brand-brown/75">
                        <Check className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 sm:p-8 pt-0">
                <a
                  href="#cotizador"
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all group/btn text-xs sm:text-sm"
                >
                  <span>Configurar servicio</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Carousel indicator dots (mobile only) */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {SERVICES.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-brand-orange w-4" : "bg-brand-orange/20"
              }`}
              onClick={() => {
                const container = document.getElementById("services-carousel");
                if (container) {
                  const cardWidth = container.scrollWidth / SERVICES.length;
                  container.scrollTo({
                    left: cardWidth * index,
                    behavior: "smooth",
                  });
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

