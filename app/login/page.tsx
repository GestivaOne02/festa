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
    <div className="min-h-screen bg-brand-cream flex flex-col justify-between py-10 relative overflow-hidden">
      
      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-brown hover:text-brand-orange font-bold text-sm transition-colors bg-brand-orange/5 hover:bg-brand-orange/10 px-4 py-2 rounded-full border border-brand-orange/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

      {/* Centered Login Card */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6">
        <motion.div
          className="w-full max-w-[460px] bg-brand-cream border border-brand-orange/10 p-8 sm:p-10 rounded-[2.5rem] shadow-xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
        >
          
          {/* Logo Center */}
          <div className="flex justify-center pb-2">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-heading text-brand-brown font-bold">
              ¡Hola de nuevo!
            </h1>
            <p className="text-sm text-brand-brown/70 font-light">
              Ingresa tus datos para gestionar tus cotizaciones y fiestas.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-brand-brown/85 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-brand-orange/[0.02] border border-brand-orange/15 focus:border-brand-orange focus:bg-white rounded-2xl focus:outline-none placeholder-brand-brown/40 text-brand-brown text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-brand-brown/85 block">
                  Contraseña
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Enlace para restablecer contraseña simulado.");
                  }}
                  className="text-xs text-brand-orange hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-brand-brown/40 absolute left-4 top-3.5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-brand-orange/[0.02] border border-brand-orange/15 focus:border-brand-orange focus:bg-white rounded-2xl focus:outline-none placeholder-brand-brown/40 text-brand-brown text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-full text-brand-brown/40 hover:text-brand-orange hover:bg-brand-orange/10 absolute right-4 top-3.5 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-wait"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>

          {/* Create account suggestion */}
          <div className="text-center text-xs text-brand-brown/70">
            ¿Aún no tienes cuenta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Creación de cuenta simulada.");
              }}
              className="text-brand-orange hover:underline font-bold"
            >
              Crear cuenta ahora
            </a>
          </div>

        </motion.div>
      </div>

      {/* Footer text */}
      <div className="text-center text-xs text-brand-brown/50 px-4">
        © {new Date().getFullYear()} Fiesta. Todos los derechos reservados.
      </div>

    </div>
  );
}
