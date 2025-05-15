// pages/Tour02.jsx
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

export default function Tour01() {
  const handleBooking = data => console.log('Nueva reserva:', data);

  const detailsData = {
    duration: '2 horas aproximadamente',
    includes: ['Guía local profesional', 'Paseo en bote'],
    tips: ['Llevar bebida', 'Llevar piloto de lluvia'],
    accessibility: 'Recorrido apto para silla de ruedas',
    price: '120 € / 1000 DKK',
    meetingPoint: 'Ayuntamiento (Rådhuspladsen)',
    mapUrl:
      "https://www.google.com/maps/place/55%C2%B040'32.8%22N+12%C2%B034'09.4%22E/@55.675781,12.569285,532m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d55.675781!4d12.569285?entry=ttu&g_ep=EgoyMDI1MDUxMi4wIKXMDSoASAFQAw%3D%3D",
    contactEmail: 'info@freewalkingtour.com',
    contactPhone: '+34 600 000 000',
    maxParticipants: 7,
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
          src="https://media.cntraveler.com/photos/5c005edf7732ca62ae9f71bc/16:9/w_2560,c_limit/GoBoatCopenhagen_Abdellah-Ihadian_GoBoat-Abdellah-Ihadian-5561.jpg"
          alt="Paseo en Bote + Walking Tour"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
            <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-2 sm:p-6 md:p-8 lg:p-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">Paseo en Bote + Walking Tour</h1>
              <p>En este recorrido vivirás una experiencia íntima y exclusiva, limitada hasta solo 7 personas, para que disfrutes al máximo de cada detalle. Primero exploraremos los puntos más representativos de la ciudad, descubriendo su vida cotidiana e historia.
              Después, subiremos a un bote para navegar por los encantadores canales y barrios modernos rodeados de agua, ofreciendo una perspectiva relajada y mágica que solo un grupo pequeño puede disfrutar.
              </p>
            </div>

            {/* Le paso toda la data como props */}
            <TourDetails {...detailsData} />

            <Reviews />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40 flex flex-col mt-10">
            <BookingCalendar onSubmit={handleBooking} {...detailsData}/>  
          </div>
        </div>
      </main>
    </>
  );
}
