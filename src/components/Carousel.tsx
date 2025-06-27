'use client';

import React, { useEffect, useState } from 'react';

const banners = [
  '/images/banner1.jpg',
  '/images/banner2.jpg',
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={banner} alt={`Banner ${index}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
