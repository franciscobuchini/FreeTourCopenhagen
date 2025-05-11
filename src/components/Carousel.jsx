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
    <div className="relative w-full overflow-hidden mt-8 h-96 lg:h-140 rounded-2xl">
      {/* Slides Container */}
<div
  className="flex transition-transform duration-600 h-full"
  style={{ transform: `translateX(-${current * 100}%)` }}
>
  {slides.map((slide, index) => (
    <div
      key={index}
      className="flex-shrink-0 align-top relative w-full h-full bg-center bg-cover"
      style={{ backgroundImage: `url(${slide.image})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 break-words">
          {slide.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white mb-4 break-words">
          {slide.description}
        </p>
        {slide.internal ? (
          <Link
            to={slide.link}
            className="inline-block whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-700 text-white text-sm sm:text-base rounded-lg w-min"
          >
            {slide.buttonText}
          </Link>
        ) : (
          <a
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-700 text-white text-sm sm:text-base rounded-lg w-min"
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
        className="hidden sm:flex items-center justify-center absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-1 sm:p-2 rounded-full z-20 hover:cursor-pointer w-8 sm:w-10"
      >
        &#10094;
      </button>
      <button
        onClick={handleNext}
        className="hidden sm:flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-1.5 sm:p-2 rounded-full z-20 hover:cursor-pointer w-8 sm:w-10"
      >
        &#10095;
      </button>
  
      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              idx === current ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
  
}
