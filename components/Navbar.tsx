"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    { label: "Inicio", href: "/#inicio" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Proveedores", href: "/proveedores" },
    { label: "Cómo funciona", href: "/#como-funciona" },
    { label: "Galería", href: "/#galeria" },
    { label: "Contacto", href: "/#contacto" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isOpen
            ? "opacity-0 pointer-events-none"
            : scrolled
            ? "py-4 bg-dark-bg/90 backdrop-blur-md border-b border-primary-gold/20 opacity-100"
            : "py-6 bg-transparent opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/#inicio">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-xs uppercase tracking-widest text-secondary-white hover:text-primary-gold transition-colors relative group py-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/login"
                className="font-body text-xs uppercase tracking-widest text-secondary-white hover:text-primary-gold transition-colors"
              >
                Iniciar sesión
              </Link>
              <a
                href="/#cotizador"
                className="font-body text-xs uppercase tracking-widest text-primary-gold border border-primary-gold hover:bg-primary-gold hover:text-dark-bg px-6 py-3 transition-colors duration-300"
              >
                Cotiza tu evento
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-primary-gold focus:outline-none cursor-pointer"
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
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] md:hidden bg-black/90 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-[340px] h-[100dvh] bg-dark-bg p-6 shadow-2xl flex flex-col justify-between border-l border-primary-gold/20 z-[70] md:hidden overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-8">
                {/* Header in mobile panel */}
                <div className="flex justify-between items-center h-14 border-b border-primary-gold/20 pb-4">
                  <Logo />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-primary-gold cursor-pointer"
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
                  className="flex flex-col gap-4"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.label} variants={menuItemVariants}>
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="font-body text-sm uppercase tracking-widest text-secondary-white hover:text-primary-gold block py-2 transition-colors"
                      >
                        {link.label}
                      </a>
                    </motion.div>
                  ))}
                </motion.nav>
              </div>

              {/* Drawer footer actions */}
              <div className="flex flex-col gap-4 pt-6 border-t border-primary-gold/20 mb-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-body text-xs uppercase tracking-widest text-secondary-white py-3 transition-colors hover:text-primary-gold"
                >
                  Iniciar sesión
                </Link>
                <a
                  href="/#cotizador"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center font-body text-xs uppercase tracking-widest text-primary-gold border border-primary-gold hover:bg-primary-gold hover:text-dark-bg py-3 transition-colors duration-300"
                >
                  Cotiza tu evento
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
