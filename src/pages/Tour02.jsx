// pages/Tour02.jsx
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

export default function Tour01() {
  const handleBooking = data => console.log('Nueva reserva:', data);

  const detailsData = {
    duration: '2 horas aproximadamente',
    includes: ['Guía local profesional', 'Auriculares para escuchar al guía'],
    tips: ['Llevar bebida', 'Llevar piloto de lluvia'],
    accessibility: 'Recorrido apto para silla de ruedas',
    operator: 'Tour Operadores XYZ',
    price: '120 €',
    meetingPoint: 'Ayuntamiento (Rådhuspladsen)',
    mapUrl:
      "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/@55.675781,12.569285,532m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d55.675781!4d12.569285?entry=ttu&g_ep=EgoyMDI1MDUxMi4wIKXMDSoASAFQAw%3D%3D",
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
          alt="Paseo en Barco + Walking Tour"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
      <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-10 lg:px-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">Paseo en Barco + Walking Tour</h1>
              <p>En este recorrido los llevaremos en un fascinante viaje por los puntos
              más representativos de la ciudad, donde podrán descubrir tanto la vida
              cotidiana local como la historia que la envuelve.
              <br/>
              Luego, subiremos a un bote para recorrer los encantadores canales y los barrios modernos
              rodeados por agua, una manera relajada y mágica de ver la ciudad desde otra perspectiva.
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
