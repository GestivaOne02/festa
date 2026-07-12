// @ts-nocheck
"use client";
// @ts-nocheck
/* eslint-disable */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, Clock, Users, ArrowRight, X, Sparkles, MapPin, ChefHat, UtensilsCrossed, Armchair, Star } from "lucide-react";
import { supabase, getEnterpriseCompanyId } from "@/lib/supabase";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
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

  const [includeUtensils, setIncludeUtensils] = useState(false);
  const [includeFurniture, setIncludeFurniture] = useState(false);
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
  const FURNITURE_RATE = rates.furniture;
  const SPACE_RATE = rates.space;
  const CATERING_RATE = rates.catering;

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

      const availability = validateAvailability(bookingDate, bookingTime, hours);
      if (!availability.valid) {
        setErrorMessage(`⚠️ Conflicto de Agenda: El servicio "${availability.conflictProduct}" ya está reservado en la fecha y horario seleccionados.`);
        setIsSubmitLoading(false);
        return;
      }

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

  // Receipt line items for the real-time invoice
  const receiptItems = [
    ...(includeWaiters ? [{ label: `${waiterCount} Mesero${waiterCount > 1 ? 's' : ''} × ${hours}h`, cost: waitersCost, icon: "👔" }] : []),
    ...(includeChefs ? [{ label: `${chefCount} Cocinero${chefCount > 1 ? 's' : ''} × ${hours}h`, cost: chefsCost, icon: "👨‍🍳" }] : []),
    ...(includeUtensils ? [{ label: `Vajilla (${guests}p × ${hours}h)`, cost: utensilsCost, icon: "🍽️" }] : []),
    ...(includeFurniture ? [{ label: `Mobiliario (${guests}p)`, cost: furnitureCost, icon: "🪑" }] : []),
    ...(includeSpace ? [{ label: `Lugar × ${hours}h`, cost: spaceCost, icon: "🏛️" }] : []),
    ...(includeCatering ? [{ label: `Catering (${guests} platos)`, cost: cateringCost, icon: "🥗" }] : []),
  ];

  // Generate receipt ID based on current config
  const receiptId = `FESTA-${guests.toString().padStart(3,'0')}-${hours.toString().padStart(2,'0')}`;
  const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

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
        <div className="hidden lg:grid grid-cols-12 gap-10 items-start">
          
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

          {/* ============================================================== */}
          {/* PREMIUM RECEIPT / INVOICE - Right side (col-span-5)           */}
          {/* ============================================================== */}
          <div className="col-span-5 sticky top-24">

            {/* Receipt Paper */}
            <div className="relative">
              {/* Subtle shadow layers for depth */}
              <div className="absolute inset-0 translate-y-2 translate-x-1 bg-primary-gold/10 rounded-t-[4px]" />
              <div className="absolute inset-0 translate-y-1 translate-x-0.5 bg-primary-gold/20 rounded-t-[4px]" />

              <div className="relative bg-[#FAFAF7] text-dark-bg rounded-t-[4px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

                {/* Receipt Header — gold gradient band */}
                <div className="bg-gradient-to-r from-[#BFA37E] to-[#8C7355] px-8 py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/60 text-[10px] font-body font-bold tracking-[0.2em] uppercase mb-1">Cotización Estimada</p>
                      <h3 className="text-white font-heading text-2xl font-bold tracking-wide">FESTA</h3>
                      <p className="text-white/50 text-[10px] font-body mt-0.5 tracking-wider">EVENTS</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-[9px] font-body font-bold tracking-widest uppercase">No. Ref.</p>
                      <p className="text-white font-mono text-xs font-bold mt-0.5">{receiptId}</p>
                      <p className="text-white/40 text-[9px] font-body mt-2">{today}</p>
                    </div>
                  </div>

                  {/* Event summary chips */}
                  <div className="flex gap-2 mt-4">
                    <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[10px] font-body font-bold px-2.5 py-1 rounded-full">
                      <Clock className="w-2.5 h-2.5" />{hours}h
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[10px] font-body font-bold px-2.5 py-1 rounded-full">
                      <Users className="w-2.5 h-2.5" />{guests} inv.
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[10px] font-body font-bold px-2.5 py-1 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />{receiptItems.length} serv.
                    </span>
                  </div>
                </div>

                {/* Ticket perforation */}
                <div className="relative flex items-center">
                  <div className="absolute -left-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="absolute -right-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-6" />
                </div>

                {/* Line items area */}
                <div className="px-8 py-5 min-h-[140px]">
                  
                  {/* Column headers */}
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-dark-bg/8">
                    <span className="text-[9px] font-body font-bold text-dark-bg/40 tracking-[0.18em] uppercase">Servicio</span>
                    <span className="text-[9px] font-body font-bold text-dark-bg/40 tracking-[0.18em] uppercase">Subtotal</span>
                  </div>

                  {/* Animated receipt lines */}
                  <AnimatePresence initial={false}>
                    {receiptItems.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-6 text-dark-bg/30"
                      >
                        <span className="text-3xl mb-2">✨</span>
                        <p className="text-xs font-body italic">Selecciona servicios para ver tu cotización</p>
                      </motion.div>
                    ) : (
                      receiptItems.map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -12, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0, x: 12, height: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04 }}
                          className="overflow-hidden"
                        >
                          <div className="flex justify-between items-center py-2.5 border-b border-dark-bg/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-base leading-none">{item.icon}</span>
                              <span className="text-[11px] font-body font-semibold text-dark-bg/75 tracking-wide">{item.label}</span>
                            </div>
                            <motion.span
                              key={item.cost}
                              initial={{ scale: 1.1, color: "#BFA37E" }}
                              animate={{ scale: 1, color: "#1a1a1a" }}
                              transition={{ duration: 0.3 }}
                              className="font-mono text-xs font-bold text-dark-bg"
                            >
                              {formatCOP(item.cost)}
                            </motion.span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Second perforation */}
                <div className="relative flex items-center">
                  <div className="absolute -left-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="absolute -right-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-6" />
                </div>

                {/* Total area */}
                <div className="px-8 py-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-body font-bold tracking-[0.2em] uppercase text-dark-bg/40 mb-1">Total Estimado</p>
                      <p className="text-[9px] font-body text-dark-bg/30">Ref. aproximada · sin impuestos</p>
                    </div>
                    <motion.div
                      key={totalCost}
                      initial={{ scale: 1.05, color: "#BFA37E" }}
                      animate={{ scale: 1, color: "#1a1a1a" }}
                      transition={{ duration: 0.35, type: "spring", bounce: 0.3 }}
                      className="text-right"
                    >
                      <p className="font-mono font-bold text-2xl text-dark-bg tracking-wider">
                        {formatCOP(totalCost)}
                      </p>
                    </motion.div>
                  </div>

                  {/* Stars rating visual */}
                  <div className="flex items-center gap-1 mt-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-primary-gold text-primary-gold" />
                    ))}
                    <span className="text-[9px] text-dark-bg/30 font-body ml-1">Servicio Premium · Festa Events</span>
                  </div>
                </div>

                {/* Third perforation before form */}
                <div className="relative flex items-center">
                  <div className="absolute -left-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="absolute -right-4 w-8 h-8 bg-dark-bg rounded-full z-10" />
                  <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-6" />
                </div>

                {/* Booking form */}
                <div className="px-8 py-6">
                  <AnimatePresence mode="wait">
                    {!isBooked ? (
                      <motion.form
                        key="form"
                        onSubmit={handleBookSubmit}
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-[9px] font-body font-bold tracking-[0.18em] uppercase text-dark-bg/40 mb-3">Completa para confirmar</p>
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors rounded-none font-body"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Número de celular"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors rounded-none font-body"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-body font-bold text-dark-bg/50 block tracking-widest uppercase">Fecha</label>
                            <DatePicker
                              selected={bookingDate ? new Date(bookingDate + "T12:00:00") : null}
                              onChange={(date) => setBookingDate(date ? format(date, "yyyy-MM-dd") : "")}
                              locale={es}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/aaaa"
                              minDate={new Date()}
                              required
                              className="w-full px-3 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors rounded-none font-body"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-body font-bold text-dark-bg/50 block tracking-widest uppercase">Hora inicio</label>
                            <DatePicker
                              selected={bookingTime ? parse(bookingTime, "HH:mm", new Date()) : null}
                              onChange={(date) => setBookingTime(date ? format(date, "HH:mm") : "")}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Hora"
                              dateFormat="HH:mm"
                              placeholderText="--:-- ----"
                              required
                              className="w-full px-3 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors rounded-none font-body"
                            />
                          </div>
                        </div>

                        {errorMessage && (
                          <p className="text-red-600 text-[10px] font-body font-bold text-center leading-relaxed bg-red-50 p-2 border border-red-200">
                            {errorMessage}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={totalCost === 0 || isSubmitLoading}
                          className="w-full bg-gradient-to-r from-primary-gold to-[#8C7355] hover:from-[#8C7355] hover:to-primary-gold text-white font-body font-bold py-3.5 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 tracking-widest text-xs uppercase rounded-none"
                        >
                          {isSubmitLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                        className="text-center space-y-4 py-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring" }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                          className="w-14 h-14 bg-gradient-to-br from-primary-gold to-[#8C7355] rounded-full flex items-center justify-center mx-auto shadow-lg"
                        >
                          <Check className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-heading font-bold text-primary-gold text-lg">¡Solicitud Enviada!</h4>
                          <p className="text-xs font-body text-dark-bg/70 mt-2 leading-relaxed max-w-[220px] mx-auto">
                            Hola <strong>{userName}</strong>. Tu pre-cotización de <strong>{formatCOP(totalCost)}</strong> fue recibida. Un asesor te escribirá al <strong>{userPhone}</strong> pronto.
                          </p>
                        </div>
                        <button
                          onClick={() => { setIsBooked(false); setUserName(""); setUserPhone(""); }}
                          className="text-xs font-body text-primary-gold hover:underline cursor-pointer"
                        >
                          Hacer otra simulación
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Scalloped bottom edge of receipt */}
              <div
                className="w-full h-5 bg-[#FAFAF7]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 97.5% 60%, 95% 100%, 92.5% 60%, 90% 100%, 87.5% 60%, 85% 100%, 82.5% 60%, 80% 100%, 77.5% 60%, 75% 100%, 72.5% 60%, 70% 100%, 67.5% 60%, 65% 100%, 62.5% 60%, 60% 100%, 57.5% 60%, 55% 100%, 52.5% 60%, 50% 100%, 47.5% 60%, 45% 100%, 42.5% 60%, 40% 100%, 37.5% 60%, 35% 100%, 32.5% 60%, 30% 100%, 27.5% 60%, 25% 100%, 22.5% 60%, 20% 100%, 17.5% 60%, 15% 100%, 12.5% 60%, 10% 100%, 7.5% 60%, 5% 100%, 2.5% 60%, 0 100%)"
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
                  {/* Mobile Receipt */}
                  <div className="relative">
                    <div className="bg-[#FAFAF7] text-dark-bg rounded-t-sm overflow-hidden shadow-2xl">
                      {/* Header gold band */}
                      <div className="bg-gradient-to-r from-[#BFA37E] to-[#8C7355] px-6 py-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white/60 text-[8px] font-body font-bold tracking-widest uppercase mb-1">Cotización</p>
                            <h3 className="text-white font-heading text-xl font-bold">FESTA</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-white/50 text-[8px] font-body font-bold tracking-widest uppercase">Ref.</p>
                            <p className="text-white font-mono text-[10px] font-bold mt-0.5">{receiptId}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[9px] font-body font-bold px-2 py-0.5 rounded-full">
                            <Clock className="w-2 h-2" />{hours}h
                          </span>
                          <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[9px] font-body font-bold px-2 py-0.5 rounded-full">
                            <Users className="w-2 h-2" />{guests}
                          </span>
                        </div>
                      </div>

                      {/* Perforation */}
                      <div className="relative flex items-center">
                        <div className="absolute -left-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="absolute -right-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-5" />
                      </div>

                      {/* Line items */}
                      <div className="px-6 py-4 min-h-[100px]">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-dark-bg/8">
                          <span className="text-[8px] font-body font-bold text-dark-bg/40 tracking-widest uppercase">Servicio</span>
                          <span className="text-[8px] font-body font-bold text-dark-bg/40 tracking-widest uppercase">Subtotal</span>
                        </div>
                        <AnimatePresence initial={false}>
                          {receiptItems.length === 0 ? (
                            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-body italic text-dark-bg/30 text-center py-3">
                              Ningún servicio seleccionado
                            </motion.p>
                          ) : (
                            receiptItems.map((item, i) => (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -8, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                exit={{ opacity: 0, x: 8, height: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="overflow-hidden"
                              >
                                <div className="flex justify-between items-center py-2 border-b border-dark-bg/5 last:border-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm leading-none">{item.icon}</span>
                                    <span className="text-[10px] font-body font-semibold text-dark-bg/75">{item.label}</span>
                                  </div>
                                  <motion.span
                                    key={item.cost}
                                    initial={{ scale: 1.1, color: "#BFA37E" }}
                                    animate={{ scale: 1, color: "#1a1a1a" }}
                                    transition={{ duration: 0.25 }}
                                    className="font-mono text-[10px] font-bold"
                                  >
                                    {formatCOP(item.cost)}
                                  </motion.span>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Perforation */}
                      <div className="relative flex items-center">
                        <div className="absolute -left-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="absolute -right-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-5" />
                      </div>

                      {/* Total */}
                      <div className="px-6 py-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-body font-bold tracking-widest uppercase text-dark-bg/40 mb-1">Total Estimado</p>
                            <p className="text-[8px] font-body text-dark-bg/30">Ref. aproximada</p>
                          </div>
                          <motion.span
                            key={totalCost}
                            initial={{ scale: 1.08, color: "#BFA37E" }}
                            animate={{ scale: 1, color: "#1a1a1a" }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                            className="font-mono font-bold text-xl text-dark-bg"
                          >
                            {formatCOP(totalCost)}
                          </motion.span>
                        </div>
                      </div>

                      {/* Perforation */}
                      <div className="relative flex items-center">
                        <div className="absolute -left-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="absolute -right-3 w-6 h-6 bg-dark-bg rounded-full z-10" />
                        <div className="w-full border-t-2 border-dashed border-[#BFA37E]/30 mx-5" />
                      </div>

                      {/* Mobile form */}
                      <div className="px-6 py-5">
                        <AnimatePresence mode="wait">
                          {!isBooked ? (
                            <form onSubmit={handleBookSubmit} className="space-y-2.5">
                              <p className="text-[8px] font-body font-bold tracking-widest uppercase text-dark-bg/40 mb-2">Completa para confirmar</p>
                              <input
                                type="text"
                                required
                                placeholder="Tu nombre completo"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors rounded-none font-body"
                              />
                              <input
                                type="tel"
                                required
                                placeholder="Número de celular"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none placeholder-dark-bg/30 text-dark-bg text-xs transition-colors rounded-none font-body"
                              />
                              <div className="grid grid-cols-2 gap-2 text-left">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-body font-bold text-dark-bg/50 block tracking-widest uppercase">Fecha</label>
                                  <DatePicker
                                    selected={bookingDate ? new Date(bookingDate + "T12:00:00") : null}
                                    onChange={(date) => setBookingDate(date ? format(date, "yyyy-MM-dd") : "")}
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/aaaa"
                                    minDate={new Date()}
                                    required
                                    className="w-full px-3 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors rounded-none font-body"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-body font-bold text-dark-bg/50 block tracking-widest uppercase">Hora inicio</label>
                                  <DatePicker
                                    selected={bookingTime ? parse(bookingTime, "HH:mm", new Date()) : null}
                                    onChange={(date) => setBookingTime(date ? format(date, "HH:mm") : "")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Hora"
                                    dateFormat="HH:mm"
                                    placeholderText="--:-- ----"
                                    required
                                    className="w-full px-3 py-2.5 bg-dark-bg/[0.04] border border-dark-bg/15 focus:border-primary-gold focus:outline-none text-dark-bg text-xs transition-colors rounded-none font-body"
                                  />
                                </div>
                              </div>
                              {errorMessage && (
                                <p className="text-red-600 text-[10px] font-body font-bold text-center bg-red-50 p-2 border border-red-200">
                                  {errorMessage}
                                </p>
                              )}
                              <button
                                type="submit"
                                disabled={totalCost === 0 || isSubmitLoading}
                                className="w-full bg-gradient-to-r from-primary-gold to-[#8C7355] text-white font-body font-bold py-3.5 transition-all shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50 mt-4 tracking-widest uppercase rounded-none"
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
                            <div className="text-center space-y-3 py-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-[#8C7355] rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-[11px] text-dark-bg/90 leading-relaxed font-body">
                                ¡Listo, <strong>{userName}</strong>! Te enviaremos el presupuesto de <strong>{formatCOP(totalCost)}</strong> a tu Whatsapp.
                              </p>
                              <button
                                onClick={() => { setIsBooked(false); setUserName(""); setUserPhone(""); }}
                                className="text-[10px] text-primary-gold hover:underline cursor-pointer font-body"
                              >
                                Hacer otra simulación
                              </button>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Scalloped bottom edge */}
                    <div
                      className="w-full h-4 bg-[#FAFAF7]"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 97.5% 60%, 95% 100%, 92.5% 60%, 90% 100%, 87.5% 60%, 85% 100%, 82.5% 60%, 80% 100%, 77.5% 60%, 75% 100%, 72.5% 60%, 70% 100%, 67.5% 60%, 65% 100%, 62.5% 60%, 60% 100%, 57.5% 60%, 55% 100%, 52.5% 60%, 50% 100%, 47.5% 60%, 45% 100%, 42.5% 60%, 40% 100%, 37.5% 60%, 35% 100%, 32.5% 60%, 30% 100%, 27.5% 60%, 25% 100%, 22.5% 60%, 20% 100%, 17.5% 60%, 15% 100%, 12.5% 60%, 10% 100%, 7.5% 60%, 5% 100%, 2.5% 60%, 0 100%)"
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
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-secondary-white text-dark-bg border-t border-primary-gold/15 shadow-[0_-8px_15px_rgba(0,0,0,0.1)] flex justify-between items-stretch h-[60px]">
              <div className="text-left flex flex-col justify-center pl-5 pr-2">
                <span className="text-[9px] text-dark-bg font-bold uppercase tracking-widest block">Total estimado</span>
                <span className="text-lg font-heading font-extrabold text-primary-gold font-mono leading-none mt-0.5">{formatCOP(totalCost)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(true)}
                className="bg-primary-gold hover:bg-primary-gold/90 text-white font-bold px-4 flex-1 max-w-[170px] flex items-center justify-center text-xs transition-colors cursor-pointer tracking-wide gap-1.5"
              >
                <span>Continuar Cotización</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
