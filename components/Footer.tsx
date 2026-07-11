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
                href="https://www.instagram.com/fiestacelebracionylogistica?igsh=MWN5d25yMWo3ZzFiOQ=="
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-dark-bg/10 hover:bg-primary-gold text-dark-bg hover:text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram de Fiesta"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.facebook.com/share/1D43QAmUr2/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-dark-bg/10 hover:bg-primary-gold text-dark-bg hover:text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook de Fiesta"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.gestivaone.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-dark-bg/10 hover:bg-[#7c3aee] text-dark-bg hover:text-white rounded-full flex items-center justify-center transition-colors p-2"
                aria-label="GestivaOne"
                title="GestivaOne"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 267.49 259.62" className="w-full h-full" fill="currentColor">
                  <path d="M205.88,163.76c-8.76,0-17.24-.03-25.72,0-13.89.07-27.78.23-41.67.26-11.68.03-21.43-9.19-22.13-20.8-.72-11.98,7.91-22.5,19.59-23.94,2.05-.25,4.1-.25,6.15-.25,33.74,0,67.47,0,101.21.02,13.74.01,24.13,10.28,24.15,23.97.04,29.36.03,58.71,0,88.07,0,9.44-6.01,17.45-14.79,19.97-8.54,2.44-17.87-1.06-22.76-8.64-2.41-3.73-3.3-7.88-3.15-12.32.22-6.22.33-12.44.47-18.67.02-1.02,0-2.04,0-3.57-.93,1.24-1.61,2.13-2.26,3.02-15.06,20.7-35.25,34.26-59.32,42.28-15.14,5.05-30.77,7.12-46.69,6.23-12.07-.67-21.12-10.67-20.66-22.27.48-12.37,10.44-21.97,22.77-21.7,9.35.2,18.62-.2,27.66-2.77,25.64-7.3,44.44-22.86,56.26-46.8.3-.6.52-1.24.89-2.12Z"/>
                  <path d="M0,131.1c.51-28.99,9.51-55.09,27.25-78.02C49.13,24.78,77.72,7.39,113.11,1.69c26.48-4.26,51.9-.46,76.12,11.13,7,3.35,13.63,7.38,19.65,12.23,14.34,11.56,12.29,32.19-3.24,39.45-8.53,3.98-16.74,2.55-24.17-2.95-10.16-7.52-21.19-13.2-33.7-15.31-28.13-4.75-52.9,2.75-74.11,21.62-15.73,14-24.75,31.77-27.73,52.6-1.09,7.63-.94,15.29-.09,22.93,1.16,10.5-5.68,20.93-15.91,24.02-10.01,3.02-21.33-1.79-26.15-11.16-1.61-3.13-2.54-6.46-2.87-9.99-.46-5.04-.91-10.08-.91-15.17Z"/>
                  <path d="M77.11,214.61c-1.21,15.51-14.09,27.24-28.65,26.22-15.53-1.09-26.83-13.91-26-28.84.89-16.06,14.21-27.46,30.07-26.03,14.8,1.34,25.24,14.39,24.58,28.64Z"/>
                </svg>
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
                <span>+57 317 3823814</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <span className="break-all">gustavoadolfogrisalesmercado@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-gold shrink-0 mt-0.5" />
                <span>Barranquilla, Atlántico</span>
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
