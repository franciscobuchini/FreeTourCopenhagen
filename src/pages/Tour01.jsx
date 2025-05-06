/* pages/Tour01.jsx */
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

export default function Tour01() {
  const handleBooking = (data) => {
    console.log('Nueva reserva:', data);
  };

  return (
    <>
      <div className="w-full">
        <img
          src='https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg'
          alt="Copenhague"
          className="w-full h-64 md:h-80 lg:h-126 object-cover -mt-20"
        />
      </div>
      <main className="flex-1 mb-20 px-0 -mt-4 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 px-4 lg:px-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4">
              <h1 className="text-5xl font-semibold text-red-700">Gran tour de Copenague</h1>
              <p>Descripción del tour</p>
            </div>
            <TourDetails />
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
