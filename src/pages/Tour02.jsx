// pages/Tour02.jsx
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
          src="https://media.cntraveler.com/photos/5eb55988f52f4c0911cac29f/16:9/w_5231,h_2942,c_limit/TivoliGarden-PTGJ35.jpg"
          alt="Tivoli Gardens"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
      <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-10 lg:px-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">Tivoli Gardens Tour</h1>
              <p>Unite a nuestro Free Walking Tour y descubrí la magia que rodea a Tivoli Gardens, uno de los parques de atracciones más antiguos y encantadores del mundo. Pero este tour es mucho más que un paseo por el parque: te llevamos a recorrer el corazón histórico y moderno de Copenhague que lo rodea.
              <br/><br/>
              En este tour de 1.5 a 2 horas, conocerás la historia detrás de Tivoli, su influencia en Walt Disney y su importancia cultural para los daneses. Pasearemos por la Plaza del Ayuntamiento, la bulliciosa Vesterbrogade, y exploraremos rincones escondidos con historias fascinantes, arquitectura impactante y leyendas urbanas.
              <br/><br/>
              Perfecto para quienes quieren empaparse del ambiente vibrante de la ciudad, entender su vida cotidiana y ver cómo conviven lo clásico con lo contemporáneo. El tour es completamente gratuito, basado en propinas, y está guiado por un experto local que hará que te enamores de esta parte única de Copenhague.

              </p>
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
