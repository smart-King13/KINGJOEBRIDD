'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/firefly-1.png',
  '/images/firefly-2.png',
  '/images/firefly-4.png',
  '/images/firefly-6.png',
  '/images/firefly-7.png',
  '/images/firefly-8.png',
  '/images/firefly-9.png',
  '/images/firefly-10.png',
];

export function StyleHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--color-black)]">
      {images.map((src, index) => {
        const isActive = index === currentIndex;
        const isRightSide = index % 2 === 0;

        return (
          <div
            key={src}
            className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out
              ${isRightSide ? 'justify-end pr-10 md:pr-32' : 'justify-start pl-10 md:pl-32'}
              ${isActive ? 'opacity-100' : 'opacity-0'}
              -mt-16 md:-mt-24
            `}
          >
            <div className="relative w-[80%] md:w-[50%] h-[85%]">
              <Image
                src={src}
                alt="Style Inspiration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        );
      })}
      {/* Add a subtle overlay to ensure text remains readable */}
      <div className="absolute inset-0 bg-[var(--color-black)]/30 z-10 pointer-events-none" />
    </div>
  );
}
