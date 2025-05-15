/* pages/MainMenu.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
export default function Home() {
  // Aquí defines la información de cada banner
  const slides = [
    {
      title: 'Gran Tour de Copenhague',
      description: 'Descubre los rincones secretos de Copenhague en nuestro tour guiado.',
      buttonText: 'Más info',
      link: '/Tour01',
      internal: true,
      image: 'https://www.princess.com/content/dam/princess-headless/shorex/ports/copenhagen-denmark-waterway-night.jpg',
    },
    {
      title: 'Paseo en Bote + Walking Tour',
      description: 'Navega los canales de la ciudad en un tour exclusivo.',
      buttonText: 'Más info',      
      link: '/Tour02',
      internal: true,
      image: 'https://media.cntraveler.com/photos/5c005edf7732ca62ae9f71bc/16:9/w_2560,c_limit/GoBoatCopenhagen_Abdellah-Ihadian_GoBoat-Abdellah-Ihadian-5561.jpg',
    },
    {
      title: 'Mira lo que Copenhague tiene para ofrecerte',
      description: 'Conoce los beneficios que la ciudad ofrece a sus visitantes.',
      buttonText: 'Más info',
      link: 'https://www.visitcopenhagen.com/copenpay',
      internal: false,
      image: 'https://cdn-kabof.nitrocdn.com/nfjHFOYSVknMSLxSPIZUhvuJiKcRMGGc/assets/images/optimized/rev-ca84acd/img.locationscout.net/images/2017-06/tivoli-garden-sunset-denmark_l.jpeg',
    },
    // Agrega más objetos para más banners...
  ];
    return (
    <div className="flex-1 my-10 px-4">
      <div className="px-4 py-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-red-800">
          Free Tours Copenhague – Tours Gratuitos y Visitas Guiadas
        </h1>
        <p className="mt-4 text-gray-600">
          Conocé Copenhague como un local. Walking tours y paseos en barco en
          español e inglés. Grupos pequeños, historias reales, guías
          apasionados.
          ¡Reservá ahora y descubrí la ciudad con alma!

        </p>
      </div>

      {/* Carousel con tu array de slides */}
      <Carousel slides={slides} interval={4000} />

    </div>
  );
}
