// src/pages/Tour.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingCalendar from '../components/BookingCalendar';
import TourDetails from '../components/TourDetails';
import Reviews from '../components/Reviews';
import Carousel from '../components/Carousel';

/**
 * Generic Tour page component
 * @param {Object} props
 * @param {string} props.title - Heading title
 * @param {string} props.description - Description paragraph(s)
 * @param {string} props.imageSrc - Hero image URL
 * @param {Array} props.carouselImages - Array of carousel image URLs
 * @param {Object} props.detailsData - Props for <TourDetails />
 * @param {Function} props.onBooking - booking handler
 * @param {number} [props.maxParticipants] - overrides default participants
 */
export default function Tour({
  title,
  description,
  imageSrc,
  carouselImages,
  detailsData,
  onBooking,
  maxParticipants,
}) {
  const { t } = useTranslation();

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return "0.00";
    const match = priceStr.match(/\d+/);
    return match ? match[0] + ".00" : "0.00";
  };

  const descriptionText = Array.isArray(description) ? description.join(' ') : (description || title);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "TouristTrip",
    "name": title,
    "image": imageSrc,
    "description": descriptionText,
    "touristType": [
      "Sightseeing",
      "Walking Tour",
      "Boat Tour"
    ],
    "provider": {
      "@type": "Organization",
      "name": "Free Tour CPH",
      "url": "https://freetourcph.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": getNumericPrice(detailsData?.price),
      "availability": "https://schema.org/InStock",
      "url": "https://freetourcph.com"
    }
  };

  return (
    <>
      {/* Schema Markup for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div className="overflow-hidden w-screen -mt-20 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-36">
        <img
          src={imageSrc}
          alt={title}
          fetchpriority="high"
          className="w-screen h-64 md:h-80 lg:h-128 object-cover"
        />
      </div>
<main className="flex-1 mb-20 md:mx-4 rounded-2xl bg-gray-50">
  <div className="flex flex-col lg:flex-row gap-10 p-4 sm:p-6 md:p-8 lg:p-10">

    {/* Left Column on desktop — all content on mobile */}
    <div className="w-full flex flex-col gap-10 lg:w-1/2">
      <div className="mt-10 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">
          {title}
        </h1>
        <p>{description}</p>
      </div>

      <TourDetails {...detailsData} />

      {/* Show BookingCalendar here on mobile */}
      <div className="block lg:hidden">
        <BookingCalendar
          tourName={title}
          maxParticipants={maxParticipants}
        />
      </div>

      <Reviews />
    </div>

    {/* Right Column: Booking (only on desktop) */}
    <div className="hidden lg:block w-full lg:w-1/2 lg:sticky lg:top-40">
      <BookingCalendar
        tourName={title}
        maxParticipants={maxParticipants}
      />
    </div>

  </div>
  
  {/* Mini Photo Carousel */}
  {carouselImages && carouselImages.length > 0 && (
    <section className="mt-4 mb-6 px-4 sm:px-6 md:px-8 lg:px-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-red-800 mb-2 text-center">
        {t('home.photos_title', { defaultValue: 'Nuestros Tours en Acción' })}
      </h2>
      <Carousel 
        slides={carouselImages.map(img => ({ image: img }))} 
        className="h-48 sm:h-64 md:h-80 lg:h-96" 
        interval={3000} 
      />
    </section>
  )}
</main>

    </>
  );
}