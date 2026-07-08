"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderInfoPanel from "@/components/proveedores/ProviderInfoPanel";
import ProviderShowcase from "@/components/proveedores/ProviderShowcase";
import { getProviderById } from "@/constants/providers";

// Provider detail: fixed two-column, full-viewport layout on desktop
// (no page scroll — each column scrolls internally only if needed).
// On mobile the columns stack and the page scrolls normally.
export default function ProveedorDetallePage() {
  const params = useParams<{ id: string }>();
  const provider = getProviderById(params.id);

  // Not found state
  if (!provider) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 text-center space-y-4">
          <span className="text-5xl select-none">🔍</span>
          <h1 className="text-2xl sm:text-3xl font-heading text-brand-brown font-bold">
            Proveedor no encontrado
          </h1>
          <p className="text-sm text-brand-brown/70 font-light max-w-md">
            El proveedor que buscas no existe o ya no está disponible en nuestra red.
          </p>
          <Link
            href="/proveedores"
            className="flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-dark shadow-md hover:-translate-y-0.5 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proveedores
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Desktop: exact viewport height, no page scroll. Mobile: normal flow. */}
      <main className="bg-brand-cream lg:h-[100dvh] lg:overflow-hidden lg:flex lg:flex-col">
        <div className="pt-[88px] lg:flex-1 lg:min-h-0 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr,3fr]">
          {/* Left (~40%): provider info card */}
          <ProviderInfoPanel provider={provider} />

          {/* Right (~60%): offer showcase with tabs (Oferta | Reseñas | Ubicación) */}
          <ProviderShowcase provider={provider} />
        </div>
      </main>

      {/* Footer only on mobile — desktop is a single fixed view */}
      <div className="lg:hidden">
        <Footer />
      </div>
    </>
  );
}
