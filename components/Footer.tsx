"use client";

import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import Logo from "./ui/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-secondary-white text-dark-bg pt-12 md:pt-20 pb-24 md:pb-8 border-t border-primary-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-y-8 gap-x-4 md:gap-12 pb-8 md:pb-16 border-b border-dark-bg/10">
          
          {/* Column 1: Info (col-span-12 md:col-span-5) */}
          <div className="col-span-12 md:col-span-5 space-y-4">
            <Link href="/#inicio">
              {/* Waiter logo with white/orange override details */}
              <div className="inline-block bg-dark-bg/5 px-4 py-1.5 rounded-2xl border border-dark-bg/10 scale-90 origin-left">
                <Logo darkText />
              </div>
            </Link>
            <p className="text-xs md:text-sm text-dark-bg/70 font-light leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
              Fiesta facilita la planeación de tus celebraciones en Colombia, 
              conectándote con meseros, cocineros, alquiler de vajilla, mobiliario 
              y catering por las horas exactas de tu evento.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-dark-bg/10 hover:bg-primary-gold text-dark-bg hover:text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram de Fiesta"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-dark-bg/10 hover:bg-primary-gold text-dark-bg hover:text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook de Fiesta"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-6 md:col-span-3) */}
          <div className="col-span-6 md:col-span-3 space-y-3">
            <h4 className="font-heading text-xs md:text-base font-bold text-primary-gold uppercase tracking-wider md:normal-case">Servicios</h4>
            <ul className="space-y-2 text-xs md:text-sm text-dark-bg/75 font-light">
              <li><a href="/#servicios" className="hover:text-primary-gold transition-colors block py-0.5">Meseros por Horas</a></li>
              <li><a href="/#servicios" className="hover:text-primary-gold transition-colors block py-0.5">Cocineros Profesionales</a></li>
              <li><a href="/#servicios" className="hover:text-primary-gold transition-colors block py-0.5">Utensilios y Vajilla</a></li>
              <li><a href="/#servicios" className="hover:text-primary-gold transition-colors block py-0.5">Mesas y Mobiliario</a></li>
              <li><a href="/#servicios" className="hover:text-primary-gold transition-colors block py-0.5">Catering de Comida</a></li>
              <li><Link href="/proveedores" className="hover:text-primary-gold transition-colors block py-0.5">Nuestros Proveedores</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info (col-span-6 md:col-span-4) */}
          <div className="col-span-6 md:col-span-4 space-y-3">
            <h4 className="font-heading text-xs md:text-base font-bold text-primary-gold uppercase tracking-wider md:normal-case">Contacto</h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-dark-bg/75 font-light">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <span>+57 (000) 000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <span className="break-all">contacto@tudominio.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <span>Ciudad, País</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-dark-bg/40 border-t border-dark-bg/5 mt-8 md:mt-0 md:border-t-0 md:pt-8">
          <p className="text-center md:text-left">© {currentYear} Fiesta. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a href="#" className="hover:underline">Políticas de Privacidad</a>
            <span>·</span>
            <a href="#" className="hover:underline">Términos del Servicio</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
