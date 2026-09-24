'use client';

import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CategoryCardProps {
  title: string;
  desc: string;
  images: string[];
  delay?: number;
}

export function CategoryCard({ title, desc, images, delay = 0 }: CategoryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    // Add a random offset to interval so they don't all cycle at the exact same time
    const interval = 4000 + Math.random() * 2000;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <ScrollReveal direction="up" delay={delay} className="group cursor-pointer relative h-[400px] md:h-[500px] overflow-hidden bg-[var(--color-black)]">
      {/* Images */}
      {images.map((img, idx) => (
        <img 
          key={`${img}-${idx}`}
          src={img} 
          alt={title} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ease-in-out ${
            idx === currentIndex 
              ? 'opacity-90 group-hover:scale-110 z-10' 
              : 'opacity-0 scale-100 z-0'
          }`}
        />
      ))}
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-20" />
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out z-30">
        <h3 className="text-2xl md:text-3xl font-display tracking-widest text-white mb-3 uppercase">{title}</h3>
        <p className="text-base text-white/70 font-light mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{desc}</p>
      </div>
    </ScrollReveal>
  );
}
