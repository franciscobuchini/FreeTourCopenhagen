/* pages/MainMenu.jsx */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
      image: '/images/blog/nyhavn.jpg',
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

  const miniCarouselSlides = [
    { image: '/images/tours/carousel-1.jpg' },
    { image: '/images/tours/carousel-2.jpg' },
    { image: '/images/tours/carousel-3.jpg' },
    { image: '/images/tours/carousel-4.jpg' },
    { image: '/images/tours/carousel-5.jpg' },
    { image: '/images/tours/carousel-6.jpg' },
    { image: '/images/tours/carousel-7.jpg' },
    { image: '/images/tours/carousel-8.jpg' }
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq.q1'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.a1')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q2'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.a2')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q3'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.a3')
        }
      }
    ]
  };

  return (
    <div className="flex-1 my-10 px-4">
      {/* Schema Markup for TravelAgency (Google Rich Snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      {/* Schema Markup for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="px-4 py-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-800 leading-tight">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-gray-700 text-lg sm:text-xl max-w-3xl leading-relaxed">
          {t('home.subtitle')}
        </p>

        {/* Conversion Elements */}
        <div className="mt-8 flex flex-col items-start gap-5">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full border border-green-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t('hero.badge_free')}
          </div>
          
          <Link to="/Tour01" className="bg-red-700 text-white text-xl font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-red-800 hover:scale-105 transition-all w-full sm:w-auto text-center ring-4 ring-red-100">
            {t('hero.cta_book')}
          </Link>
          
          <div className="text-gray-700 font-medium flex items-center bg-gray-100 px-5 py-3 rounded-xl mt-2 w-full sm:w-auto border border-gray-200">
            {t('hero.schedule')}
          </div>
        </div>
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

      {/* FAQ Section */}
      <section className="mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-red-800 mb-6 text-center">
          {t('faq.title')}
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {[1, 2, 3].map(num => (
            <div key={num} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t(`faq.q${num}`)}</h3>
              <p className="text-gray-700">{t(`faq.a${num}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Photo Carousel */}
      <section className="mt-10 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-red-800 mb-2 text-center">
          {t('home.photos_title', { defaultValue: 'Nuestros Tours en Acción' })}
        </h2>
        <Carousel slides={miniCarouselSlides} className="h-48 sm:h-64 md:h-80 lg:h-96" interval={3000} />
      </section>
    </div>
  );
}
