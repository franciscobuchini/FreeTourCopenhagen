import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSEO from '../hooks/useSEO';
import normalBikeImg from '../assets/bikes/normal-bike.png';
import eBikeImg from '../assets/bikes/e-bike.png';
import emailjs from '@emailjs/browser';
import { SERVICE_ID, PUBLIC_KEY, TEMPLATE_ID_BIKERENTAL } from '../config/email';

export default function BikeRental() {
  const { t, i18n } = useTranslation();
  useSEO('home'); // or we could create a bike rental SEO translation, but home is fine for now

  const [selectedBike, setSelectedBike] = useState(null);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '',
    rentalDate: new Date().toISOString().split('T')[0]
  });
  const [voucherGenerated, setVoucherGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'success' or 'error'

  const bikes = [
    {
      id: 'normal',
      type: t('bike_rental.normal_bike'),
      price: t('bike_rental.normal_price'),
      img: normalBikeImg
    },
    {
      id: 'ebike',
      type: t('bike_rental.ebike'),
      price: t('bike_rental.ebike_price'),
      img: eBikeImg
    }
  ];

  const handleSelect = (bike) => {
    setSelectedBike(bike);
    setVoucherGenerated(false);
    setEmailStatus(null);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.rentalDate) return;

    setIsGenerating(true);

    const templateParams = {
      tour_name: `BIKE RENTAL - ${selectedBike.type}`,
      tour_date: formData.rentalDate,
      tour_time: 'Anytime',
      participants: '1',
      language: i18n.language,
      notes: `Voucher Request for ${selectedBike.type}. Pick up at ${t('bike_rental.pickup_address')}.`,
      user_email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_BIKERENTAL, templateParams, PUBLIC_KEY);
      setEmailStatus('success');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setEmailStatus('error');
    }

    setIsGenerating(false);
    setVoucherGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 my-10 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-800 leading-tight">
          {t('bike_rental.title')}
        </h1>
        <p className="mt-4 text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t('bike_rental.subtitle')}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-800">
          📍 {t('bike_rental.pickup_title')}: {t('bike_rental.pickup_address')}
        </div>
      </div>

      {!voucherGenerated ? (
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {bikes.map((bike) => (
            <div 
              key={bike.id} 
              className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
                selectedBike?.id === bike.id ? 'border-red-600 scale-105' : 'border-transparent hover:border-red-300'
              }`}
            >
              <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
                <img src={bike.img} alt={bike.type} className="max-h-full object-contain mix-blend-multiply" loading="lazy" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">{bike.type}</h3>
                <p className="text-red-700 font-semibold text-xl mt-2 mb-6">{bike.price}</p>
                <button 
                  onClick={() => handleSelect(bike)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    selectedBike?.id === bike.id 
                    ? 'bg-red-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('bike_rental.select_btn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {selectedBike && !voucherGenerated && (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-6">{t('bike_rental.form_title')}</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('bike_rental.first_name')}</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('bike_rental.last_name')}</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('bike_rental.email')}</label>
              <input 
                type="email" 
                required 
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('bike_rental.rental_date')}</label>
              <input 
                type="date" 
                required 
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={formData.rentalDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({...formData, rentalDate: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-green-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isGenerating ? t('bike_rental.generating') : t('bike_rental.generate_btn')}
            </button>
          </form>
        </div>
      )}

      {/* VOUCHER UI */}
      {voucherGenerated && (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <h3 className="text-green-800 font-bold flex items-center gap-2">
              ✓ {t('bike_rental.voucher_ready')}
            </h3>
            {emailStatus === 'success' && <p className="text-green-700 mt-1 text-sm">{t('bike_rental.email_sent')}</p>}
            {emailStatus === 'error' && <p className="text-yellow-700 mt-1 text-sm">{t('bike_rental.email_error')}</p>}
          </div>

          <div id="print-voucher" className="bg-white border-2 border-gray-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-red-700"></div>
            <div className="text-center mb-8 pt-4 border-b pb-6">
              <h2 className="text-3xl font-black tracking-widest text-gray-900">{t('bike_rental.voucher_title')}</h2>
              <p className="text-gray-500 font-medium mt-1">Free Tour CPH</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">{t('bike_rental.presented_to')}</span>
                <span className="font-bold text-gray-900 text-lg">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">{t('bike_rental.bike_type')}</span>
                <span className="font-bold text-red-700">{selectedBike.type}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">{t('bike_rental.rental_date')}:</span>
                <span className="font-bold text-gray-900">{formData.rentalDate}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500 font-medium">{t('bike_rental.pickup_title')}:</span>
                <span className="font-bold text-gray-900">{t('bike_rental.pickup_address')}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500 font-medium">Date Generated:</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Please present this voucher upon arrival.</p>
              <p>www.freetourcph.com</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 no-print">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
            >
              🖨️ {t('bike_rental.download_print')}
            </button>
            <button 
              onClick={() => {
                setVoucherGenerated(false);
                setSelectedBike(null);
                setFormData({firstName: '', lastName: '', email: ''});
              }}
              className="px-6 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              {t('bike_rental.close')}
            </button>
          </div>
        </div>
      )}

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-voucher, #print-voucher * {
            visibility: visible;
          }
          #print-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
