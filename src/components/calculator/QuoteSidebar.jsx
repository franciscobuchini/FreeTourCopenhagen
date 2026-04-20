import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function QuoteSidebar({ currentQuote, isAdminMode, onToggleAdmin, onEmailInvoice, activeOffer, onClaimOffer }) {
  const { t, i18n } = useTranslation();
  const DKK_TO_EUR = 7.46;

  const formatCurrency = (amount) => new Intl.NumberFormat('da-DK').format(amount);

  const headerHTML = (
    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
        <div>
            <h3 className="text-xl font-black tracking-tight text-white m-0 leading-tight">B2B TOUR CPH</h3>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wider m-0">OFFICIAL QUOTE</p>
        </div>
        <button 
            onClick={onToggleAdmin}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition ${isAdminMode ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
            title="Toggle Admin View"
        >
            <Icon icon={isAdminMode ? "ph:lock-open-bold" : "ph:lock-bold"} className="text-xl" />
        </button>
    </div>
  );

  if (!currentQuote) {
      return (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full sticky top-6 min-h-[500px]">
              {headerHTML}
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <Icon icon="ph:receipt-bold" className="text-6xl text-gray-600 border border-gray-600 rounded-full p-3 mb-4" />
                  <p className="text-gray-400 font-medium">Complete the form to see the quote</p>
              </div>
          </div>
      );
  }

  if (currentQuote.error) {
      return (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-red-500/50 rounded-3xl p-6 shadow-2xl flex flex-col h-full sticky top-6 min-h-[500px]">
              {headerHTML}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Icon icon="ph:warning-circle-bold" className="text-6xl text-red-500 mb-4" />
                  <p className="text-red-400 font-medium">{currentQuote.message}</p>
              </div>
          </div>
      );
  }

  const { data, result } = currentQuote;
  const d = result.summary;
  const b = result.breakdown;

  const cleanDate = new Date(d.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES');
  
  const perPerson = Math.round(result.totalPrice / d.pax);
  const inEur = Math.round(result.totalPrice / DKK_TO_EUR);
  const eurPerPerson = Math.round(inEur / d.pax);

  const handleEmailInvoice = () => {
      const selected = new Date(data.date);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) {
          alert(t('calculator.past_date_alert', 'Atención: La fecha ingresada ya pasó.'));
          return;
      }
      onEmailInvoice();
  };

  const handleCopyText = (e) => {
      const selected = new Date(data.date);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) {
          alert(t('calculator.past_date_alert', 'Atención: La fecha ingresada ya pasó.'));
          return;
      }

      const btn = e.currentTarget;
      let txt = `B2B TOUR COPENHAGEN — QUOTE\n`;
      txt += `----------------------------------\n`;
      txt += `FROM:          ${data.name} (${data.email})\n`;
      txt += `TOUR:          ${d.tour === 'OTHER' ? t('calculator.other', 'OTHER') : d.tour}\n`;
      txt += `DATE:          ${cleanDate} at ${d.startTime}\n`;
      txt += `PAX:           ${d.pax}\n`;
      txt += `LANGUAGE:      ${d.language}\n`;
      txt += `DISEMBARKING:  ${d.isDisembarking}\n\n`;

      if (data.customItinerary && d.tour === 'OTHER') {
          txt += `ITINERARY:\n"${data.customItinerary}"\n\n`;
      }

      txt += `BREAKDOWN:\n`;
      if (b.guidePrice > 0) {
          txt += `- ${b.guideCount > 1 ? t('calculator.guides_label', 'Guides') : t('calculator.guide_label', 'Guide')} (${b.guideHours}h)${isAdminMode ? ': DKK ' + formatCurrency(b.guidePrice) : ''}\n`;
          txt += `  (${t('calculator.extra_note', 'Includes 30 min extra')})\n`;
      }
      if (b.busPrice > 0) txt += `- ${t('calculator.bus_label', 'Bus')} (${b.busCount}× ${b.busType})${isAdminMode ? ': DKK ' + formatCurrency(b.busPrice) : ''}\n`;
      
      if (b.venues.length > 0) {
          txt += `- Venues:\n`;
          b.venues.forEach(v => {
              txt += `  * ${v.venue} ${isAdminMode ? '(' + d.pax + 'x' + v.pricePerPax + '): DKK ' + formatCurrency(v.subtotal) : '(x' + d.pax + ')'}\n`;
          });
      }
      
      if (isAdminMode) {
          txt += `\n${t('calculator.net_total', 'Net Total')}:     DKK ${formatCurrency(b.netTotal)}\n`;
          txt += `${t('calculator.markup', 'Markup')} (${b.markupPercent}%): DKK ${formatCurrency(b.marginValue)}\n`;
      }

      txt += `\nTOTAL: DKK ${formatCurrency(result.totalPrice)}\n`;
      txt += `(DKK ${formatCurrency(perPerson)} ${t('calculator.total_pax', 'per pax')})\n`;
      txt += `${t('calculator.approx', 'Approx.')} EUR: ${formatCurrency(inEur)} € (${formatCurrency(eurPerPerson)} EUR / pax)\n`;
      
      navigator.clipboard.writeText(txt).then(() => {
          const origLabel = btn.innerHTML;
          btn.innerHTML = `<span class="flex items-center gap-2 justify-center"><Icon icon="ph:check-bold"/> Copied!</span>`;
          btn.classList.add('text-green-400', 'border-green-400/50', 'bg-green-400/10');
          setTimeout(() => {
              btn.innerHTML = origLabel;
              btn.classList.remove('text-green-400', 'border-green-400/50', 'bg-green-400/10');
          }, 3000);
      });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full sticky top-6">
        {headerHTML}

        {activeOffer && (
            <div className="mb-5 bg-gradient-to-r from-emerald-500/20 flex flex-col items-center justify-center to-emerald-700/10 border border-emerald-500/50 rounded-xl p-4 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-2xl animate-pulse">🎁</div>
                <div className="text-emerald-400 font-black text-3xl mb-1">{activeOffer.discount_percent}% OFF</div>
                <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-3">{activeOffer.label}</div>
                <button onClick={onClaimOffer} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 group-hover:scale-[1.02]">
                    Claim Discount Now
                </button>
            </div>
        )}

        {result.discountAmount && (
            <div className="mb-5 bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-2 text-center text-emerald-400 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Icon icon="ph:tag-bold" className="text-lg" /> {result.discountPercent}% OFF applied — saved {formatCurrency(result.discountAmount)} DKK
            </div>
        )}

        <div className="flex justify-between text-sm mb-4 font-semibold text-gray-300 bg-white/5 p-3 rounded-lg">
            <span className="text-orange-400 uppercase tracking-wider truncate mr-2">{d.tour === 'OTHER' ? t('calculator.other', 'OTHER') : d.tour}</span>
            <span className="text-right flex-shrink-0">{cleanDate} <span className="opacity-50 mx-1">|</span> {d.startTime}</span>
        </div>

        <div className="flex justify-between text-sm mb-6 border-b border-white/10 pb-6 text-gray-400 px-1">
            <span className="flex items-center gap-1"><Icon icon="ph:users-bold"/> Pax: <strong className="text-white ml-1">{d.pax}</strong></span>
            <span className="flex items-center gap-1"><Icon icon="ph:translate-bold"/> Lang: <strong className="text-white ml-1">{d.language}</strong></span>
        </div>

        <div className="flex-1 space-y-3 text-sm text-gray-300 overflow-y-auto pr-2 px-1">
            
            {b.guidePrice > 0 && (
                <div>
                   <div className="flex justify-between">
                       <span className="font-bold text-gray-200">
                            {b.guideCount > 1 ? t('calculator.guides_label', 'Guides') : t('calculator.guide_label', 'Guide')} ({b.guideHours}h):
                       </span>
                       <span className={`font-mono text-white ${!isAdminMode && 'hidden'}`}>DKK {formatCurrency(b.guidePrice)}</span>
                   </div>
                   <div className="text-[11px] text-gray-500 italic leading-tight mt-1 bg-black/20 p-2 rounded border-l-2 border-orange-500/30">
                       {t('calculator.extra_note')}
                   </div>
                </div>
            )}

            {b.busPrice > 0 && (
                 <div className="flex justify-between pt-3 border-t border-white/5">
                    <span className="font-bold text-gray-200">{t('calculator.bus_label')} ({b.busCount}× {b.busType}):</span>
                    <span className={`font-mono text-white ${!isAdminMode && 'hidden'}`}>DKK {formatCurrency(b.busPrice)}</span>
                 </div>
            )}

            {data.customItinerary && d.tour === 'OTHER' && (
                <div className="mt-4 p-3 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg">
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Icon icon="ph:map-trifold-bold"/> {t('calculator.itinerary_label')}</div>
                    <div className="italic text-gray-300 text-xs whitespace-pre-wrap">"{data.customItinerary}"</div>
                </div>
            )}

            {b.venues.length > 0 && (
                <div className="pt-3 border-t border-white/5">
                     <div className="text-orange-400 font-bold mb-2 flex items-center gap-1"><Icon icon="ph:ticket-bold"/> Venues</div>
                     {b.venues.map(v => (
                         <div key={v.venue} className="flex justify-between text-gray-400 text-sm py-1 bg-white/5 px-2 rounded mb-1">
                            <span>{v.venue} <small className="text-gray-500 ml-1">{isAdminMode ? `(${d.pax}×${v.pricePerPax})` : `(x${d.pax})`}</small></span>
                            <span className={`font-mono text-white ${!isAdminMode && 'hidden'}`}>DKK {formatCurrency(v.subtotal)}</span>
                         </div>
                     ))}
                </div>
            )}

            {isAdminMode && (
                <div className="mt-6 pt-4 border-t border-dashed border-white/20 bg-black/20 p-3 rounded-xl">
                     <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-300">{t('calculator.net_total')}</span>
                        <span className="font-mono text-gray-300">DKK {formatCurrency(b.netTotal)}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="font-bold text-gray-300">{t('calculator.markup')} ({b.markupPercent}%):</span>
                        <span className="font-mono text-green-400">+ DKK {formatCurrency(b.marginValue)}</span>
                     </div>
                </div>
            )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 text-right px-1">
            <div className="flex justify-between items-end mb-1">
                <span className="text-lg font-bold tracking-wider text-gray-400">TOTAL</span>
                <span className="text-3xl font-black text-orange-500 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">
                   {formatCurrency(result.totalPrice)} <span className="text-lg text-orange-500/60 font-semibold ml-1">DKK</span>
                </span>
            </div>
            <div className="text-sm text-gray-400 font-medium">
                {formatCurrency(perPerson)} DKK / {t('calculator.total_pax', 'pax')}
            </div>
            <div className="text-[13px] text-orange-400/80 font-semibold mt-1">
                 {t('calculator.approx', 'Approx.')} {formatCurrency(inEur)} EUR ({formatCurrency(eurPerPerson)} EUR/pax)
            </div>
        </div>

        <div className="flex gap-3 mt-6">
            <button onClick={handleCopyText} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 rounded-xl transition flex justify-center border border-white/10 text-sm">
                 <span className="flex items-center gap-2"><Icon icon="ph:copy-bold" className="text-lg"/> {t('calculator.copy_btn', 'Copy Text')}</span>
            </button>
            <button onClick={handleEmailInvoice} className="flex-[1.5] bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] flex justify-center text-sm">
                 <span className="flex items-center gap-2"><Icon icon="ph:paper-plane-right-fill" className="text-lg"/> {t('calculator.email_btn', 'Email Invoice')}</span>
            </button>
        </div>

    </div>
  );
}
