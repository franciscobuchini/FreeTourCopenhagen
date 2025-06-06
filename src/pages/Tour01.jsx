// src/pages/Tour01.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Tour from '../components/Tour';

export default function Tour01() {
  const { t } = useTranslation();

  const detailsData = {
    duration: t('tour01.details.duration'),
    tips: t('tour01.details.tips', { returnObjects: true }),
    warnings: t('tour01.details.warnings', { returnObjects: true }),
    price: t('tour01.details.price'),
    meetingPoint: t('tour01.details.meetingPoint'),
    mapUrl: "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/",
    contactEmail: 'info@freetourcph.com',
    contactPhone: '+45 71 61 79 70'
  };

  const handleBooking = (data) => console.log('Nueva reserva Tour01:', data);

  return (
    <Tour
      title={t('tour01.title')}
      description={t('tour01.description', { returnObjects: true })}
      imageSrc="https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg"
      detailsData={detailsData}
      onBooking={handleBooking}
    />
  );
}
