"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const phoneNumber = "573173823814";
  const message = "Hola buenos días, tengo dudas/inquietudes sobre una reserva.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary-gold text-dark-bg rounded-full shadow-2xl hover:bg-white transition-colors duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contactar por WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M12.031 21.054c-1.424-.002-2.816-.381-4.043-1.096l-.289-.168-3.003.788.803-2.927-.185-.294A10.218 10.218 0 011.666 12a10.26 10.26 0 0110.365-10.26c2.748.001 5.33.107 7.27 2.051a10.233 10.233 0 012.05 7.27c-.001 5.666-4.61 10.263-10.26 10.263h-.03zM12.031 3.553C7.391 3.553 3.618 7.324 3.618 11.966c0 1.48.385 2.924 1.118 4.195l.135.234-.475 1.732 1.77-.464.242.144a8.31 8.31 0 004.622 1.391h.023c4.639 0 8.411-3.77 8.411-8.411 0-2.25-.876-4.364-2.467-5.955-1.59-1.59-3.705-2.467-5.956-2.467z" />
        <path d="M16.741 14.502c-.255-.128-1.512-.746-1.745-.832-.234-.085-.404-.128-.574.128-.17.255-.658.832-.807.998-.149.17-.3.191-.555.064-.255-.128-1.078-.398-2.052-1.267-.757-.677-1.267-1.512-1.416-1.767-.149-.255-.016-.393.111-.52.115-.115.255-.298.383-.447.128-.149.17-.255.255-.425.085-.17.043-.319-.021-.447-.064-.128-.574-1.385-.786-1.895-.208-.498-.42-.43-.574-.438-.149-.009-.319-.009-.489-.009-.17 0-.447.064-.68.319-.234.255-.893.873-.893 2.129s.914 2.47 1.042 2.64c.128.17 1.794 2.738 4.346 3.837.607.262 1.08.418 1.448.535.609.193 1.164.166 1.602.1.492-.074 1.512-.618 1.724-1.214.212-.596.212-1.107.149-1.214-.064-.107-.234-.17-.489-.298z" />
      </svg>
    </motion.a>
  );
}
