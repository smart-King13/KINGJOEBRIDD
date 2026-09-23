'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CategoryCard } from './CategoryCard';

interface CategoryCarouselProps {
  categories: {
    title: string;
    desc: string;
    images: string[];
  }[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [isAtEnd, setIsAtEnd] = useState(false);
  const isAtEndRef = useRef(false);
  const [isPulling, setIsPulling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver to start the interval only when the component is actually in view
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // If in view, trigger the pull animation every 4 seconds
          intervalId = setInterval(() => {
            if (scrollContainerRef.current && !isAtEndRef.current) {
              setIsPulling(true);
              timeoutId = setTimeout(() => setIsPulling(false), 800);
            }
          }, 4000);
        } else {
          // Pause animation if scrolled out of view
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setIsPulling(false);
        }
      },
      { threshold: 0.5 }
    );

    const endObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsAtEnd(true);
          isAtEndRef.current = true;
          setIsPulling(false); // Stop pulling immediately
        } else {
          setIsAtEnd(false);
          isAtEndRef.current = false;
        }
      },
      { threshold: 0.5 } // 50% of the last card must be visible to stop animation
    );

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }
    
    if (lastCardRef.current) {
      endObserver.observe(lastCardRef.current);
    }

    return () => {
      observer.disconnect();
      endObserver.disconnect();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Calculate which card is currently in center view
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentIndex(index);
    }
  };

  return (
    <>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 px-5 md:px-0 pb-8 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-5 md:mx-0"
      >
        {categories.map((cat, i) => (
          <div 
            key={i} 
            ref={i === categories.length - 1 ? lastCardRef : null}
            className={`w-[calc(100vw-40px)] sm:w-[60vw] md:w-auto shrink-0 snap-center transform transition-all duration-[800ms] ease-in-out ${isPulling && i > currentIndex ? '-translate-x-[80px] shadow-[-15px_0_30px_rgba(0,0,0,0.3)] z-10' : 'translate-x-0'}`}
          >
            <CategoryCard
              title={cat.title}
              desc={cat.desc}
              images={cat.images}
              delay={i * 150}
            />
          </div>
        ))}
        {/* Spacer for right edge padding on mobile */}
        <div className="min-w-[1px] shrink-0 md:hidden"></div>
      </div>

      {!isAtEnd && (
        <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-[10px] font-bold tracking-widest uppercase text-[var(--color-ash)] transition-opacity duration-500">
          <span>Swipe to explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      )}
    </>
  );
}
