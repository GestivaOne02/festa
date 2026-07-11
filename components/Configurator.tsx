// @ts-nocheck
"use client";
// @ts-nocheck
/* eslint-disable */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, Clock, Users, ArrowRight, X } from "lucide-react";
import { supabase, getEnterpriseCompanyId } from "@/lib/supabase";

type DbProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
};

type InvoiceItemInsert = {
  invoice_id: string;
  product_id: string;
  name: string;
  price: number;
  qty: number;
};

type ProductSettings = {
  occupiedSlots?: Array<{
    date: string;
    time: string;
    duration: number;
  }>;
  description?: string;
};

export default function Configurator() {
  const [hours, setHours] = useState(5);
  const [guests, setGuests] = useState(50);
  
  // Toggles for services
  const [includeWaiters, setIncludeWaiters] = useState(true);
  const [waiterCount, setWaiterCount] = useState(2);

  const [includeChefs, setIncludeChefs] = useState(false);
  const [chefCount, setChefCount] = useState(1);

  const [includeUtensils, setIncludeUtensils] = useState(true);
  const [includeFurniture, setIncludeFurniture] = useState(true);
  const [includeSpace, setIncludeSpace] = useState(false);
  const [includeCatering, setIncludeCatering] = useState(false);

  // Success modal state
  const [isBooked, setIsBooked] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Reservation states
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Database products state
  const [productsList, setProductsList] = useState<Array<DbProduct>>([]);
  const [rates, setRates] = useState({
    waiter: 25000,
    chef: 45000,
    utensil: 1500,
    furniture: 8000,
    space: 150000,
    catering: 15000,
  });

  // Mobile Wizard state
  const [step, setStep] = useState(1);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Load products and dynamic rates on mount
  useEffect(() => {
    async function initDb() {
      try {
        const companyId = await getEnterpriseCompanyId();
        if (!companyId) return;

        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, description')
          .eq('company_id', companyId);

        if (!error && data) {
          const parsedData: Array<DbProduct> = data.map((p: any) => ({
            id: String(p.id),
            name: String(p.name),
            price: Number(p.price),
            description: String(p.description || '')
          }));
          setProductsList(parsedData);
          
          const matchedRates = { ...rates };
          parsedData.forEach((p: DbProduct) => {
            const name = p.name.toLowerCase();
            const price = Number(p.price);
            if (name.includes('mesero')) matchedRates.waiter = price;
            else if (name.includes('cocinero') || name.includes('chef')) matchedRates.chef = price;
            else if (name.includes('vajilla') || name.includes('utensilio')) matchedRates.utensil = price;
            else if (name.includes('mesa') || name.includes('mobiliario')) matchedRates.furniture = price;
            else if (name.includes('lugar') || name.includes('salon') || name.includes('espacio')) matchedRates.space = price;
            else if (name.includes('comida') || name.includes('catering')) matchedRates.catering = price;
          });
          setRates(matchedRates);
        }
      } catch (e) {
        console.error('Error inicializando base de datos en cotizador:', e);
      }
    }
    initDb();
  }, []);

  // Rates in COP (loaded from database state)
  const WAITER_RATE = rates.waiter;
  const CHEF_RATE = rates.chef;
  const UTENSIL_RATE = rates.utensil;
  const FURNITURE_RATE = rates.furniture; // per guest flat average
  const SPACE_RATE = rates.space;
  const CATERING_RATE = rates.catering; // per guest flat

  // Calculators
  const waitersCost = includeWaiters ? waiterCount * hours * WAITER_RATE : 0;
  const chefsCost = includeChefs ? chefCount * hours * CHEF_RATE : 0;
  const utensilsCost = includeUtensils ? guests * hours * UTENSIL_RATE : 0;
  const furnitureCost = includeFurniture ? guests * FURNITURE_RATE : 0;
  const spaceCost = includeSpace ? hours * SPACE_RATE : 0;
  const cateringCost = includeCatering ? guests * CATERING_RATE : 0;

  const totalCost = waitersCost + chefsCost + utensilsCost + furnitureCost + spaceCost + cateringCost;

  // Format helper
  function formatCOP(num: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  // Helper to validate Gantt times overlap
  function validateAvailability(date: string, time: string, duration: number): { valid: boolean; conflictProduct?: string } {
    if (!date || !time) return { valid: true };

    function parseTimeToMin(t: string): number {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    }

    const newStart = parseTimeToMin(time);
    const newEnd = newStart + duration * 60;

    for (const p of productsList) {
      const nameLower = p.name.toLowerCase();
      // Only validate active toggled services
      const isSelected = 
        (nameLower.includes('mesero') && includeWaiters) ||
        ((nameLower.includes('cocinero') || nameLower.includes('chef')) && includeChefs) ||
        ((nameLower.includes('vajilla') || nameLower.includes('utensilio')) && includeUtensils) ||
        ((nameLower.includes('mesa') || nameLower.includes('mobiliario')) && includeFurniture) ||
        ((nameLower.includes('lugar') || nameLower.includes('salon') || nameLower.includes('espacio')) && includeSpace) ||
        ((nameLower.includes('comida') || nameLower.includes('catering')) && includeCatering);

      if (!isSelected) continue;

      let settings: ProductSettings = {};
      try {
        settings = JSON.parse(p.description || '{}');
      } catch (e) {
        continue;
      }

      const occupied = settings.occupiedSlots || [];
      for (const slot of occupied) {
        if (slot.date === date) {
          const slotStart = parseTimeToMin(slot.time);
          const slotEnd = slotStart + Number(slot.duration) * 60;

          // Check overlap
          if (newStart < slotEnd && slotStart < newEnd) {
            return { valid: false, conflictProduct: p.name };
          }
        }
      }
    }

    return { valid: true };
  }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || !bookingDate || !bookingTime) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    setIsSubmitLoading(true);
    setErrorMessage("");

    try {
      const companyId = await getEnterpriseCompanyId();
      if (!companyId) {
        setErrorMessage("Error de conexión: No se pudo conectar a la base de datos de GestivaOne.");
        setIsSubmitLoading(false);
        return;
      }

      // 1. Validar disponibilidad Gantt
      const availability = validateAvailability(bookingDate, bookingTime, hours);
      if (!availability.valid) {
        setErrorMessage(`⚠️ Conflicto de Agenda: El servicio "${availability.conflictProduct}" ya está reservado en la fecha y horario seleccionados.`);
        setIsSubmitLoading(false);
        return;
      }

      // Facturación y Correos gestionada 100% por el Edge Function de GestivaOne
      // Paso E: Generar Factura en GestivaOne
      const clientEmail = `${userName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      try {
        const invoiceRes = await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: userName,
            client_email: clientEmail,
            product_name: "Reserva de Servicios Múltiples en Festa",
            amount: totalCost,
            quantity: 1
          })
        });
        const invoiceData = await invoiceRes.json();
        if (invoiceData.success) {
          console.log("Factura generada con éxito. PDF:", invoiceData.pdf_url);
        } else {
          console.error("No se pudo autogenerar la factura en GestivaOne:", invoiceData.message);
        }
      } catch (invoiceErr) {
        console.error("Error conectando con la API de facturas:", invoiceErr);
      }

      setIsBooked(true);
    } catch (err) {
      console.error('Error procesando transacción de reserva:', err);
      const errorObj = err as Error;
      setErrorMessage(`Error: ${errorObj.message || 'No se pudo completar la transacción.'}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <section id="cotizador" className="pt-14 pb-8 lg:py-20 bg-secondary-white/[0.02] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16 space-y-3 lg:space-y-4">
          <h2 className="text-2xl lg:text-4xl font-heading text-secondary-white">
            Calcula tu fiesta en segundos
          </h2>
          <p className="text-sm lg:text-lg text-secondary-white/80 font-light px-2">
            Arrastra los controles y selecciona los servicios que necesitas. 
            Mira el presupuesto estimado en tiempo real de forma transparente.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. DESKTOP VIEW (Visible only on large screens >= lg) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          
          {/* Controls - Left side (col-span-7) */}
          <div className="col-span-7 bg-dark-bg border border-primary-gold/10 p-8 rounded-none shadow-xl space-y-8">
            
            {/* Sliders */}
            <div className="space-y-6">
              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-secondary-white">
                  <span className="font-heading font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-gold" />
                    Duración del evento
                  </span>
                  <span className="font-mono font-bold text-lg text-primary-gold">
                    {hours} horas
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-primary-gold/20 rounded-lg appearance-none cursor-pointer accent-primary-gold"
                />
                <div className="flex justify-between text-xs text-secondary-white/50 px-1">
                  <span>Mínimo (2h)</span>
                  <span>6h</span>
                  <span>Máximo (12h)</span>
                </div>
              </div>

              {/* Guest Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-secondary-white">
                  <span className="font-heading font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-gold" />
                    Número de invitados
                  </span>
                  <span className="font-mono font-bold text-lg text-primary-gold">
                    {guests} personas
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full h-2 bg-primary-gold/20 rounded-lg appearance-none cursor-pointer accent-primary-gold"
                />
                <div className="flex justify-between text-xs text-secondary-white/50 px-1">
                  <span>10 pers.</span>
                  <span>100 pers.</span>
                  <span>200 pers.</span>
                </div>
              </div>
            </div>

            <hr className="border-primary-gold/10" />

            {/* Toggle Service Items */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-secondary-white font-semibold">
                ¿Qué servicios deseas añadir?
              </h3>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Waiters Toggle */}
                <div
                  onClick={() => setIncludeWaiters(!includeWaiters)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between ${
                    includeWaiters
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm text-secondary-white font-bold">Meseros</h4>
                      <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(WAITER_RATE)} / hora c/u</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      includeWaiters ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                    }`}>
                      {includeWaiters && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {includeWaiters && (
                    <div className="mt-4 flex items-center justify-between bg-dark-bg/80 p-2 rounded-xl border border-primary-gold/20" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-semibold text-secondary-white/80">Cantidad:</span>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={waiterCount <= 1}
                          onClick={() => setWaiterCount(waiterCount - 1)}
                          className="w-7 h-7 bg-primary-gold/10 hover:bg-primary-gold/20 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-secondary-white">{waiterCount}</span>
                        <button
                          disabled={waiterCount >= 10}
                          onClick={() => setWaiterCount(waiterCount + 1)}
                          className="w-7 h-7 bg-primary-gold/10 hover:bg-primary-gold/20 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cooks Toggle */}
                <div
                  onClick={() => setIncludeChefs(!includeChefs)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex flex-col justify-between ${
                    includeChefs
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm text-secondary-white font-bold">Cocineros</h4>
                      <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(CHEF_RATE)} / hora c/u</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      includeChefs ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                    }`}>
                      {includeChefs && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {includeChefs && (
                    <div className="mt-4 flex items-center justify-between bg-dark-bg/80 p-2 rounded-xl border border-primary-gold/20" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-semibold text-secondary-white/80">Cantidad:</span>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={chefCount <= 1}
                          onClick={() => setChefCount(chefCount - 1)}
                          className="w-7 h-7 bg-primary-gold/10 hover:bg-primary-gold/20 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-secondary-white">{chefCount}</span>
                        <button
                          disabled={chefCount >= 5}
                          onClick={() => setChefCount(chefCount + 1)}
                          className="w-7 h-7 bg-primary-gold/10 hover:bg-primary-gold/20 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Utensils Toggle */}
                <div
                  onClick={() => setIncludeUtensils(!includeUtensils)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex items-center justify-between ${
                    includeUtensils
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-secondary-white font-bold">Vajilla y Utensilios</h4>
                    <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(UTENSIL_RATE)} / pers. por hora</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeUtensils ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                  }`}>
                    {includeUtensils && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Furniture Toggle */}
                <div
                  onClick={() => setIncludeFurniture(!includeFurniture)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex items-center justify-between ${
                    includeFurniture
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-secondary-white font-bold">Mesas y Mobiliario</h4>
                    <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(FURNITURE_RATE)} / pers. promedio</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeFurniture ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                  }`}>
                    {includeFurniture && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Space Toggle */}
                <div
                  onClick={() => setIncludeSpace(!includeSpace)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex items-center justify-between ${
                    includeSpace
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-secondary-white font-bold">Lugares para Eventos</h4>
                    <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(SPACE_RATE)} / hora</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeSpace ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                  }`}>
                    {includeSpace && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Catering Toggle */}
                <div
                  onClick={() => setIncludeCatering(!includeCatering)}
                  className={`p-4 rounded-none border cursor-pointer transition-all flex items-center justify-between ${
                    includeCatering
                      ? "border-primary-gold bg-primary-gold/5"
                      : "border-primary-gold/10 hover:border-primary-gold/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-secondary-white font-bold">Comida y Catering</h4>
                    <p className="text-xs text-secondary-white/60 mt-1">{formatCOP(CATERING_RATE)} / plato promedio</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeCatering ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                  }`}>
                    {includeCatering && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

              </div>
            </div>

          </div>

                    {/* Breakdown & Submit - Right side (col-span-5) */}
          <div className="col-span-5 relative sticky top-24">
            <div className="bg-secondary-white text-dark-bg rounded-[30px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative pb-[18px]">
              
              <div className="relative flex items-center justify-center py-6 mt-4">
                {/* Muescas laterales */}
                <div className="absolute w-[42px] h-[42px] bg-dark-bg rounded-full -left-[21px] z-10" />
                <div className="absolute w-[42px] h-[42px] bg-dark-bg rounded-full -right-[21px] z-10" />
                
                {/* Dashed line */}
                <div className="w-full mx-10 border-t-2 border-dashed border-dark-bg/20" />
              </div>

              <div className="p-10">
                {/* Calculations Breakdown */}
                <div className="space-y-2 text-sm font-light mb-8">
                  {includeWaiters && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">{waiterCount} Meseros x {hours}h</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(waitersCost)}</span>
                    </div>
                  )}
                  {includeChefs && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">{chefCount} Cocineros x {hours}h</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(chefsCost)}</span>
                    </div>
                  )}
                  {includeUtensils && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">Vajilla ({guests}p x {hours}h)</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(utensilsCost)}</span>
                    </div>
                  )}
                  {includeFurniture && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">Mobiliario ({guests}p)</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(furnitureCost)}</span>
                    </div>
                  )}
                  {includeSpace && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">Lugar x {hours}h</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(spaceCost)}</span>
                    </div>
                  )}
                  {includeCatering && (
                    <div className="flex justify-between items-center">
                      <span className="text-dark-bg/60 text-xs font-bold tracking-widest uppercase">Catering ({guests} platos)</span>
                      <span className="font-mono font-semibold text-lg">{formatCOP(cateringCost)}</span>
                    </div>
                  )}
                  {totalCost === 0 && (
                    <p className="text-dark-bg/60 italic text-center py-4">Selecciona algún servicio para cotizar</p>
                  )}
                </div>

                <div className="flex justify-between items-end mb-8 bg-dark-bg/5 p-4 rounded-2xl">
                  <div>
                    <span className="text-dark-bg/60 text-[10px] font-bold tracking-widest uppercase block mb-1">Total Estimado</span>
                    <span className="text-xs text-dark-bg/40 font-semibold">Ref. aproximada</span>
                  </div>
                  <span className="text-3xl font-heading font-bold text-dark-bg tracking-wider font-mono">
                    {formatCOP(totalCost)}
                  </span>
                </div>

                <div className="border-t-2 border-dashed border-dark-bg/10 pt-4" />

                {/* Quote Submission Mockup */}
                <AnimatePresence mode="wait">
                  {!isBooked ? (
                    <motion.form
                      key="form"
                      onSubmit={handleBookSubmit}
                      className="space-y-3 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre completo"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none placeholder-dark-bg/40 text-dark-bg text-sm transition-colors"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Número de celular"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none placeholder-dark-bg/40 text-dark-bg text-sm transition-colors"
                      />

                      {/* Date & Time fields */}
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-dark-bg/70 block pl-1">Fecha del evento</label>
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-dark-bg/70 block pl-1">Hora de inicio</label>
                          <input
                            type="time"
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full px-3 py-2.5 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors"
                          />
                        </div>
                      </div>

                      {errorMessage && (
                        <p className="text-primary-gold text-xs font-bold text-center leading-relaxed max-w-xs mx-auto pt-1 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                          {errorMessage}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={totalCost === 0 || isSubmitLoading}
                        className="w-full bg-primary-gold hover:bg-primary-gold-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
                      >
                        {isSubmitLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Cotizar esta Configuración</span>
                            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="bg-dark-bg/5 border border-primary-gold/30 p-5 rounded-2xl text-center space-y-3 mt-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring" }}
                    >
                      <div className="w-12 h-12 bg-primary-gold/20 text-primary-gold rounded-full flex items-center justify-center mx-auto text-2xl">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-primary-gold text-md">¡Solicitud Enviada!</h4>
                        <p className="text-xs text-dark-bg/80 mt-1 leading-relaxed">
                          Hola, <strong>{userName}</strong>. Hemos recibido tu pre-cotización de <strong>{formatCOP(totalCost)}</strong>. 
                          Un asesor te escribirá a tu Whatsapp <strong>{userPhone}</strong> en unos minutos para confirmar.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsBooked(false);
                          setUserName("");
                          setUserPhone("");
                        }}
                        className="text-xs text-primary-gold hover:underline cursor-pointer"
                      >
                        Hacer otra simulación
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ondas inferiores */}
              <div 
                className="absolute bottom-0 left-0 w-full h-[18px]" 
                style={{
                  background: 'radial-gradient(circle at 15px 0, transparent 15px, #0F0F10 16px)',
                  backgroundSize: '40px 20px',
                  backgroundPosition: 'bottom'
                }} 
              />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE WIZARD VIEW (Visible only on mobile/tablet < lg) */}
        {/* ========================================================================= */}
        <div className="lg:hidden flex flex-col gap-4 max-w-md mx-auto pb-16">
          
          {/* Progress segment bar */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1 relative">
                {s > 1 && (
                  <div className={`absolute right-1/2 left-[-50%] top-4 h-0.5 -z-10 transition-colors duration-300 ${
                    step >= s ? "bg-primary-gold" : "bg-primary-gold/20"
                  }`} />
                )}
                <button
                  onClick={() => setStep(s)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 cursor-pointer ${
                    step === s
                      ? "bg-primary-gold text-white ring-4 ring-primary-gold/15"
                      : step > s
                      ? "bg-primary-gold/10 text-primary-gold border-2 border-primary-gold/25"
                      : "bg-dark-bg text-secondary-white/30 border-2 border-secondary-white/10"
                  }`}
                >
                  {s}
                </button>
                <span className={`text-[9px] font-bold ${
                  step === s ? "text-primary-gold" : "text-secondary-white/40"
                }`}>
                  {s === 1 ? "Evento" : s === 2 ? "Servicios" : "Resumen"}
                </span>
              </div>
            ))}
          </div>

          {/* Steps Animations container */}
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 bg-dark-bg border border-primary-gold/10 p-6 rounded-none shadow-md"
                >
                  {/* Slider Duration */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-secondary-white/50 uppercase tracking-widest block">Duración del evento</span>
                      <span className="text-3xl font-heading font-extrabold text-primary-gold mt-0.5 block font-mono">{hours} horas</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full h-3 bg-primary-gold/20 rounded-lg appearance-none cursor-pointer accent-primary-gold touch-pan-y"
                    />
                    <div className="flex justify-between text-[9px] text-secondary-white/40 font-bold font-mono">
                      <span>MÍN (2H)</span>
                      <span>MED (6H)</span>
                      <span>MÁX (12H)</span>
                    </div>
                  </div>

                  {/* Slider Guests */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-secondary-white/50 uppercase tracking-widest block">Número de invitados</span>
                      <span className="text-3xl font-heading font-extrabold text-primary-gold mt-0.5 block font-mono">{guests} personas</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full h-3 bg-primary-gold/20 rounded-lg appearance-none cursor-pointer accent-primary-gold touch-pan-y"
                    />
                    <div className="flex justify-between text-[9px] text-secondary-white/40 font-bold font-mono">
                      <span>10 INVITADOS</span>
                      <span>100</span>
                      <span>200 MÁX</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 bg-dark-bg border border-primary-gold/10 p-5 rounded-none shadow-md"
                >
                  <h3 className="font-heading text-sm text-secondary-white font-bold text-center pb-2">Selecciona tus Servicios</h3>
                  
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    
                    {/* Waiter Item */}
                    <div className="flex flex-col">
                      <div
                        onClick={() => setIncludeWaiters(!includeWaiters)}
                        className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                          includeWaiters ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-secondary-white">Meseros</h4>
                          <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(WAITER_RATE)} / hora c/u</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          includeWaiters ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                        }`}>
                          {includeWaiters && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {includeWaiters && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-primary-gold/[0.01] px-3 sm:px-4 pb-3 rounded-none border-x border-b border-primary-gold/15 -mt-2 z-10"
                          >
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] font-semibold text-secondary-white/70">¿Cuántos necesitas?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={waiterCount <= 1}
                                  onClick={(e) => { e.stopPropagation(); setWaiterCount(waiterCount - 1); }}
                                  className="w-9 h-9 bg-primary-gold/10 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-primary-gold/20 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold w-4 text-center">{waiterCount}</span>
                                <button
                                  type="button"
                                  disabled={waiterCount >= 10}
                                  onClick={(e) => { e.stopPropagation(); setWaiterCount(waiterCount + 1); }}
                                  className="w-9 h-9 bg-primary-gold/10 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-primary-gold/20 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Chef Item */}
                    <div className="flex flex-col">
                      <div
                        onClick={() => setIncludeChefs(!includeChefs)}
                        className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                          includeChefs ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-secondary-white">Cocineros</h4>
                          <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(CHEF_RATE)} / hora c/u</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          includeChefs ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                        }`}>
                          {includeChefs && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {includeChefs && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-primary-gold/[0.01] px-3 sm:px-4 pb-3 rounded-none border-x border-b border-primary-gold/15 -mt-2 z-10"
                          >
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] font-semibold text-secondary-white/70">¿Cuántos necesitas?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={chefCount <= 1}
                                  onClick={(e) => { e.stopPropagation(); setChefCount(chefCount - 1); }}
                                  className="w-9 h-9 bg-primary-gold/10 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-primary-gold/20 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold w-4 text-center">{chefCount}</span>
                                <button
                                  type="button"
                                  disabled={chefCount >= 5}
                                  onClick={(e) => { e.stopPropagation(); setChefCount(chefCount + 1); }}
                                  className="w-9 h-9 bg-primary-gold/10 text-primary-gold font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-primary-gold/20 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Utensils Item */}
                    <div
                      onClick={() => setIncludeUtensils(!includeUtensils)}
                      className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                        includeUtensils ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-secondary-white">Vajilla y Utensilios</h4>
                        <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(UTENSIL_RATE)} / pers. por hora</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeUtensils ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                      }`}>
                        {includeUtensils && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Furniture Item */}
                    <div
                      onClick={() => setIncludeFurniture(!includeFurniture)}
                      className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                        includeFurniture ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-secondary-white">Mesas y Mobiliario</h4>
                        <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(FURNITURE_RATE)} / pers. promedio</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeFurniture ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                      }`}>
                        {includeFurniture && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Space Item */}
                    <div
                      onClick={() => setIncludeSpace(!includeSpace)}
                      className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                        includeSpace ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-secondary-white">Lugares para Eventos</h4>
                        <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(SPACE_RATE)} / hora</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeSpace ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                      }`}>
                        {includeSpace && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Catering Item */}
                    <div
                      onClick={() => setIncludeCatering(!includeCatering)}
                      className={`flex justify-between items-center h-14 px-3 sm:px-4 rounded-none border transition-all cursor-pointer ${
                        includeCatering ? "border-primary-gold bg-primary-gold/[0.03]" : "border-primary-gold/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-secondary-white">Comida y Catering</h4>
                        <span className="text-[9px] text-secondary-white/50 block mt-0.5">{formatCOP(CATERING_RATE)} / plato promedio</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeCatering ? "bg-primary-gold border-primary-gold text-white" : "border-secondary-white/20"
                      }`}>
                        {includeCatering && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {step === 3 && (
                                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-secondary-white text-dark-bg rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative pb-[14px]">
                    
                    <div className="relative flex items-center justify-center py-5 mt-3">
                      {/* Muescas laterales */}
                      <div className="absolute w-[30px] h-[30px] bg-dark-bg rounded-full -left-[15px] z-10" />
                      <div className="absolute w-[30px] h-[30px] bg-dark-bg rounded-full -right-[15px] z-10" />
                      
                      {/* Dashed line */}
                      <div className="w-full mx-6 border-t-2 border-dashed border-dark-bg/20" />
                    </div>

                    <div className="p-6">
                      {/* Calculations Breakdown Mobile */}
                      <div className="space-y-1.5 text-[10px] font-light max-h-[160px] overflow-y-auto pr-1 mb-6">
                        {includeWaiters && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">{waiterCount} Meseros x {hours}h</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(waitersCost)}</span>
                          </div>
                        )}
                        {includeChefs && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">{chefCount} Cocineros x {hours}h</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(chefsCost)}</span>
                          </div>
                        )}
                        {includeUtensils && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">Vajilla ({guests}p x {hours}h)</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(utensilsCost)}</span>
                          </div>
                        )}
                        {includeFurniture && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">Mobiliario ({guests}p)</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(furnitureCost)}</span>
                          </div>
                        )}
                        {includeSpace && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">Lugar x {hours}h</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(spaceCost)}</span>
                          </div>
                        )}
                        {includeCatering && (
                          <div className="flex justify-between items-center">
                            <span className="text-dark-bg/60 font-bold tracking-widest uppercase">Catering ({guests} platos)</span>
                            <span className="font-mono font-semibold text-xs">{formatCOP(cateringCost)}</span>
                          </div>
                        )}
                        {totalCost === 0 && (
                          <p className="text-dark-bg/50 italic text-center py-2">Ningún servicio seleccionado</p>
                        )}
                      </div>

                      <div className="flex justify-between items-end mb-6 bg-dark-bg/5 p-3 rounded-2xl">
                        <div>
                          <span className="text-dark-bg/60 text-[9px] font-bold tracking-widest uppercase block mb-1">Total Estimado</span>
                          <span className="text-[10px] text-dark-bg/40 font-semibold">Ref. aproximada</span>
                        </div>
                        <span className="text-xl font-heading font-bold text-dark-bg tracking-wider font-mono">
                          {formatCOP(totalCost)}
                        </span>
                      </div>

                      <div className="border-t-2 border-dashed border-dark-bg/10 pt-2" />

                      {/* Submission Form mobile */}
                      <AnimatePresence mode="wait">
                        {!isBooked ? (
                          <form onSubmit={handleBookSubmit} className="space-y-2.5 pt-2">
                            <input
                              type="text"
                              required
                              placeholder="Tu nombre completo"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="w-full px-4 py-3 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors"
                            />
                            <input
                              type="tel"
                              required
                              placeholder="Número de celular"
                              value={userPhone}
                              onChange={(e) => setUserPhone(e.target.value)}
                              className="w-full px-4 py-3 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors"
                            />

                            {/* Mobile Date & Time fields */}
                            <div className="grid grid-cols-2 gap-3 text-left">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dark-bg/70 block pl-1">Fecha del evento</label>
                                <input
                                  type="date"
                                  required
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full px-3 py-2.5 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-dark-bg/70 block pl-1">Hora de inicio</label>
                                <input
                                  type="time"
                                  required
                                  value={bookingTime}
                                  onChange={(e) => setBookingTime(e.target.value)}
                                  className="w-full px-3 py-2.5 bg-dark-bg/5 border border-dark-bg/20 rounded-xl focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors"
                                />
                              </div>
                            </div>

                            {errorMessage && (
                              <p className="text-primary-gold text-[11px] font-bold text-center leading-relaxed max-w-xs mx-auto pt-1 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                                {errorMessage}
                              </p>
                            )}

                            <button
                              type="submit"
                              disabled={totalCost === 0 || isSubmitLoading}
                              className="w-full bg-primary-gold hover:bg-primary-gold-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50 mt-4"
                            >
                              {isSubmitLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <span>Solicitar Cotización</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </>
                              )}
                            </button>
                          </form>
                        ) : (
                          <div className="bg-dark-bg/5 border border-primary-gold/20 p-4 rounded-xl text-center space-y-2.5 mt-2">
                            <div className="w-8 h-8 bg-primary-gold/20 text-primary-gold rounded-full flex items-center justify-center mx-auto text-base">
                              ✓
                            </div>
                            <p className="text-[11px] text-dark-bg/90 leading-relaxed">
                              ¡Listo, <strong>{userName}</strong>! Te enviaremos el presupuesto de <strong>{formatCOP(totalCost)}</strong> a Whatsapp.
                            </p>
                            <button
                              onClick={() => {
                                setIsBooked(false);
                                setUserName("");
                                setUserPhone("");
                              }}
                              className="text-[10px] text-primary-gold hover:underline cursor-pointer"
                            >
                              Hacer otra simulación
                            </button>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Ondas inferiores */}
                    <div 
                      className="absolute bottom-0 left-0 w-full h-[14px]" 
                      style={{
                        background: 'radial-gradient(circle at 10px 0, transparent 10px, #0F0F10 11px)',
                        backgroundSize: '28px 14px',
                        backgroundPosition: 'bottom'
                      }} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

{/* Fixed bottom controls for Wizard */}
          <div className="flex gap-4 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-2 border-secondary-white/10 text-secondary-white font-bold py-3 rounded-xl hover:bg-primary-gold/5 text-xs transition-all cursor-pointer h-11"
              >
                Atrás
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-primary-gold hover:bg-primary-gold-dark text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer h-11"
              >
                Siguiente
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sticky total bar at the very bottom (only on Step 1 and Step 2 in mobile) */}
          {step < 3 && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-secondary-white text-dark-bg border-t border-primary-gold/15 shadow-[0_-8px_15px_rgba(0,0,0,0.1)] px-5 py-3 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[9px] text-dark-bg/50 uppercase tracking-widest block">Total estimado</span>
                <span className="text-lg font-heading font-extrabold text-primary-gold font-mono leading-none">{formatCOP(totalCost)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(true)}
                className="bg-primary-gold/20 hover:bg-primary-gold/30 border border-primary-gold/40 text-primary-gold font-bold px-4 py-2 rounded-full text-[10px] transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Ver detalle ↑</span>
              </button>
            </div>
          )}

          {/* Bottom Sheet Drawer for mobile detail breakdown */}
          <AnimatePresence>
            {isBottomSheetOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="fixed inset-0 z-50 bg-black/60"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-secondary-white text-dark-bg rounded-t-[2rem] shadow-2xl p-6 border-t border-primary-gold/25 max-h-[80vh] flex flex-col"
                >
                  {/* Drag/Close handle bar */}
                  <div 
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="w-10 h-1 bg-dark-bg/20 rounded-full mx-auto mb-5 shrink-0 cursor-pointer" 
                  />

                  <div className="flex justify-between items-center mb-5 shrink-0">
                    <h3 className="font-heading text-base font-bold text-primary-gold flex items-center gap-1.5">
                      <Calculator className="w-4.5 h-4.5" />
                      Detalle de Cotización
                    </h3>
                    <button 
                      onClick={() => setIsBottomSheetOpen(false)}
                      className="p-1 rounded-full bg-dark-bg/10 hover:bg-dark-bg/20 text-dark-bg"
                      aria-label="Cerrar detalle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Calculations breakdown scroll */}
                  <div className="space-y-3.5 text-xs font-light overflow-y-auto py-2 flex-grow pr-1">
                    {includeWaiters && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>{waiterCount} Meseros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(waitersCost)}</span>
                      </div>
                    )}
                    {includeChefs && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>{chefCount} Cocineros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(chefsCost)}</span>
                      </div>
                    )}
                    {includeUtensils && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>Vajilla ({guests} pers. x {hours}h)</span>
                        <span className="font-mono font-semibold">{formatCOP(utensilsCost)}</span>
                      </div>
                    )}
                    {includeFurniture && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>Mobiliario ({guests} pers.)</span>
                        <span className="font-mono font-semibold">{formatCOP(furnitureCost)}</span>
                      </div>
                    )}
                    {includeSpace && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>Lugar x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(spaceCost)}</span>
                      </div>
                    )}
                    {includeCatering && (
                      <div className="flex justify-between border-b border-dark-bg/5 pb-2">
                        <span>Catering ({guests} platos)</span>
                        <span className="font-mono font-semibold">{formatCOP(cateringCost)}</span>
                      </div>
                    )}
                    {totalCost === 0 && (
                      <p className="text-dark-bg/50 italic text-center py-4">Ningún servicio seleccionado</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-dark-bg/10 mt-4 shrink-0">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-primary-gold font-heading text-sm font-semibold">Total Estimado</span>
                      <span className="text-xl font-heading font-bold text-primary-gold font-mono">{formatCOP(totalCost)}</span>
                    </div>
                    <button
                      onClick={() => { setIsBottomSheetOpen(false); setStep(3); }}
                      className="w-full bg-primary-gold hover:bg-primary-gold-dark text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceder al Resumen</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary-gold" />
                    </button>
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
