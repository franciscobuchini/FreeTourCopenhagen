import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WhatsAppButton() {
  const { t } = useTranslation();
  
  // Formatear el número: remover espacios y el +
  const rawPhone = "+45 71 61 79 70";
  const phone = rawPhone.replace(/\s+/g, '').replace('+', '');
  
  const message = encodeURIComponent(t('whatsapp.default_message'));
  const waLink = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] bg-green-500 text-white p-3 rounded-full shadow-xl hover:bg-green-600 transition-transform transform hover:scale-110 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12.031 0C5.385 0 0 5.388 0 12.033c0 2.128.552 4.195 1.6 6.02L.003 24l6.108-1.602a11.96 11.96 0 0 0 5.92 1.564h.005c6.645 0 12.03-5.388 12.03-12.033 0-3.218-1.253-6.246-3.528-8.522-2.274-2.275-5.302-3.53-8.507-3.527v.02zm.005 20.016a9.962 9.962 0 0 1-5.076-1.385l-.364-.216-3.766.988.998-3.673-.237-.377a9.975 9.975 0 0 1-1.528-5.319c0-5.509 4.484-9.996 9.998-9.996 2.67 0 5.178 1.04 7.066 2.929s2.926 4.398 2.926 7.068c0 5.511-4.484 9.981-9.993 9.981h-.02zm5.492-7.502c-.302-.151-1.782-.879-2.059-.979-.276-.1-.477-.151-.678.151-.201.302-.781.98-.957 1.181-.176.201-.352.226-.654.075-1.517-.756-2.614-1.38-3.639-2.909-.205-.306.203-.284.793-1.458.075-.151.037-.282-.038-.433-.075-.151-.678-1.631-.929-2.234-.244-.587-.492-.507-.678-.517-.176-.008-.377-.008-.578-.008-.201 0-.528.075-.804.377-.276.302-1.055 1.03-1.055 2.513 0 1.482 1.08 2.914 1.231 3.116.151.201 2.124 3.242 5.143 4.544 1.834.79 2.457.854 3.344.717.986-.151 2.871-1.173 3.272-2.306.402-1.132.402-2.102.282-2.306-.121-.201-.423-.302-.724-.452z" />
      </svg>
    </a>
  );
}
