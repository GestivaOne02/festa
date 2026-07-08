"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderCard from "@/components/proveedores/ProviderCard";
import CategoryFilter, { FilterValue } from "@/components/proveedores/CategoryFilter";
import JoinBanner from "@/components/proveedores/JoinBanner";
import { mapDbProductToProvider, Provider } from "@/constants/providers";
import { supabase, getEnterpriseCompanyId } from "@/lib/supabase";

export default function ProveedoresPage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Todos");
  const [providersList, setProvidersList] = useState<Array<Provider>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      try {
        const companyId = await getEnterpriseCompanyId();
        if (!companyId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, description, category, image_url')
          .eq('company_id', companyId);

        if (!error && data) {
          const mapped = data.map((item: any) => mapDbProductToProvider(item));
          setProvidersList(mapped);
        }
      } catch (e) {
        console.error('Error cargando proveedores desde Supabase:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  const filteredProviders =
    activeFilter === "Todos"
      ? providersList
      : providersList.filter((p) => p.category === activeFilter);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-brand-cream min-h-screen">
        {/* Page header */}
        <section className="pt-28 md:pt-36 pb-8 md:pb-12 relative">
          {/* Decorative blurred shapes matching landing sections */}
          <div className="absolute top-10 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 left-0 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-3xl mx-auto space-y-3 md:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange font-bold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" />
                Nuestra red de aliados
              </span>
              <h1 className="text-3xl sm:text-5xl font-heading text-brand-brown font-bold">
                Proveedores
              </h1>
              <p className="text-sm sm:text-lg text-brand-brown/80 font-light px-2 sm:px-0">
                Profesionales y empresas aliadas — meseros, cocineros, catering,
                mobiliario y lugares — que prestan sus servicios a través de Fiesta
                con calidad verificada.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters + grid */}
        <section className="pb-14 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
            {/* Category filter chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <CategoryFilter active={activeFilter} onChange={setActiveFilter} />
            </motion.div>

            {/* Loading / Grid / Empty state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-brand-cream rounded-[2rem] border border-brand-orange/5 shadow-sm max-w-lg mx-auto">
                <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-brand-brown/70 font-light">Cargando aliados desde la base de datos...</p>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-16 text-brand-brown/60 text-sm font-light">
                Aún no tenemos proveedores en esta categoría en la base de datos. ¡Vuelve pronto!
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProviders.map((provider: Provider): JSX.Element => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* Join as provider CTA */}
        <section className="pb-14 md:pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <JoinBanner />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
