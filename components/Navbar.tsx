"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./ui/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Galería", href: "#galeria" },
    { label: "Contacto", href: "#contacto" },
  ];

  // Framer Motion Animation Variants
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen
            ? "opacity-0 pointer-events-none" // Hide original navbar behind the menu to avoid duplicates
            : scrolled
            ? "py-3 bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-orange/10 opacity-100"
            : "py-5 bg-transparent opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="#inicio">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-medium text-brand-brown/80 hover:text-brand-orange transition-colors relative group py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="font-semibold text-brand-brown hover:text-brand-orange transition-colors px-4 py-2 rounded-full border border-transparent hover:border-brand-orange/20"
              >
                Iniciar sesión
              </Link>
              <a
                href="#cotizador"
                className="flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-2.5 rounded-full hover:bg-brand-orange-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-brand-yellow group-hover:rotate-12 transition-transform" />
                Cotiza tu fiesta
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-lg text-brand-brown hover:bg-brand-orange/10 focus:outline-none transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] md:hidden bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-[340px] h-[100dvh] bg-brand-cream p-6 shadow-2xl flex flex-col justify-between border-l border-brand-orange/10 z-[70] md:hidden overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header in mobile panel (Aligned matching layout) */}
                <div className="flex justify-between items-center h-14 border-b border-brand-orange/10 pb-2">
                  <Logo />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-brand-orange/10 text-brand-brown cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Staggered items navigation */}
                <motion.nav
                  variants={menuContainerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-2.5"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.label} variants={menuItemVariants}>
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-[18px] font-semibold text-brand-brown/95 hover:text-brand-orange py-3 px-4 rounded-xl hover:bg-brand-orange/5 transition-all flex items-center min-h-[48px]"
                      >
                        {link.label}
                      </a>
                    </motion.div>
                  ))}
                </motion.nav>
              </div>

              {/* Drawer footer actions */}
              <div className="flex flex-col gap-3.5 pt-6 border-t border-brand-orange/10 mb-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-bold text-brand-brown border border-brand-orange/20 py-3 rounded-full hover:bg-brand-orange/5 transition-colors text-sm"
                >
                  Iniciar sesión
                </Link>
                <a
                  href="#cotizador"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-bold bg-brand-orange text-white py-3 rounded-full hover:bg-brand-orange-dark shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  Cotiza tu fiesta
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
