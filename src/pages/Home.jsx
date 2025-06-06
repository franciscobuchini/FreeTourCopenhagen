/* pages/MainMenu.jsx */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from '../components/Carousel';

export default function Home() {
  const { t } = useTranslation();

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

  return (
    <div className="flex-1 my-10 px-4">
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
    </div>
  );
}
