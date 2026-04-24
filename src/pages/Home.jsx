/* pages/MainMenu.jsx */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from '../components/Carousel';
import useSEO from '../hooks/useSEO';

export default function Home() {
  const { t } = useTranslation();

  useSEO({
    title: t('seo.home.title'),
    description: t('seo.home.description')
  });

  const slides = [
    {
      title: t('home.slides.0.title'),
      description: t('home.slides.0.description'),
      buttonText: t('home.slides.0.buttonText'),
      link: '/Tour01',
      internal: true,
      image: 'https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg',
    },
    {
      title: t('home.slides.1.title'),
      description: t('home.slides.1.description'),
      buttonText: t('home.slides.1.buttonText'),
      link: '/Tour02',
      internal: true,
      image: 'https://media.cntraveler.com/photos/5c005edf7732ca62ae9f71bc/16:9/w_2560,c_limit/GoBoatCopenhagen_Abdellah-Ihadian_GoBoat-Abdellah-Ihadian-5561.jpg',
    },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Free Tour CPH",
    "image": slides[0]?.image || "https://freetourcph.com/logo.png",
    "@id": "https://freetourcph.com",
    "url": "https://freetourcph.com",
    "telephone": "+45 71 61 79 70",
    "email": "info@freetourcph.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Copenhagen",
      "addressCountry": "DK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 55.676098,
      "longitude": 12.568337
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "845"
    }
  };

  return (
    <div className="flex-1 my-10 px-4">
      {/* Schema Markup for TravelAgency (Google Rich Snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div className="px-4 py-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-800">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-gray-600">{t('home.subtitle')}</p>
      </div>

      <Carousel slides={slides} interval={4000} />

      {/* Sección Quiénes Somos */}
      <section className="mt-10 p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-red-800 mb-4">
          {t('home.about.title')}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t('home.about.paragraph1')}<br /><br />
          {t('home.about.paragraph2')}<br /><br />
          {t('home.about.paragraph3')}
        </p>
      </section>

      {/* SEO Guide Section */}
      <section className="mt-10 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-red-800 mb-4">
          {t('home.seo_guide.title')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {t('home.seo_guide.intro')}
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
          {t('home.seo_guide.must_see_title')}
        </h3>
        <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
          {(t('home.seo_guide.must_see_items', { returnObjects: true }) || []).map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }}></li>
          ))}
        </ul>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
          {t('home.seo_guide.days_title')}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t('home.seo_guide.days_intro')}
        </p>
        <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
          {(t('home.seo_guide.days_items', { returnObjects: true }) || []).map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }}></li>
          ))}
        </ul>

        <div className="bg-white p-4 border-l-4 border-red-800 text-gray-700 italic mb-6 shadow-sm rounded-r-lg" 
             dangerouslySetInnerHTML={{ __html: t('home.seo_guide.tip') }}>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
          {t('home.seo_guide.why_us_title')}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {t('home.seo_guide.why_us_text')}
        </p>
      </section>
    </div>
  );
}
