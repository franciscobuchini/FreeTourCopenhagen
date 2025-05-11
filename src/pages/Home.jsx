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
      title: 'Tivoli Gardens',
      description: 'Visita el famoso parque de atracciones y jardines de Copenhague.',
      buttonText: 'Más info',      
      link: '/Tour02',
      internal: true,
      image: 'https://media.cntraveler.com/photos/5eb55988f52f4c0911cac29f/16:9/w_5231,h_2942,c_limit/TivoliGarden-PTGJ35.jpg',
    },
    {
      title: 'Paseo en barco',
      description: 'Navega los canales de la ciudad y disfruta de la vista.',
      buttonText: 'Reservar',      
      link: 'https://www.stromma.com/en-dk/copenhagen/sightseeing/sightseeing-by-boat/grand-tour/',
      internal: false,
      image: 'https://static.wixstatic.com/media/2fe4de_8fc0f272750244b0a8c4fb31c6931eee~mv2.jpg/v1/fill/w_2500,h_2000,al_c/2fe4de_8fc0f272750244b0a8c4fb31c6931eee~mv2.jpg',
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">
          Free Tours Copenhague – Tours Gratuitos y Visitas Guiadas
        </h1>
        <p className="mt-4 text-gray-600">
          Únete a nuestros Free Tours en Copenhague y descubre los lugares más icónicos de la ciudad sin coste alguno. 
          Ofrecemos tours gratuitos en Copenhague con guías locales expertos que te mostrarán el encantador Nyhavn, 
          la impresionante Sirenita y los recónditos rincones de la capital danesa. Reserva tu plaza hoy y vive la 
          mejor experiencia de visitas guiadas gratis en Copenhague.
        </p>
      </div>

      {/* Carousel con tu array de slides */}
      <Carousel slides={slides} interval={4000} />

    </div>
  );
}
