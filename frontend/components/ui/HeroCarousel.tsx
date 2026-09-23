'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroCarouselProps {
  images: string[];
  interval?: number;
}

export function HeroCarousel({ images, interval = 6000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <>
      {images.map((src, idx) => (
        <div 
          key={src}
          className={`absolute inset-0 transition-all duration-[2.5s] ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-100 z-0'
          }`}
        >
          <Image 
            src={src}
            alt="KINGJOEBRIDD Editorial"
            fill
            priority={idx === 0}
            className="object-cover object-top opacity-70"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[var(--color-black)] via-[var(--color-black)]/50 to-[var(--color-black)]/10" />
    </>
  );
}
