// src/pages/Tour.jsx
import React from 'react';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';

/**
 * Generic Tour page component
 * @param {Object} props
 * @param {string} props.title - Heading title
 * @param {string} props.description - Description paragraph(s)
 * @param {string} props.imageSrc - Hero image URL
 * @param {Object} props.detailsData - Props for <TourDetails />
 * @param {Function} props.onBooking - booking handler
 * @param {number} [props.maxParticipants] - overrides default participants
 */
export default function Tour({
  title,
  description,
  imageSrc,
  detailsData,
  onBooking,
  maxParticipants,
}) {
  return (
    <>
      <div className="overflow-hidden w-screen -mt-20 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-36">
        <img
          src={imageSrc}
          alt={title}
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
      <main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-10 p-2 sm:p-6 md:p-8 lg:p-10">
          {/* Left Column: Details + Reviews */}
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            <div className="mt-10 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">
                {title}
              </h1>
              <p>{description}</p>
            </div>

            <TourDetails {...detailsData} />

            <Reviews />
          </div>

          {/* Right Column: Booking */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40 flex flex-col mt-10">
            <BookingCalendar
              tourName={title}                     
              maxParticipants={maxParticipants}
            />
          </div>
        </div>
      </main>
    </>
  );
}