// @ts-nocheck
/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Service } from "@/constants/services";
import { supabase, getEnterpriseCompanyId } from "@/lib/supabase";

interface DbProduct {
  id: string;
  name: string;
  price: string | number;
  description: string;
}

export default function Services() {
  const [servicesList, setServicesList] = useState<Array<Service>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const companyId = await getEnterpriseCompanyId();
        if (!companyId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, description')
          .eq('company_id', companyId)
          .eq('unit', 'HORA');

        if (!error && data) {
          const mapped = (data as DbProduct[]).map((item: DbProduct) => {
            let descObj: { description?: string; features?: string[]; imageUrl?: string } = {};
            try {
              descObj = JSON.parse(item.description || '{}');
            } catch (e) {
              descObj = { description: item.description || '' };
            }
            return {
              id: item.id,
              title: item.name,
              priceHour: Number(item.price),
              unit: "HORA",
              description: descObj.description || item.description || "Servicio profesional por horas",
              features: descObj.features || ["Servicio verificado", "Excelente calidad", "Soporte premium"],
              imageUrl: descObj.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
            };
          });
          setServicesList(mapped);
        }
      } catch (err) {
        console.error('Error cargando servicios desde Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    hidden: { opacity: 0, y: 20 },
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

  const formatCOP = (num: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="servicios" className="py-12 md:py-20 bg-dark-bg relative border-t border-primary-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="font-body text-xs md:text-sm uppercase tracking-[0.2em] text-primary-gold">
            Nuestros Eventos
          </p>
          <h2 className="text-3xl md:text-5xl font-heading text-secondary-white uppercase">
            Experiencias que inspiran
          </h2>
          <div className="flex items-center justify-center pt-2">
             <div className="w-16 h-[1px] bg-primary-gold/50" />
             <div className="w-2 h-2 rotate-45 border border-primary-gold mx-2" />
             <div className="w-16 h-[1px] bg-primary-gold/50" />
          </div>
        </div>

        {/* Filters placeholder */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 font-body text-xs uppercase tracking-widest text-secondary-gray">
          <span className="text-secondary-white border border-secondary-white/30 px-4 py-1.5 rounded-full cursor-pointer">Todos</span>
          <span className="hover:text-secondary-white cursor-pointer transition-colors">Bodas</span>
          <span className="hover:text-secondary-white cursor-pointer transition-colors">Eventos Corporativos</span>
          <span className="hover:text-secondary-white cursor-pointer transition-colors">Fiestas Privadas</span>
          <span className="hover:text-secondary-white cursor-pointer transition-colors">Otros</span>
        </div>

        {/* Services Card Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-body text-secondary-gray tracking-widest uppercase">Cargando...</p>
          </div>
        ) : servicesList.length === 0 ? (
          <div className="text-center py-20 border border-primary-gold/20 p-8 max-w-xl mx-auto space-y-4">
            <h3 className="font-heading text-2xl text-secondary-white">Sin servicios</h3>
            <p className="text-sm font-body text-secondary-gray leading-relaxed">
              No se encontraron servicios configurados por horas en tu base de datos de GestivaOne.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {servicesList.map((service: Service): JSX.Element => (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  className="group bg-dark-bg border border-secondary-gray/20 rounded-lg overflow-hidden flex flex-col hover:border-primary-gold/50 transition-colors duration-500"
                >
                  {/* Image Wrap */}
                  <div className="relative w-full aspect-square overflow-hidden bg-black/50">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-dark-bg/80 backdrop-blur-sm border border-secondary-gray/30 text-secondary-white font-body text-[9px] uppercase tracking-widest px-2 py-1">
                      {service.unit}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-heading text-secondary-white uppercase tracking-wide mb-3 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-xs font-body text-secondary-gray leading-relaxed flex-grow line-clamp-3 mb-6">
                      {service.description}
                    </p>
                    
                    {/* Action Footer */}
                    <div className="mt-auto flex items-center justify-between">
                      <a
                        href="#cotizador"
                        className="flex items-center gap-2 font-body text-[10px] text-primary-gold font-semibold uppercase tracking-widest group/btn"
                      >
                        Ver detalles
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                      <span className="font-body text-[10px] text-secondary-white/50 tracking-wider">
                        {formatCOP(service.priceHour)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-16 flex justify-center">
              <a
                href="#cotizador"
                className="border border-secondary-gray/50 text-secondary-white hover:border-primary-gold hover:text-primary-gold transition-colors duration-300 px-8 py-3 font-body text-xs uppercase tracking-widest"
              >
                Ver todos los eventos
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
