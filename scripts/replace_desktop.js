const fs = require('fs');

let content = fs.readFileSync('c:/Users/USER/Documents/SalasCo/festa/components/Configurator.tsx', 'utf8');

const ticketTemplate = `          {/* Breakdown & Submit - Right side (col-span-5) */}
          <div className="col-span-5 relative sticky top-24">
            <div className="bg-secondary-white text-dark-bg rounded-[30px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative pb-[18px]">
              
              {/* Muescas laterales */}
              <div className="absolute w-[42px] h-[42px] bg-dark-bg rounded-full -left-[21px] top-[260px] z-10" />
              <div className="absolute w-[42px] h-[42px] bg-dark-bg rounded-full -right-[21px] top-[260px] z-10" />

              <div className="p-10 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-heading text-4xl font-bold mb-2">Resumen</h3>
                <p className="text-dark-bg/60 text-lg font-light">Cotización de tu evento</p>
              </div>

              <div className="mx-10 border-t-2 border-dashed border-dark-bg/20" />

              <div className="p-10">
                {/* Calculations Breakdown */}
                <div className="space-y-4 text-sm font-light mb-8">
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

                <div className="border-t-2 border-dashed border-dark-bg/10 pt-8 pb-4 flex justify-center">
                  {/* Fake Barcode SVG */}
                  <svg width="200" height="50" viewBox="0 0 200 50">
                    <rect x="0" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="8" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="14" y="0" width="6" height="50" fill="#0F0F10"/>
                    <rect x="24" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="30" y="0" width="8" height="50" fill="#0F0F10"/>
                    <rect x="42" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="50" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="56" y="0" width="10" height="50" fill="#0F0F10"/>
                    <rect x="70" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="78" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="84" y="0" width="6" height="50" fill="#0F0F10"/>
                    <rect x="94" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="102" y="0" width="8" height="50" fill="#0F0F10"/>
                    <rect x="114" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="120" y="0" width="6" height="50" fill="#0F0F10"/>
                    <rect x="130" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="138" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="144" y="0" width="10" height="50" fill="#0F0F10"/>
                    <rect x="158" y="0" width="4" height="50" fill="#0F0F10"/>
                    <rect x="166" y="0" width="2" height="50" fill="#0F0F10"/>
                    <rect x="172" y="0" width="6" height="50" fill="#0F0F10"/>
                    <rect x="182" y="0" width="8" height="50" fill="#0F0F10"/>
                    <rect x="194" y="0" width="6" height="50" fill="#0F0F10"/>
                  </svg>
                </div>

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
          </div>`;

const startIdx = content.indexOf('{/* Breakdown & Submit - Right side (col-span-5) */}');

// The end of the block we want to replace is where the "MOBILE WIZARD VIEW" comment starts
const endMarker = '{/* 2. MOBILE WIZARD VIEW (Visible only on mobile/tablet < lg) */}';
const endIdx = content.indexOf(endMarker);

if(startIdx !== -1 && endIdx !== -1) {
  // we actually need to look backwards from endIdx to find the '</div>' that closes the container
  const prefix = content.substring(0, startIdx);
  const suffix = content.substring(endIdx);
  
  // we know the block ends right before the div that wraps the 2. MOBILE WIZARD VIEW 
  // Let's just do a string replacement on the extracted block
  const oldBlock = content.substring(startIdx, endIdx);
  // find the last '</div>' in oldBlock
  const lastDivIdx = oldBlock.lastIndexOf('</div>');
  const veryLastDivIdx = oldBlock.lastIndexOf('</div>', lastDivIdx - 1);
  
  // we will replace the whole oldBlock with ticketTemplate + the necessary closing divs
  // Actually, wait, let's just use regular expressions carefully to replace between start marker and exactly line 696.
  content = content.substring(0, startIdx) + ticketTemplate + '\n\n        </div>\n\n        {/* ========================================================================= */}\n        ' + suffix;
  fs.writeFileSync('c:/Users/USER/Documents/SalasCo/festa/components/Configurator.tsx', content);
  console.log('Desktop Ticket UI applied.');
} else {
  console.log('Failed to find markers.');
}
