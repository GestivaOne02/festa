"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  FileText,
  ImagePlus,
  X,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { PROVIDER_CATEGORIES } from "@/constants/providers";

// Shared input styles matching the login form
const inputClass =
  "w-full pl-12 pr-4 py-3.5 bg-brand-orange/[0.02] border border-brand-orange/15 focus:border-brand-orange focus:bg-white rounded-2xl focus:outline-none placeholder-brand-brown/40 text-brand-brown text-sm transition-all";

interface FormData {
  name: string;
  category: string;
  city: string;
  phone: string;
  email: string;
  priceHour: string;
  description: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  category: "",
  city: "",
  phone: "",
  email: "",
  priceHour: "",
  description: "",
};

export default function RegistroProveedorPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submission handler (ready to connect with backend later)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Connect with API endpoint / server action, e.g.:
      // await fetch("/api/proveedores/registro", {
      //   method: "POST",
      //   body: JSON.stringify(form),
      // });

      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (error) {
      // console.error("Provider registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Photo upload is UI-only for now
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload file to storage (S3 / Cloudinary / Supabase) when backend is ready
      setPhotoName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col justify-between py-10 relative overflow-hidden">
      {/* Back to providers list */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/proveedores"
          className="flex items-center gap-2 text-brand-brown hover:text-brand-orange font-bold text-sm transition-colors bg-brand-orange/5 hover:bg-brand-orange/10 px-4 py-2 rounded-full border border-brand-orange/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver a proveedores</span>
          <span className="sm:hidden">Volver</span>
        </Link>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      {/* Centered card */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 pt-14 sm:pt-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ============ Success state ============ */
            <motion.div
              key="success"
              className="w-full max-w-[520px] bg-brand-cream border border-brand-orange/10 p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-center space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 bg-brand-orange text-white rounded-full flex items-center justify-center mx-auto shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
              >
                <PartyPopper className="w-9 h-9" />
              </motion.div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-heading text-brand-brown font-bold">
                  ¡Recibimos tu solicitud!
                </h1>
                <p className="text-sm text-brand-brown/70 font-light leading-relaxed max-w-sm mx-auto">
                  Gracias por querer ser parte de la red de proveedores de Fiesta.
                  Nuestro equipo revisará tu información y te contactaremos pronto
                  al correo y teléfono que registraste.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-brand-brown/60 bg-brand-orange/5 rounded-2xl py-3 px-4">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Tiempo estimado de respuesta: 2 a 3 días hábiles</span>
              </div>

              <Link
                href="/proveedores"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white font-bold px-8 py-3.5 rounded-full hover:bg-brand-orange-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a proveedores
              </Link>
            </motion.div>
          ) : (
            /* ============ Registration form ============ */
            <motion.div
              key="form"
              className="w-full max-w-[560px] bg-brand-cream border border-brand-orange/10 p-8 sm:p-10 rounded-[2.5rem] shadow-xl space-y-7 my-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex justify-center pb-1">
                <Link href="/">
                  <Logo />
                </Link>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-heading text-brand-brown font-bold">
                  Únete como proveedor
                </h1>
                <p className="text-sm text-brand-brown/70 font-light">
                  Regístrate y llega a cientos de anfitriones que buscan tus
                  servicios para sus eventos.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name / company */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-brand-brown/85 block">
                    Nombre completo o empresa <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Ej: Carlos Mendoza o Sabor & Fuego"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Category + city */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="text-xs font-semibold text-brand-brown/85 block">
                      Categoría de servicio <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5 pointer-events-none" />
                      <select
                        id="category"
                        required
                        value={form.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer ${
                          form.category === "" ? "text-brand-brown/40" : ""
                        }`}
                      >
                        <option value="" disabled>
                          Selecciona una categoría
                        </option>
                        {PROVIDER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="text-brand-brown">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="city" className="text-xs font-semibold text-brand-brown/85 block">
                      Ciudad <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                      <input
                        id="city"
                        type="text"
                        required
                        placeholder="Ej: Medellín"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-brand-brown/85 block">
                      Teléfono <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                      <input
                        id="phone"
                        type="tel"
                        required
                        pattern="[0-9+ ]{7,15}"
                        title="Ingresa un número de teléfono válido"
                        placeholder="300 123 4567"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-brand-brown/85 block">
                      Correo electrónico <span className="text-brand-orange">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Approximate price per hour */}
                <div className="space-y-1.5">
                  <label htmlFor="priceHour" className="text-xs font-semibold text-brand-brown/85 block">
                    Precio por hora aproximado (COP) <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                    <input
                      id="priceHour"
                      type="number"
                      required
                      min={1000}
                      step={1000}
                      placeholder="Ej: 30000"
                      value={form.priceHour}
                      onChange={(e) => updateField("priceHour", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-semibold text-brand-brown/85 block">
                    ¿Qué ofreces? <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                    <textarea
                      id="description"
                      required
                      rows={3}
                      placeholder="Cuéntanos sobre tu servicio, experiencia y qué te hace especial..."
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Photo upload (UI only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-brown/85 block">
                    Foto de perfil o logo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photoName ? (
                    <div className="flex items-center justify-between gap-3 bg-brand-orange/5 border border-brand-orange/15 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <ImagePlus className="w-4 h-4 text-brand-orange shrink-0" />
                        <span className="text-xs text-brand-brown truncate">{photoName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoName(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-1 rounded-full text-brand-brown/40 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors shrink-0"
                        aria-label="Quitar foto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-brand-orange/25 hover:border-brand-orange hover:bg-brand-orange/5 rounded-2xl py-5 text-brand-brown/60 hover:text-brand-orange text-xs font-semibold transition-all"
                    >
                      <ImagePlus className="w-5 h-5" />
                      Haz clic para subir tu foto (JPG o PNG)
                    </button>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Enviar solicitud</span>
                  )}
                </button>
              </form>

              {/* Note */}
              <p className="text-center text-[11px] text-brand-brown/55 font-light leading-relaxed">
                Al enviar tu solicitud aceptas que el equipo de Fiesta te contacte
                para validar tu información y activar tu perfil.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-brand-brown/50 px-4 pt-6">
        © {new Date().getFullYear()} Fiesta. Todos los derechos reservados.
      </div>
    </div>
  );
}
