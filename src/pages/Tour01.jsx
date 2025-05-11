// pages/Tour01.jsx
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

export default function Tour01() {
  const handleBooking = data => console.log('Nueva reserva:', data);

  const detailsData = {
    duration: 'Aprox. 2 horas',
    includes: ['Guía local profesional', 'Auriculares para escuchar al guía'],
    tips: ['Llevar bebida', 'Llevar piloto de lluvia'],
    accessibility: 'Recorrido apto para silla de ruedas',
    operator: 'Tour Operadores XYZ',
    pets: 'Se admiten mascotas',
    meetingPoint: 'Kongens Nytorv, frente a la estatua central.',
    mapUrl:
      'https://www.google.com/maps/place/Kongens+Nytorv/@55.680525,12.5833821,532m/data=!3m2!1e3!4b1!4m6!3m5!1s0x465253182013b227:0x36248075ccf0be0!8m2!3d55.680522!4d12.585957!16zL20vMGdqbnA1?entry=ttu',
    contactEmail: 'info@freewalkingtour.com',
    contactPhone: '+34 600 000 000'
  };

  return (
    <>
      <div className="
        overflow-hidden
        w-screen
        -mt-20
        sm:-mx-8
        md:-mx-16
        lg:-mx-24
        xl:-mx-36
      ">
        <img
          src="https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg"
          alt="Copenhague"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
      <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4 p-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">Gran tour de Copenhague</h1>
              <p>¡Sumate a nuestro Free Walking Tour y explorá lo mejor de Copenhague con un guía local apasionado! Durante aprox. 2 horas, recorreremos los puntos más emblemáticos de la ciudad mientras descubrimos su historia, cultura y curiosidades escondidas.
              <br/><br/>
              Desde el encantador puerto de Nyhavn y la famosa Sirenita, hasta el Palacio de Amalienborg y la vibrante calle Strøget, te llevamos a conocer la ciudad como un verdadero local. Aprendé sobre los vikingos, la monarquía danesa, el estilo de vida escandinavo y los secretos que hacen de Copenhague una de las capitales más felices del mundo.
              <br/><br/>
              Nuestros tours son a base de propinas: vos decidís cuánto vale la experiencia. Ideal para mochileros, parejas, familias o viajeros curiosos que quieran conocer la ciudad de forma auténtica, entretenida y accesible.</p>
            </div>

            {/* Le paso toda la data como props */}
            <TourDetails {...detailsData} />

            <Reviews />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40 flex flex-col mt-10">
            <BookingCalendar onSubmit={handleBooking} />
          </div>
        </div>
      </main>
    </>
  );
}
