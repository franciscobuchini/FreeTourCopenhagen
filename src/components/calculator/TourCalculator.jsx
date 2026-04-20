import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { calculateQuote, TOUR_DEFAULTS } from '../../utils/calculator';
import CalculatorForm from './CalculatorForm';
import QuoteSidebar from './QuoteSidebar';
import InvoiceModal from './InvoiceModal';

export default function TourCalculator() {
  const { t, i18n } = useTranslation();
  
  const [sessionUser, setSessionUser] = useState(null);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [activeOffer, setActiveOffer] = useState(null);
  const [offerClaimed, setOfferClaimed] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [authRequired, setAuthRequired] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    isDisembarking: 'No',
    pax: 1,
    language: 'ENG',
    date: '1988-11-08',
    startTime: '10:00',
    tour: '',
    customHours: 4,
    customItinerary: '',
    needsGuide: true,
    venue1: 'No Venue',
    venue2: 'No Venue',
    venue3: 'No Venue'
  });

  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    // Load pricing from single pricing_config table (same as original app.js)
    async function loadPrices() {
      try {
        const { data, error } = await supabase
            .from('pricing_config')
            .select('*')
            .eq('id', 1)
            .single();

        if (error || !data) {
            throw new Error(error?.message || 'No pricing_config row found (id=1)');
        }

        // pricing_config stores everything in one JSONB row — map to the shape calculator.js expects
        setPricingConfig(data);

        // Check for active promo offer
        const offer = data.active_offer || null;
        if (offer && offer.enabled && (!offer.valid_until || new Date(offer.valid_until) >= new Date())) {
            setActiveOffer(offer);
        }
      } catch (err) {
        console.error("Error loading pricing config:", err);
        setLoadingError(err.message || 'Unknown error');
      } finally {
        setIsLoadingPrices(false);
      }
    }
    loadPrices();
  }, []);

  useEffect(() => {
    if (!pricingConfig || !formData.date || !formData.startTime || !formData.tour) {
        setCurrentQuote(null);
        return;
    }
    
    const inputForCalc = { ...formData, email: sessionUser?.email, name: sessionUser?.name };
    const result = calculateQuote(inputForCalc, pricingConfig);
    
    if (result && !result.error) {
        let updatedResult = { ...result };
        if (offerClaimed && activeOffer?.enabled) {
            const dp = activeOffer.discount_percent || 0;
            const amt = Math.round(updatedResult.totalPrice * dp / 100);
            updatedResult.totalPrice -= amt;
            updatedResult.discountAmount = amt;
            updatedResult.discountPercent = dp;
            updatedResult.discountLabel = activeOffer.label;
        }
        setCurrentQuote({ data: inputForCalc, result: updatedResult });
    } else {
        setCurrentQuote({ error: true, message: result.message || 'Error' });
    }
  }, [formData, pricingConfig, sessionUser, offerClaimed, activeOffer]);


  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.agentName.value;
    const email = e.target.elements.agentEmail.value;
    setSessionUser({ name, email });
  };

  if (!sessionUser) {
    return (
      <div className="text-center max-w-md mx-auto p-10 mt-10 rounded-3xl shadow-2xl relative overflow-hidden" style={{background: 'linear-gradient(145deg, #0f1729, #1a2a4a)', border: '1px solid rgba(255,107,0,0.3)'}}>
        <div style={{position:'absolute', top:'-50px', left:'-50px', width:'150px', height:'150px', background:'radial-gradient(circle, rgba(255,107,0,0.2), transparent 70%)'}}></div>
        <img src="/img/logo FTC.jpeg" alt="Logo" className="w-24 h-24 mx-auto rounded-full border-2 border-orange-500 mb-6 shadow-[0_0_20px_rgba(255,107,0,0.3)]" />
        <h2 className="text-3xl font-extrabold text-white mb-2">{t('calculator.welcome_title')}</h2>
        <p className="text-gray-300 text-sm mb-8">{t('calculator.welcome_subtitle')}</p>
        <form onSubmit={handleAuthSubmit} className="text-left space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{t('calculator.name_label')}</label>
            <input type="text" name="agentName" required className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder={t('calculator.name_label')} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{t('calculator.email_label')}</label>
            <input type="email" name="agentEmail" required className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition" placeholder="tu@email.com" />
          </div>
          <button type="submit" className="w-full py-4 mt-4 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/30">
            {t('calculator.enter_btn')}
          </button>
        </form>
      </div>
    );
  }

  if (isLoadingPrices) {
    return <div className="text-center text-white mt-20 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        {t('b2b.loading')}
    </div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative w-full lg:items-start text-white">
      <div className="flex-1 w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl">
        {loadingError && (
            <div className="mb-4 bg-red-900/50 border border-red-500 rounded p-4 text-red-300">
                <p><strong>Error conectando a Supabase:</strong> {loadingError}</p>
            </div>
        )}
        <CalculatorForm 
            formData={formData} 
            setFormData={setFormData}
            pricingConfig={pricingConfig}
        />
      </div>

      <div className="lg:w-[400px] w-full flex-shrink-0">
        <QuoteSidebar 
            currentQuote={currentQuote}
            isAdminMode={isAdminMode}
            onToggleAdmin={() => setAuthRequired(true)}
            onEmailInvoice={() => setIsInvoiceModalOpen(true)}
            pricingConfig={pricingConfig}
            activeOffer={!offerClaimed ? activeOffer : null}
            onClaimOffer={() => setOfferClaimed(true)}
        />
      </div>

      {isInvoiceModalOpen && (
        <InvoiceModal 
            onClose={() => setIsInvoiceModalOpen(false)}
            currentQuote={currentQuote}
            sessionUser={sessionUser}
            pricingConfig={pricingConfig}
        />
      )}
      
      {authRequired && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-slate-900 p-8 rounded-2xl border border-orange-500/50 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
             <h3 className="text-xl font-bold text-white mb-2">{t('calculator.auth_required')}</h3>
             <p className="text-sm text-gray-400 mb-6">{t('calculator.auth_subtitle')}</p>
             <input type="password" id="admin-pw" autoFocus className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-white/10 mb-6 outline-none focus:border-orange-500" />
             <div className="flex justify-end gap-3">
               <button onClick={() => setAuthRequired(false)} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition">{t('calculator.cancel')}</button>
               <button onClick={() => {
                 const pw = document.getElementById('admin-pw').value;
                 if(pw === 'Cached10s!') {
                   setIsAdminMode(prev => !prev);
                   setAuthRequired(false);
                 } else {
                   alert('Incorrect password');
                 }
               }} className="px-5 py-2.5 text-sm font-bold bg-orange-600 rounded-xl text-white hover:bg-orange-500 transition">{t('calculator.confirm')}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
