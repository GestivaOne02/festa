"use client";

import { motion } from "framer-motion";
import { MessageSquare, ClipboardList, Truck, PartyPopper } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Cuéntanos tu evento",
      description: "Define la fecha, duración y número de invitados de tu celebración. No importa si es grande o pequeña.",
    },
    {
      number: "02",
      icon: ClipboardList,
      title: "Elige tus servicios",
      description: "Agrega meseros, vajilla, cocineros o catering por el tiempo exacto. Paga solo lo que necesitas.",
    },
    {
      number: "03",
      icon: Truck,
      title: "Nosotros nos encargamos",
      description: "Llevamos todo el mobiliario, utensilios y nuestro personal profesional llega puntual a armar y servir.",
    },
    {
      number: "04",
      icon: PartyPopper,
      title: "Disfruta tu fiesta",
      description: "Dedícate a ser el anfitrión perfecto y pasarla increíble con tus invitados. Nosotros desmontamos al terminar.",
    },
  ];

  return (
    <section id="como-funciona" className="pt-14 pb-10 md:py-24 bg-primary-gold/5 relative overflow-hidden">
      {/* Decorative wave divider */}
      <div className="absolute top-0 left-0 w-full h-8 bg-dark-bg" style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3 md:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-heading text-secondary-white">
            Cómo funciona Fiesta
          </h2>
          <p className="text-sm sm:text-lg text-secondary-white/80 font-light px-2 sm:px-0">
            Armar tu evento es tan sencillo como hacer unos cuantos clics. Nos encargamos de todo el trabajo pesado.
          </p>
        </div>

        {/* Step Cards Grid / Timeline */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[90px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-primary-gold/30 -z-10" />

          {/* Desktop Grid Layout (hidden on mobile < md) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="bg-dark-bg border border-primary-gold/5 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center space-y-4 relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    delay: index * 0.15,
                  }}
                  whileHover={{ y: -5 }}
                >
                  {/* Step Number Badge */}
                  <span className="absolute top-4 right-6 text-xs font-mono font-bold text-primary-gold bg-primary-gold/10 px-2.5 py-1 rounded-full">
                    Paso {step.number}
                  </span>

                  {/* Icon Frame */}
                  <div className="w-16 h-16 bg-primary-gold text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold text-secondary-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-secondary-white/70 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline Layout (hidden on desktop >= md) */}
          <div className="md:hidden flex flex-col gap-6 relative pl-6">
            {/* Vertical dotted connector line */}
            <div className="absolute left-[19px] top-2 bottom-8 w-0.5 border-l-2 border-dashed border-primary-gold/30 -z-10" />

            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="flex items-start gap-4 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Step Icon circle (acts as timeline node) */}
                  <div className="w-10 h-10 bg-primary-gold text-white rounded-full flex items-center justify-center shadow-md shrink-0 z-10">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content card */}
                  <div className="bg-dark-bg border border-primary-gold/5 p-5 rounded-2xl shadow-sm w-full space-y-1.5 relative">
                    <span className="text-[9px] font-mono font-bold text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded-full absolute top-4 right-4">
                      Paso {step.number}
                    </span>
                    <h3 className="font-heading text-base font-bold text-secondary-white pr-12">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-secondary-white/70 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
