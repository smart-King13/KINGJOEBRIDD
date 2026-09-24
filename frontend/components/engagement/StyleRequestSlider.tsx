'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const FALLBACK_IMAGES = [
  '/images/w-collection 10.jpg',
  '/images/m-collection 6.jpg',
  '/images/t-collection 3.jpg',
  '/images/w-collection 11.jpg',
  '/images/m-collection 4.jpg',
  '/images/t-collection 2.jpg',
  '/images/w-collection 8.jpg',
  '/images/m-collection 9.jpg',
  '/images/w-collection 3.jpg',
  '/images/t-collection 5.jpg',
  '/images/m-collection 2.jpg',
  '/images/w-collection 6.jpg',
];

export function StyleRequestSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FALLBACK_IMAGES.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {FALLBACK_IMAGES.map((src, idx) => (
        <div 
          key={src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: idx === currentIndex ? 0.6 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt="KingJoeBridd Collection"
            className="w-full h-full object-cover animate-pan-image"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
    </>
  );
}
