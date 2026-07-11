"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [targetIdleTime, setTargetIdleTime] = useState(3000); // 3 seconds initially
  const [progress, setProgress] = useState(0); // 0 to 1
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastActiveTime = useRef(Date.now());
  const rafRef = useRef<number>();
  
  const isVideoVisibleRef = useRef(isVideoVisible);
  const targetIdleTimeRef = useRef(targetIdleTime);
  
  // Keep refs in sync with state for requestAnimationFrame
  useEffect(() => {
    isVideoVisibleRef.current = isVideoVisible;
    targetIdleTimeRef.current = targetIdleTime;
  }, [isVideoVisible, targetIdleTime]);

  useEffect(() => {
    const handleActivity = () => {
      lastActiveTime.current = Date.now();
    };

    // Listen to user activity to reset the idle timer
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const updateProgress = () => {
      if (isVideoVisibleRef.current) {
        setProgress(0); 
      } else {
        const elapsed = Date.now() - lastActiveTime.current;
        const currentProgress = Math.min(elapsed / targetIdleTimeRef.current, 1);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          // Play automatically
          setIsVideoVisible(true);
        }
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Handle playing/pausing the video element
  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
       videoRef.current.play().catch(e => {
         console.warn("Autoplay prevented by browser:", e);
         setIsVideoVisible(false);
         lastActiveTime.current = Date.now();
       });
    } else if (!isVideoVisible && videoRef.current) {
       videoRef.current.pause();
    }
  }, [isVideoVisible]);

  const handleVideoEnded = () => {
    setIsVideoVisible(false);
    setTargetIdleTime(15000); // Next idle wait is 15 seconds
    lastActiveTime.current = Date.now();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ease out
      },
    },
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[90dvh] flex items-center overflow-hidden group"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/festaBackground.png"
          alt="Banquete de evento de lujo al aire libre"
          fill
          priority
          className="object-cover"
          quality={100}
        />
      </div>

      {/* Background Video */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          isVideoVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          src="/festaBackgroundVideoSmall.mp4"
          className="object-cover w-full h-full"
          muted
          playsInline
          onEnded={handleVideoEnded}
        />
      </div>

      {/* Shared Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-dark-bg/30 pointer-events-none" />

      {/* Play/Pause Button with Circular Progress */}
      <div className="absolute bottom-8 right-8 z-20">
        <button 
          type="button"
          onClick={() => {
            if (isVideoVisible) {
              setIsVideoVisible(false);
              lastActiveTime.current = Date.now();
            } else {
              setIsVideoVisible(true);
            }
          }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-dark-bg/40 backdrop-blur-md border border-primary-gold/30 text-primary-gold hover:bg-dark-bg/80 hover:scale-105 transition-all shadow-xl group-hover:opacity-100 opacity-80"
          aria-label={isVideoVisible ? "Pausar video" : "Reproducir video"}
        >
          {/* SVG Circular Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              className="text-primary-gold/20"
            />
            {/* The dasharray is roughly 2 * PI * r = 2 * 3.14159 * 46 = 289.026 */}
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
              strokeDasharray="289.026"
              strokeDashoffset={289.026 * (1 - progress)}
              className="text-primary-gold transition-all duration-75 ease-linear"
            />
          </svg>
          {isVideoVisible ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Text Content aligned to the left */}
          <motion.div
            className="text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Promo Tag */}
            <motion.div
              variants={itemVariants}
              className="font-body text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-primary-gold font-semibold"
            >
              Creamos momentos inolvidables
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-secondary-white leading-tight"
            >
              EVENTOS <br />
              EXTRAORDINARIOS
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-secondary-gray max-w-md leading-relaxed font-light"
            >
              Diseñamos experiencias únicas con atención al detalle,
              elegancia y un servicio impecable.
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <a
                href="#cotizador"
                className="inline-flex items-center justify-center gap-2 border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-dark-bg transition-colors duration-300 font-body text-xs md:text-sm uppercase tracking-wider px-8 py-4"
              >
                Descubre nuestros eventos
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
