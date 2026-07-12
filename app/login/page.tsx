"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication Submission Handler (ready to connect with backend)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Connect with NextAuth / Firebase / custom auth endpoint
      // console.log("Logging in with:", { email, password });
      
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      alert("¡Inicio de sesión simulado con éxito!");
    } catch (error) {
      // console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-between py-10 relative overflow-hidden font-body text-secondary-white">
      
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-primary-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Login Card */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 relative z-10">
        <motion.div
          className="w-full max-w-[460px] bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 sm:p-12 rounded-none shadow-2xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
        >
          
          {/* Logo Center */}
          <div className="flex justify-center pb-2 opacity-90">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-heading text-white font-bold tracking-wide">
              ¡Hola de nuevo!
            </h1>
            <p className="text-sm text-white/60 font-light">
              Ingresa tus datos para gestionar tus cotizaciones y fiestas.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-bold text-white/70 uppercase tracking-widest block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-white/40 absolute left-4 top-3.5" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 focus:border-primary-gold focus:bg-black/40 rounded-none focus:outline-none placeholder-white/30 text-white text-sm transition-all font-light"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[10px] font-bold text-white/70 uppercase tracking-widest block">
                  Contraseña
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Enlace para restablecer contraseña simulado.");
                  }}
                  className="text-[10px] text-primary-gold hover:text-white transition-colors uppercase tracking-wider"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-white/40 absolute left-4 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-black/20 border border-white/10 focus:border-primary-gold focus:bg-black/40 rounded-none focus:outline-none placeholder-white/30 text-white text-sm transition-all font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-white/40 hover:text-primary-gold absolute right-4 top-3.5 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-gold hover:bg-[#a88d6a] text-white font-bold py-4 rounded-none shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-wait tracking-widest uppercase text-xs"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>

          {/* Create account suggestion */}
          <div className="text-center text-xs text-white/60">
            ¿Aún no tienes cuenta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Creación de cuenta simulada.");
              }}
              className="text-primary-gold hover:text-white transition-colors font-bold"
            >
              Crear cuenta ahora
            </a>
          </div>

        </motion.div>
      </div>

      {/* Footer text */}
      <div className="text-center text-[10px] text-white/40 px-4 tracking-widest relative z-10 uppercase">
        © {new Date().getFullYear()} Fiesta. Todos los derechos reservados.
      </div>

    </div>
  );
}
