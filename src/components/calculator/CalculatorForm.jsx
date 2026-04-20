import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Icon } from '@iconify/react';
import { TOUR_DEFAULTS } from '../../utils/calculator';

export default function CalculatorForm({ formData, setFormData, pricingConfig }) {
  const { t, i18n } = useTranslation();
  // Local state so the pax field can be cleared without snapping back to "1"
  const [paxInput, setPaxInput] = useState(String(formData.pax));
  
  const updateField = (field, value) => {
    if (field === 'date' && value) {
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) {
            alert(t('calculator.past_date_alert', 'Atención: La fecha ingresada ya pasó.'));
        }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const combinedToursRaw = { ...TOUR_DEFAULTS, ...(pricingConfig?.custom_tours || {}) };
  const combinedTours = Object.fromEntries(
    Object.entries(combinedToursRaw).filter(([_, info]) => !info.deleted)
  );
  const tourOptions = [...Object.keys(combinedTours), 'OTHER'];

  const selectedTourInfo = combinedTours[formData.tour];

  // Venues dynamic list
  const availableVenues = pricingConfig && pricingConfig.venue_prices 
    ? Object.keys(pricingConfig.venue_prices).filter(v => v !== 'Other')
    : [];

  const translateTourText = (text) => {
      if (!text || i18n.language === 'es') return text;
      // Provide basic EN dictionary locally
      let translated = text;
      const dict = {
          "Caminata": "Walking",
          "Paseo a pie": "Walking",
          "Bote por canales": "Canal Boat",
          "Bote": "Boat",
          "Traslado directo": "Direct Transfer",
          "La Sirenita": "Little Mermaid",
          "Regreso al puerto": "Return to port",
          "Vistas panorámicas principales": "Main panoramic views",
          "Aeropuerto": "Airport",
          "Puerto": "Port",
          "u Hotel": "or Hotel",
          "Canales": "Canals",
          "highlights ciudad": "city highlights",
          "Vistas desde el agua": "Views from the water"
      };
      if (i18n.language === 'en') {
          for (const [es, trans] of Object.entries(dict)) {
              translated = translated.replace(new RegExp(es, 'gi'), trans);
          }
      }
      return translated;
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4 border-b border-white/10 pb-6">
          <img src="/img/logo FTC.jpeg" alt="Logo" className="w-14 h-14 rounded-full border border-orange-500/50 shadow-lg" />
          <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Tour Calculator</h1>
              <p className="text-sm text-gray-400">{t('calculator.header_subtitle', 'Generador rápido de cotizaciones')}</p>
          </div>
      </header>

      {/* Section 1 */}
      <div>
        <h2 className="text-lg font-bold text-orange-500 mb-4 flex items-center gap-2">
            <Icon icon="ph:info-bold" /> {t('calculator.basic_info', 'Basic Info')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                    🚢 {t('calculator.is_cruise', 'Is a Disembarking tour? (Cruise)')}
                </label>
                <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
                    <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition text-sm font-bold ${formData.isDisembarking === 'Yes' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5'}`}>
                        <input type="radio" value="Yes" checked={formData.isDisembarking === 'Yes'} onChange={(e)=>updateField('isDisembarking', e.target.value)} className="hidden" />
                        {t('calculator.yes', 'Yes')}
                    </label>
                    <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition text-sm font-bold ${formData.isDisembarking === 'No' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5'}`}>
                        <input type="radio" value="No" checked={formData.isDisembarking === 'No'} onChange={(e)=>updateField('isDisembarking', e.target.value)} className="hidden" />
                        {t('calculator.no', 'No')}
                    </label>
                </div>
                {formData.isDisembarking === 'Yes' && (
                    <div className="text-xs text-gray-400 mt-1 pl-3 border-l-2 border-orange-500 p-1 bg-orange-500/5 rounded-r">
                        <Trans i18nKey="calculator.luggage_note">
                            🧳 <strong>Capacidad Reducida:</strong> Para tours de desembarque con maletas, se calcula un uso máximo del 70% de los asientos del bus.
                        </Trans>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.pax_label', 'How many pax?')}</label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={paxInput}
                  onChange={(e) => setPaxInput(e.target.value)}
                  onBlur={(e) => {
                    const parsed = parseInt(e.target.value);
                    const valid = isNaN(parsed) || parsed < 1 ? 1 : parsed;
                    setPaxInput(String(valid));
                    setFormData(prev => ({ ...prev, pax: valid }));
                  }}
                  className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition font-semibold"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.lang_label', 'Language')}</label>
                <select value={formData.language} onChange={(e)=>updateField('language', e.target.value)} className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition font-semibold appearance-none">
                    <option value="ENG">🇬🇧 ENG</option>
                    <option value="ESP">🇪🇸 ESP</option>
                    <option value="ITA">🇮🇹 ITA</option>
                    <option value="POR">🇵🇹 POR</option>
                    <option value="FRE">🇫🇷 FRE</option>
                    <option value="GER">🇩🇪 GER</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.date_label', 'Date')}</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={(e)=>updateField('date', e.target.value)} className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition font-semibold [color-scheme:dark]" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.time_label', 'Start Time')}</label>
                <input type="time" value={formData.startTime} onChange={(e)=>updateField('startTime', e.target.value)} className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition font-semibold [color-scheme:dark]" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-3 mt-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">{t('calculator.which_tour', 'Which tour do you want to quote?')}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {tourOptions.map(tOption => (
                        <label key={tOption} className={`relative flex items-center justify-center p-3 rounded-xl border cursor-pointer font-semibold text-sm transition-all overflow-hidden ${formData.tour === tOption ? 'bg-orange-600/20 border-orange-500 text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]' : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                            <input type="radio" value={tOption} checked={formData.tour === tOption} onChange={(e)=>updateField('tour', e.target.value)} className="hidden" />
                            {formData.tour === tOption && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>}
                            <span className="text-center">{tOption === 'OTHER' ? t('calculator.other', 'OTROS') : tOption}</span>
                        </label>
                    ))}
                </div>
            </div>

            {selectedTourInfo && formData.tour !== 'OTHER' && (
                <div className="md:col-span-2 lg:col-span-3 mt-4 bg-black/20 rounded-xl p-5 border border-white/5 shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex gap-3">
                            <span className="text-gray-500 uppercase tracking-wider font-bold w-24 flex-shrink-0">{t('calculator.info_transport', 'Transport')}</span>
                            <span className="font-semibold">{translateTourText(selectedTourInfo.transport) || '—'}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-gray-500 uppercase tracking-wider font-bold w-24 flex-shrink-0">{t('calculator.info_duration', 'Duration')}</span>
                            <span className="font-semibold">{selectedTourInfo.hours} hs</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-gray-500 uppercase tracking-wider font-bold w-24 flex-shrink-0">{t('calculator.info_sights', 'Sights')}</span>
                            <span className="text-gray-300">{translateTourText(selectedTourInfo.sights) || '—'}</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-gray-500 uppercase tracking-wider font-bold w-24 flex-shrink-0">{t('calculator.info_includes', 'Includes')}</span>
                            <span className="text-green-400 font-semibold flex items-center gap-2">
                                <Icon icon="ph:ticket-bold" /> {selectedTourInfo.venues?.length > 0 ? selectedTourInfo.venues.join(', ') : t('calculator.info_no_venues', 'No venues')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Section 2: Custom Tour */}
      {formData.tour === 'OTHER' && (
          <div className="pt-6 border-t border-white/10 animate-fade-in relative">
              <div className="absolute -left-6 top-8 w-1 h-20 bg-orange-500 rounded-r-lg"></div>
              <h2 className="text-lg font-bold text-orange-500 mb-6 flex items-center gap-2">
                  <Icon icon="ph:faders-bold" /> {t('calculator.custom_options', 'Custom Tour Options')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.hours_label', 'How many hours?')}</label>
                    <input type="number" min="1" max="10" step="0.5" value={formData.customHours} onChange={(e)=>updateField('customHours', parseFloat(e.target.value)||4)} className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition font-semibold" />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.needs_guide', 'Do they need a guide?')}</label>
                    <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
                        <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition text-sm font-bold ${formData.needsGuide === true ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5'}`}>
                            <input type="radio" value="true" checked={formData.needsGuide === true} onChange={(e)=>updateField('needsGuide', true)} className="hidden" />
                            {t('calculator.yes', 'Yes')}
                        </label>
                        <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer transition text-sm font-bold ${formData.needsGuide === false ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5'}`}>
                            <input type="radio" value="false" checked={formData.needsGuide === false} onChange={(e)=>updateField('needsGuide', false)} className="hidden" />
                            {t('calculator.no', 'No')}
                        </label>
                    </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                  <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.venues_label', 'Venues (Optional)')}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['venue1', 'venue2', 'venue3'].map(vKey => (
                          <select key={vKey} value={formData[vKey]} onChange={(e)=>updateField(vKey, e.target.value)} className="px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-sm appearance-none cursor-pointer text-gray-300">
                              <option value="No Venue">No Venue</option>
                              <option value="Other">Other (Manual Quote)</option>
                              {availableVenues.map(ven => (
                                  <option key={ven} value={ven}>{ven}</option>
                              ))}
                          </select>
                      ))}
                  </div>
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('calculator.itinerary_label', 'Itinerary / Special Notes')}</label>
                  <textarea 
                      rows="3" 
                      value={formData.customItinerary} 
                      onChange={(e)=>updateField('customItinerary', e.target.value)}
                      placeholder={t('calculator.itinerary_placeholder', 'Describe los lugares...')} 
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-orange-500 outline-none transition text-sm placeholder-gray-600 resize-y"
                  ></textarea>
              </div>
          </div>
      )}
    </div>
  );
}
