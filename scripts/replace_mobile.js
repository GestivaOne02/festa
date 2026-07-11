const fs = require('fs');
let content = fs.readFileSync('c:/Users/USER/Documents/SalasCo/festa/components/Configurator.tsx', 'utf8');

const startIdx = content.indexOf('key="step3"');
const endMarker = '{/* Fixed bottom controls for Wizard */}';
const endIdx = content.indexOf(endMarker);

if(startIdx !== -1 && endIdx !== -1) {
  const prefixIdx = content.lastIndexOf('<motion.div', startIdx);
  const prefix = content.substring(0, prefixIdx);
  const suffix = content.substring(endIdx);
  
  const mobileTicketTemplate = `                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-secondary-white text-dark-bg rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] relative pb-[14px]">
                    
                    {/* Muescas laterales */}
                    <div className="absolute w-[30px] h-[30px] bg-dark-bg rounded-full -left-[15px] top-[140px] z-10" />
                    <div className="absolute w-[30px] h-[30px] bg-dark-bg rounded-full -right-[15px] top-[140px] z-10" />

                    <div className="p-6 text-center">
                      <div className="text-3xl mb-2">🎉</div>
                      <h3 className="font-heading text-xl font-bold mb-1 text-dark-bg">Resumen Final</h3>
                      <p className="text-dark-bg/60 text-xs font-light">Cotización de tu evento</p>
                    </div>

                    <div className="mx-6 border-t-2 border-dashed border-dark-bg/20" />

                    <div className="p-6">
                      {/* Calculations Breakdown Mobile */}
                      <div className="space-y-3.5 text-[10px] font-light max-h-[160px] overflow-y-auto pr-1 mb-6">
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

                      <div className="border-t-2 border-dashed border-dark-bg/10 pt-6 pb-2 flex justify-center">
                        {/* Fake Barcode SVG */}
                        <svg width="150" height="35" viewBox="0 0 200 50">
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

`;
  
  content = prefix + mobileTicketTemplate + suffix;
  fs.writeFileSync('c:/Users/USER/Documents/SalasCo/festa/components/Configurator.tsx', content);
  console.log('Mobile Ticket UI applied.');
} else {
  console.log('Markers not found');
}
