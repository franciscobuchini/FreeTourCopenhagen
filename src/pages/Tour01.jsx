// src/pages/Tour01.jsx
import React from 'react';
import Tour from '../components/Tour';

export default function Tour01() {
  const detailsData = {
    duration: '1 hora aproximadamente',
    includes: ['Guía local profesional', 'Auriculares para escuchar al guía'],
    tips: ['Traer bebida', 'Traer piloto de lluvia o paraguas'],
    accessibility: 'Recorrido apto para silla de ruedas, avisar con anticipación.',
    warnings: ['En caso de lluvia realizamos el tour normalmente. Solo cancelamos por tormentas fuertes.'],
    price: 'Tour gratuito (propinas bienvenidas)',
    meetingPoint: 'Ayuntamiento (Rådhuspladsen)',
    mapUrl:
      "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/",
    contactEmail: 'info@freetourcph.com',
    contactPhone: '+34 51 99 94 00'
  };
  const handleBooking = (data) => console.log('Nueva reserva Tour01:', data);

  return (
    <Tour
      title="Gran tour de Copenhague"
  description={
    <>
      <p>
        ¡Sumate a nuestro Free Walking Tour y explorá lo mejor de Copenhague
        con un guía local apasionado! Descubriremos monumentos, palacios y
        rincones llenos de historia, caminando por sus calles como si fuéramos
        locales, sintiendo el pulso cotidiano de la vida danesa.
      </p>
      <p>
        Desde el encantador puerto de Nyhavn y la famosa Sirenita, hasta el
        Palacio de Amalienborg y la vibrante calle Strøget, te llevamos a
        conocer la ciudad como un verdadero local. Aprendé sobre los vikingos,
        la monarquía danesa, el estilo de vida escandinavo y los secretos que
        hacen de Copenhague una de las capitales más felices del mundo.
      </p>
    </>
  }
      imageSrc="https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg"
      detailsData={detailsData}
      onBooking={handleBooking}
      // no maxParticipants para este tour
    />
  );
}