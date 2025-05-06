import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Carousel({ slides = [], interval = 5000 }) {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  // If no slides provided, don't render carousel
  if (!Array.isArray(slides) || length === 0) return null;

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [current, interval, length]);

  const handleNext = () => setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrent(prev => (prev === 0 ? length - 1 : prev - 1));

  return (
    <div className="relative w-full overflow-hidden mt-8 h-128 rounded-3xl">
      {/* Slides Container */}
      <div
        className="whitespace-nowrap transition-transform duration-600 h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            // Añadimos relative para que el overlay funcione en cada slide
            className="inline-block relative w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

            {/* Content on top */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <h2 className="text-4xl font-bold text-white mb-2">{slide.title}</h2>
              <p className="text-lg text-white mb-4">{slide.description}</p>
              {slide.internal ? (
                <Link
                  to={slide.link}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg w-min"
                >
                  {slide.buttonText}
                </Link>
              ) : (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg w-min"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full z-20 hover:cursor-pointer w-10"
      >
        &#10094;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full z-20 hover:cursor-pointer w-10"
      >
        &#10095;
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}