// src/pages/Tour02.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Tour from '../components/Tour';

export default function Tour02() {
  const { t } = useTranslation();

  const detailsData = {
    duration: t('tour02.details.duration'),
    includes: t('tour02.details.includes', { returnObjects: true }),
    tips: t('tour02.details.tips', { returnObjects: true }),
    warnings: t('tour02.details.warnings', { returnObjects: true }),
    price: t('tour02.details.price'),
    meetingPoint: t('tour02.details.meetingPoint'),
    mapUrl:
      "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/@55.675781,12.569285,532m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d55.675781!4d12.569285?entry=ttu",
    contactEmail: 'info@freetourcph.com',
    contactPhone: '+45 71 61 79 70',
    maxParticipants: 7
  };

  const handleBooking = (data) => console.log('Nueva reserva Tour02:', data);

  return (
    <Tour
      title={t('tour02.title')}
      description={t('tour02.description', { returnObjects: true })}
      imageSrc="https://media.cntraveler.com/photos/5c005edf7732ca62ae9f71bc/16:9/w_2560,c_limit/GoBoatCopenhagen_Abdellah-Ihadian_GoBoat-Abdellah-Ihadian-5561.jpg"
      detailsData={detailsData}
      onBooking={handleBooking}
      maxParticipants={7}
    />
  );
}
