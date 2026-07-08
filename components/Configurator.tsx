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
          .eq('company_id', companyId)
          .eq('unit', 'HORA');

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

      // Paso A: Registrar o Consultar Cliente
      let customerId = null;
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('company_id', companyId)
        .eq('phone', userPhone)
        .limit(1);

      if (existingCust?.[0]) {
        customerId = existingCust[0].id;
      } else {
        const { data: newCust, error: custError } = await supabase
          .from('customers')
          .insert([{
            company_id: companyId,
            name: userName,
            phone: userPhone,
            email: `${userName.toLowerCase().replace(/\s+/g, '')}@example.com`
          }])
          .select('id')
          .single();

        if (custError) throw custError;
        customerId = newCust.id;
      }

      // Paso B: Insertar la Factura (Venta POS)
      const invoiceNumber = `EV-${Date.now()}`;
      const { data: savedInvoice, error: invError } = await supabase
        .from('invoices')
        .insert([{
          company_id: companyId,
          customer_id: customerId,
          total_amount: totalCost,
          status: 'paid',
          payment_method: 'transfer',
          invoice_number: invoiceNumber
        }])
        .select('id')
        .single();

      if (invError) throw invError;

      // Paso C: Insertar el Detalle del Item
      const itemsToInsert: Array<InvoiceItemInsert> = [];
      
      productsList.forEach((p) => {
        const nameLower = p.name.toLowerCase();
        let isSelected = false;
        let qty = 1;

        if (nameLower.includes('mesero') && includeWaiters) {
          isSelected = true;
          qty = waiterCount;
        } else if ((nameLower.includes('cocinero') || nameLower.includes('chef')) && includeChefs) {
          isSelected = true;
          qty = chefCount;
        } else if ((nameLower.includes('vajilla') || nameLower.includes('utensilio')) && includeUtensils) {
          isSelected = true;
          qty = guests * hours;
        } else if ((nameLower.includes('mesa') || nameLower.includes('mobiliario')) && includeFurniture) {
          isSelected = true;
          qty = guests;
        } else if ((nameLower.includes('lugar') || nameLower.includes('salon') || nameLower.includes('espacio')) && includeSpace) {
          isSelected = true;
          qty = hours;
        } else if ((nameLower.includes('comida') || nameLower.includes('catering')) && includeCatering) {
          isSelected = true;
          qty = guests;
        }

        if (isSelected) {
          itemsToInsert.push({
            invoice_id: savedInvoice.id,
            product_id: p.id,
            name: p.name,
            price: Number(p.price),
            qty: Number(qty)
          });
        }
      });

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      // Paso D: Bloquear los Horas en el Gantt (actualizar columna description de productos)
      for (const item of itemsToInsert) {
        const product = productsList.find(p => p.id === item.product_id);
        if (!product) continue;

        let settings: ProductSettings = {};
        try {
          settings = JSON.parse(product.description || '{}');
        } catch (e) {
          settings = { description: product.description || '' };
        }

        if (!settings.occupiedSlots) {
          settings.occupiedSlots = [];
        }

        settings.occupiedSlots.push({
          date: bookingDate,
          time: bookingTime,
          duration: hours
        });

        const { error: prodUpdateError } = await supabase
          .from('products')
          .update({
            description: JSON.stringify(settings)
          })
          .eq('id', product.id);
        
        if (prodUpdateError) console.error(`Error actualizando disponibilidad del producto ${product.name}:`, prodUpdateError);
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
    <section id="cotizador" className="pt-14 pb-8 lg:py-20 bg-brand-brown/[0.02] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16 space-y-3 lg:space-y-4">
          <h2 className="text-2xl lg:text-4xl font-heading text-brand-brown">
            Calcula tu fiesta en segundos
          </h2>
          <p className="text-sm lg:text-lg text-brand-brown/80 font-light px-2">
            Arrastra los controles y selecciona los servicios que necesitas. 
            Mira el presupuesto estimado en tiempo real de forma transparente.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. DESKTOP VIEW (Visible only on large screens >= lg) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          
          {/* Controls - Left side (col-span-7) */}
          <div className="col-span-7 bg-brand-cream border border-brand-orange/10 p-8 rounded-[2rem] shadow-xl space-y-8">
            
            {/* Sliders */}
            <div className="space-y-6">
              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-brand-brown">
                  <span className="font-heading font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-orange" />
                    Duración del evento
                  </span>
                  <span className="font-mono font-bold text-lg text-brand-orange">
                    {hours} horas
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-brand-orange/20 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-xs text-brand-brown/50 px-1">
                  <span>Mínimo (2h)</span>
                  <span>6h</span>
                  <span>Máximo (12h)</span>
                </div>
              </div>

              {/* Guest Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-brand-brown">
                  <span className="font-heading font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-orange" />
                    Número de invitados
                  </span>
                  <span className="font-mono font-bold text-lg text-brand-orange">
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
                  className="w-full h-2 bg-brand-orange/20 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-xs text-brand-brown/50 px-1">
                  <span>10 pers.</span>
                  <span>100 pers.</span>
                  <span>200 pers.</span>
                </div>
              </div>
            </div>

            <hr className="border-brand-orange/10" />

            {/* Toggle Service Items */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-brand-brown font-semibold">
                ¿Qué servicios deseas añadir?
              </h3>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Waiters Toggle */}
                <div
                  onClick={() => setIncludeWaiters(!includeWaiters)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    includeWaiters
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm text-brand-brown font-bold">Meseros</h4>
                      <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(WAITER_RATE)} / hora c/u</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      includeWaiters ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                    }`}>
                      {includeWaiters && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {includeWaiters && (
                    <div className="mt-4 flex items-center justify-between bg-brand-cream/80 p-2 rounded-xl border border-brand-orange/20" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-semibold text-brand-brown/80">Cantidad:</span>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={waiterCount <= 1}
                          onClick={() => setWaiterCount(waiterCount - 1)}
                          className="w-7 h-7 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-brand-brown">{waiterCount}</span>
                        <button
                          disabled={waiterCount >= 10}
                          onClick={() => setWaiterCount(waiterCount + 1)}
                          className="w-7 h-7 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
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
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    includeChefs
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-heading text-sm text-brand-brown font-bold">Cocineros</h4>
                      <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(CHEF_RATE)} / hora c/u</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      includeChefs ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                    }`}>
                      {includeChefs && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  {includeChefs && (
                    <div className="mt-4 flex items-center justify-between bg-brand-cream/80 p-2 rounded-xl border border-brand-orange/20" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-semibold text-brand-brown/80">Cantidad:</span>
                      <div className="flex items-center gap-3">
                        <button
                          disabled={chefCount <= 1}
                          onClick={() => setChefCount(chefCount - 1)}
                          className="w-7 h-7 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-brand-brown">{chefCount}</span>
                        <button
                          disabled={chefCount >= 5}
                          onClick={() => setChefCount(chefCount + 1)}
                          className="w-7 h-7 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
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
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    includeUtensils
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-brand-brown font-bold">Vajilla y Utensilios</h4>
                    <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(UTENSIL_RATE)} / pers. por hora</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeUtensils ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                  }`}>
                    {includeUtensils && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Furniture Toggle */}
                <div
                  onClick={() => setIncludeFurniture(!includeFurniture)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    includeFurniture
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-brand-brown font-bold">Mesas y Mobiliario</h4>
                    <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(FURNITURE_RATE)} / pers. promedio</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeFurniture ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                  }`}>
                    {includeFurniture && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Space Toggle */}
                <div
                  onClick={() => setIncludeSpace(!includeSpace)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    includeSpace
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-brand-brown font-bold">Lugares para Eventos</h4>
                    <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(SPACE_RATE)} / hora</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeSpace ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                  }`}>
                    {includeSpace && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Catering Toggle */}
                <div
                  onClick={() => setIncludeCatering(!includeCatering)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    includeCatering
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-brand-orange/10 hover:border-brand-orange/40 bg-transparent"
                  }`}
                >
                  <div>
                    <h4 className="font-heading text-sm text-brand-brown font-bold">Comida y Catering</h4>
                    <p className="text-xs text-brand-brown/60 mt-1">{formatCOP(CATERING_RATE)} / plato promedio</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    includeCatering ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                  }`}>
                    {includeCatering && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Breakdown & Submit - Right side (col-span-5) */}
          <div className="col-span-5 bg-brand-brown text-brand-cream p-8 rounded-[2rem] shadow-xl sticky top-24 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-brand-cream/10">
              <Calculator className="w-6 h-6 text-brand-yellow" />
              <h3 className="font-heading text-xl font-bold">Resumen de Cotización</h3>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-4 text-sm font-light">
              
              {includeWaiters && (
                <div className="flex justify-between">
                  <span>{waiterCount} Meseros x {hours} horas</span>
                  <span className="font-mono font-semibold">{formatCOP(waitersCost)}</span>
                </div>
              )}

              {includeChefs && (
                <div className="flex justify-between">
                  <span>{chefCount} Cocineros x {hours} horas</span>
                  <span className="font-mono font-semibold">{formatCOP(chefsCost)}</span>
                </div>
              )}

              {includeUtensils && (
                <div className="flex justify-between">
                  <span>Vajilla ({guests} invitados x {hours}h)</span>
                  <span className="font-mono font-semibold">{formatCOP(utensilsCost)}</span>
                </div>
              )}

              {includeFurniture && (
                <div className="flex justify-between">
                  <span>Mobiliario para {guests} invitados</span>
                  <span className="font-mono font-semibold">{formatCOP(furnitureCost)}</span>
                </div>
              )}

              {includeSpace && (
                <div className="flex justify-between">
                  <span>Lugar para evento x {hours}h</span>
                  <span className="font-mono font-semibold">{formatCOP(spaceCost)}</span>
                </div>
              )}

              {includeCatering && (
                <div className="flex justify-between">
                  <span>Comida ({guests} platos)</span>
                  <span className="font-mono font-semibold">{formatCOP(cateringCost)}</span>
                </div>
              )}

              {totalCost === 0 && (
                <p className="text-brand-cream/60 italic text-center py-4">Selecciona algún servicio para cotizar</p>
              )}

            </div>

            <div className="border-t border-brand-cream/10 pt-4 flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className="text-brand-yellow font-heading font-semibold text-lg">Total Estimado</span>
                <span className="text-3xl font-heading font-bold text-brand-yellow tracking-wider font-mono">
                  {formatCOP(totalCost)}
                </span>
              </div>
              <p className="text-[10px] text-brand-cream/50 text-right">Precios de referencia aproximados. No contractual.</p>
            </div>

            {/* Quote Submission Mockup */}
            <AnimatePresence mode="wait">
              {!isBooked ? (
                <motion.form
                  key="form"
                  onSubmit={handleBookSubmit}
                  className="space-y-3 pt-2"
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
                    className="w-full px-4 py-3 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none placeholder-brand-cream/40 text-brand-cream text-sm transition-colors"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Número de celular"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none placeholder-brand-cream/40 text-brand-cream text-sm transition-colors"
                  />

                  {/* Date & Time fields */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-cream/70 block pl-1">Fecha del evento</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none text-brand-cream text-xs transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-cream/70 block pl-1">Hora de inicio</label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2.5 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none text-brand-cream text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-brand-yellow text-xs font-bold text-center leading-relaxed max-w-xs mx-auto pt-1 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={totalCost === 0 || isSubmitLoading}
                    className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Cotizar esta Configuración</span>
                        <ArrowRight className="w-4 h-4 text-brand-yellow group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="bg-brand-cream/10 border border-brand-yellow/30 p-5 rounded-2xl text-center space-y-3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-12 h-12 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand-yellow text-md">¡Solicitud Enviada!</h4>
                    <p className="text-xs text-brand-cream/80 mt-1 leading-relaxed">
                      Hola, <strong>{userName}</strong>. Hemos recibido tu pre-cotización de <strong>{formatCOP(totalCost)}</strong>. 
                      Un asesor te escribirá a tu Whatsapp <strong>{userPhone}</strong> en unos minutos para confirmar tu cotización y evento.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsBooked(false);
                      setUserName("");
                      setUserPhone("");
                    }}
                    className="text-xs text-brand-yellow hover:underline cursor-pointer"
                  >
                    Hacer otra simulación
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
                    step >= s ? "bg-brand-orange" : "bg-brand-orange/20"
                  }`} />
                )}
                <button
                  onClick={() => setStep(s)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all duration-300 cursor-pointer ${
                    step === s
                      ? "bg-brand-orange text-white ring-4 ring-brand-orange/15"
                      : step > s
                      ? "bg-brand-orange/10 text-brand-orange border-2 border-brand-orange/25"
                      : "bg-brand-cream text-brand-brown/30 border-2 border-brand-brown/10"
                  }`}
                >
                  {s}
                </button>
                <span className={`text-[9px] font-bold ${
                  step === s ? "text-brand-orange" : "text-brand-brown/40"
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
                  className="space-y-6 bg-brand-cream border border-brand-orange/10 p-6 rounded-[2rem] shadow-md"
                >
                  {/* Slider Duration */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-widest block">Duración del evento</span>
                      <span className="text-3xl font-heading font-extrabold text-brand-orange mt-0.5 block font-mono">{hours} horas</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full h-3 bg-brand-orange/20 rounded-lg appearance-none cursor-pointer accent-brand-orange touch-pan-y"
                    />
                    <div className="flex justify-between text-[9px] text-brand-brown/40 font-bold font-mono">
                      <span>MÍN (2H)</span>
                      <span>MED (6H)</span>
                      <span>MÁX (12H)</span>
                    </div>
                  </div>

                  {/* Slider Guests */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-brand-brown/50 uppercase tracking-widest block">Número de invitados</span>
                      <span className="text-3xl font-heading font-extrabold text-brand-orange mt-0.5 block font-mono">{guests} personas</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="5"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full h-3 bg-brand-orange/20 rounded-lg appearance-none cursor-pointer accent-brand-orange touch-pan-y"
                    />
                    <div className="flex justify-between text-[9px] text-brand-brown/40 font-bold font-mono">
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
                  className="space-y-3 bg-brand-cream border border-brand-orange/10 p-5 rounded-[2rem] shadow-md"
                >
                  <h3 className="font-heading text-sm text-brand-brown font-bold text-center pb-2">Selecciona tus Servicios</h3>
                  
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    
                    {/* Waiter Item */}
                    <div className="flex flex-col">
                      <div
                        onClick={() => setIncludeWaiters(!includeWaiters)}
                        className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                          includeWaiters ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-brand-brown">Meseros</h4>
                          <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(WAITER_RATE)} / hora c/u</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          includeWaiters ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
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
                            className="overflow-hidden bg-brand-orange/[0.01] px-4 pb-3 rounded-b-xl border-x border-b border-brand-orange/15 -mt-2 z-10"
                          >
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] font-semibold text-brand-brown/70">¿Cuántos necesitas?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={waiterCount <= 1}
                                  onClick={(e) => { e.stopPropagation(); setWaiterCount(waiterCount - 1); }}
                                  className="w-9 h-9 bg-brand-orange/10 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-brand-orange/20 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold w-4 text-center">{waiterCount}</span>
                                <button
                                  type="button"
                                  disabled={waiterCount >= 10}
                                  onClick={(e) => { e.stopPropagation(); setWaiterCount(waiterCount + 1); }}
                                  className="w-9 h-9 bg-brand-orange/10 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-brand-orange/20 cursor-pointer"
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
                        className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                          includeChefs ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-brand-brown">Cocineros</h4>
                          <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(CHEF_RATE)} / hora c/u</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          includeChefs ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
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
                            className="overflow-hidden bg-brand-orange/[0.01] px-4 pb-3 rounded-b-xl border-x border-b border-brand-orange/15 -mt-2 z-10"
                          >
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-[10px] font-semibold text-brand-brown/70">¿Cuántos necesitas?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={chefCount <= 1}
                                  onClick={(e) => { e.stopPropagation(); setChefCount(chefCount - 1); }}
                                  className="w-9 h-9 bg-brand-orange/10 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-brand-orange/20 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold w-4 text-center">{chefCount}</span>
                                <button
                                  type="button"
                                  disabled={chefCount >= 5}
                                  onClick={(e) => { e.stopPropagation(); setChefCount(chefCount + 1); }}
                                  className="w-9 h-9 bg-brand-orange/10 text-brand-orange font-bold rounded-lg flex items-center justify-center disabled:opacity-20 active:bg-brand-orange/20 cursor-pointer"
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
                      className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                        includeUtensils ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-brand-brown">Vajilla y Utensilios</h4>
                        <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(UTENSIL_RATE)} / pers. por hora</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeUtensils ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                      }`}>
                        {includeUtensils && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Furniture Item */}
                    <div
                      onClick={() => setIncludeFurniture(!includeFurniture)}
                      className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                        includeFurniture ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-brand-brown">Mesas y Mobiliario</h4>
                        <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(FURNITURE_RATE)} / pers. promedio</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeFurniture ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                      }`}>
                        {includeFurniture && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Space Item */}
                    <div
                      onClick={() => setIncludeSpace(!includeSpace)}
                      className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                        includeSpace ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-brand-brown">Lugares para Eventos</h4>
                        <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(SPACE_RATE)} / hora</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeSpace ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
                      }`}>
                        {includeSpace && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Catering Item */}
                    <div
                      onClick={() => setIncludeCatering(!includeCatering)}
                      className={`flex justify-between items-center h-14 px-4 rounded-xl border transition-all cursor-pointer ${
                        includeCatering ? "border-brand-orange bg-brand-orange/[0.03]" : "border-brand-orange/10"
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-brand-brown">Comida y Catering</h4>
                        <span className="text-[9px] text-brand-brown/50 block mt-0.5">{formatCOP(CATERING_RATE)} / plato promedio</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        includeCatering ? "bg-brand-orange border-brand-orange text-white" : "border-brand-brown/20"
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
                  className="bg-brand-brown text-brand-cream p-6 rounded-[2rem] shadow-xl space-y-6"
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-brand-cream/10">
                    <Calculator className="w-5 h-5 text-brand-yellow" />
                    <h3 className="font-heading text-base font-bold text-brand-yellow">Resumen Final</h3>
                  </div>

                  {/* Calculations Breakdown Mobile */}
                  <div className="space-y-3.5 text-xs font-light max-h-[160px] overflow-y-auto pr-1">
                    {includeWaiters && (
                      <div className="flex justify-between">
                        <span>{waiterCount} Meseros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(waitersCost)}</span>
                      </div>
                    )}
                    {includeChefs && (
                      <div className="flex justify-between">
                        <span>{chefCount} Cocineros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(chefsCost)}</span>
                      </div>
                    )}
                    {includeUtensils && (
                      <div className="flex justify-between">
                        <span>Vajilla ({guests} pers. x {hours}h)</span>
                        <span className="font-mono font-semibold">{formatCOP(utensilsCost)}</span>
                      </div>
                    )}
                    {includeFurniture && (
                      <div className="flex justify-between">
                        <span>Mobiliario ({guests} pers.)</span>
                        <span className="font-mono font-semibold">{formatCOP(furnitureCost)}</span>
                      </div>
                    )}
                    {includeSpace && (
                      <div className="flex justify-between">
                        <span>Lugar x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(spaceCost)}</span>
                      </div>
                    )}
                    {includeCatering && (
                      <div className="flex justify-between">
                        <span>Catering ({guests} platos)</span>
                        <span className="font-mono font-semibold">{formatCOP(cateringCost)}</span>
                      </div>
                    )}
                    {totalCost === 0 && (
                      <p className="text-brand-cream/50 italic text-center py-2">Ningún servicio seleccionado</p>
                    )}
                  </div>

                  <div className="border-t border-brand-cream/10 pt-4 flex flex-col gap-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-brand-yellow font-heading font-semibold">Total Estimado</span>
                      <span className="text-2xl font-heading font-bold text-brand-yellow tracking-wider font-mono">
                        {formatCOP(totalCost)}
                      </span>
                    </div>
                  </div>

                    {/* Submission Form mobile */}
                  <AnimatePresence mode="wait">
                    {!isBooked ? (
                      <form onSubmit={handleBookSubmit} className="space-y-2.5">
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-3 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none placeholder-brand-cream/30 text-brand-cream text-xs transition-colors"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Número de celular"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none placeholder-brand-cream/30 text-brand-cream text-xs transition-colors"
                        />

                        {/* Mobile Date & Time fields */}
                        <div className="grid grid-cols-2 gap-3 text-left">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-cream/70 block pl-1">Fecha del evento</label>
                            <input
                              type="date"
                              required
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full px-3 py-2.5 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none text-brand-cream text-xs transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-brand-cream/70 block pl-1">Hora de inicio</label>
                            <input
                              type="time"
                              required
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              className="w-full px-3 py-2.5 bg-brand-cream/10 border border-brand-cream/20 rounded-xl focus:border-brand-yellow focus:outline-none text-brand-cream text-xs transition-colors"
                            />
                          </div>
                        </div>

                        {errorMessage && (
                          <p className="text-brand-yellow text-[11px] font-bold text-center leading-relaxed max-w-xs mx-auto pt-1 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                            {errorMessage}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={totalCost === 0 || isSubmitLoading}
                          className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Solicitar Cotización</span>
                              <ArrowRight className="w-3.5 h-3.5 text-brand-yellow" />
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="bg-brand-cream/10 border border-brand-yellow/20 p-4 rounded-xl text-center space-y-2.5">
                        <div className="w-8 h-8 bg-brand-yellow/20 text-brand-yellow rounded-full flex items-center justify-center mx-auto text-base">
                          ✓
                        </div>
                        <p className="text-[11px] text-brand-cream/90 leading-relaxed">
                          ¡Listo, <strong>{userName}</strong>! Te enviaremos el presupuesto de <strong>{formatCOP(totalCost)}</strong> a Whatsapp.
                        </p>
                        <button
                          onClick={() => {
                            setIsBooked(false);
                            setUserName("");
                            setUserPhone("");
                          }}
                          className="text-[10px] text-brand-yellow hover:underline cursor-pointer"
                        >
                          Hacer otra simulación
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
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
                className="flex-1 border-2 border-brand-brown/10 text-brand-brown font-bold py-3 rounded-xl hover:bg-brand-orange/5 text-xs transition-all cursor-pointer h-11"
              >
                Atrás
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer h-11"
              >
                Siguiente
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sticky total bar at the very bottom (only on Step 1 and Step 2 in mobile) */}
          {step < 3 && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-brown text-brand-cream border-t border-brand-orange/15 shadow-[0_-8px_15px_rgba(0,0,0,0.1)] px-5 py-3 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[9px] text-brand-cream/50 uppercase tracking-widest block">Total estimado</span>
                <span className="text-lg font-heading font-extrabold text-brand-yellow font-mono leading-none">{formatCOP(totalCost)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(true)}
                className="bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/40 text-brand-yellow font-bold px-4 py-2 rounded-full text-[10px] transition-all flex items-center gap-1 cursor-pointer"
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
                  className="fixed bottom-0 left-0 right-0 z-50 bg-brand-brown text-brand-cream rounded-t-[2rem] shadow-2xl p-6 border-t border-brand-orange/25 max-h-[80vh] flex flex-col"
                >
                  {/* Drag/Close handle bar */}
                  <div 
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="w-10 h-1 bg-brand-cream/20 rounded-full mx-auto mb-5 shrink-0 cursor-pointer" 
                  />

                  <div className="flex justify-between items-center mb-5 shrink-0">
                    <h3 className="font-heading text-base font-bold text-brand-yellow flex items-center gap-1.5">
                      <Calculator className="w-4.5 h-4.5" />
                      Detalle de Cotización
                    </h3>
                    <button 
                      onClick={() => setIsBottomSheetOpen(false)}
                      className="p-1 rounded-full bg-brand-cream/10 hover:bg-brand-cream/20 text-brand-cream"
                      aria-label="Cerrar detalle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Calculations breakdown scroll */}
                  <div className="space-y-3.5 text-xs font-light overflow-y-auto py-2 flex-grow pr-1">
                    {includeWaiters && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>{waiterCount} Meseros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(waitersCost)}</span>
                      </div>
                    )}
                    {includeChefs && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>{chefCount} Cocineros x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(chefsCost)}</span>
                      </div>
                    )}
                    {includeUtensils && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>Vajilla ({guests} pers. x {hours}h)</span>
                        <span className="font-mono font-semibold">{formatCOP(utensilsCost)}</span>
                      </div>
                    )}
                    {includeFurniture && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>Mobiliario ({guests} pers.)</span>
                        <span className="font-mono font-semibold">{formatCOP(furnitureCost)}</span>
                      </div>
                    )}
                    {includeSpace && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>Lugar x {hours}h</span>
                        <span className="font-mono font-semibold">{formatCOP(spaceCost)}</span>
                      </div>
                    )}
                    {includeCatering && (
                      <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                        <span>Catering ({guests} platos)</span>
                        <span className="font-mono font-semibold">{formatCOP(cateringCost)}</span>
                      </div>
                    )}
                    {totalCost === 0 && (
                      <p className="text-brand-cream/50 italic text-center py-4">Ningún servicio seleccionado</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-brand-cream/10 mt-4 shrink-0">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-brand-yellow font-heading text-sm font-semibold">Total Estimado</span>
                      <span className="text-xl font-heading font-bold text-brand-yellow font-mono">{formatCOP(totalCost)}</span>
                    </div>
                    <button
                      onClick={() => { setIsBottomSheetOpen(false); setStep(3); }}
                      className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceder al Resumen</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-yellow" />
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
