// src/pages/Tour02.jsx
import React from 'react';
import Tour from '../components/Tour';

export default function Tour02() {
  const detailsData = {
      duration: '2 horas aproximadamente',
  includes: [
    'Guía local profesional',
    'Paseo en bote privado'
  ],
  tips: [
    'Llevar snacks y/o bebida',
    'Llevar piloto de lluvia'
  ],
  accessibility: 'Recorrido apto para silla de ruedas, avisar con anticipación.',
  warnings: [
    'En caso de lluvia realizamos el tour normalmente. Solo cancelamos por tormentas fuertes.'
  ],
  price: '120 € / 1000 DKK por bote (máx. 7 personas). Efectivo (DKK/EUR) o transferencia bancaria.',
  meetingPoint: 'Ayuntamiento (Rådhuspladsen)',
  mapUrl: "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/@55.675781,12.569285,532m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d55.675781!4d12.569285?entry=ttu",
  contactEmail: 'info@freetourcph.com',
  contactPhone: '+34 51 99 94 00',
  maxParticipants: 7
  };
  const handleBooking = (data) => console.log('Nueva reserva Tour02:', data);

  return (
    <Tour
      title="Paseo en Bote + Walking Tour"
      description={
        <>
          <p>En este recorrido vivirás una experiencia íntima y exclusiva, limitada hasta solo 7 personas, para que disfrutes al máximo de cada detalle. Primero exploraremos los puntos más representativos de la ciudad, descubriendo su vida cotidiana e historia.
          Después, subiremos a un bote para navegar por los encantadores canales y barrios modernos rodeados de agua, ofreciendo una perspectiva relajada y mágica que solo un grupo pequeño puede disfrutar.
          </p>
        </>
      }
      imageSrc="https://media.cntraveler.com/photos/5c005edf7732ca62ae9f71bc/16:9/w_2560,c_limit/GoBoatCopenhagen_Abdellah-Ihadian_GoBoat-Abdellah-Ihadian-5561.jpg"
      detailsData={detailsData}
      onBooking={handleBooking}
      maxParticipants={7}
    />
  );
}
